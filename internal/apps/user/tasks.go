/*
Copyright 2025 linux.do

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package user

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-redis/redis_rate/v10"
	"github.com/hibiken/asynq"
	"github.com/linux-do/credit/internal/config"
	"github.com/linux-do/credit/internal/db"
	"github.com/linux-do/credit/internal/logger"
	"github.com/linux-do/credit/internal/model"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

var (
	linuxDoRateLimiter *redis_rate.Limiter
	rateLimitKey       string
)

func init() {
	linuxDoRateLimiter = redis_rate.NewLimiter(db.Redis)
	rateLimitKey = db.PrefixedKey(linuxDoAPIRateLimitKey)
}

// waitForRateLimit 等待获取限流令牌（阻塞直到获取到令牌）
func waitForRateLimit(ctx context.Context, key string, limit redis_rate.Limit) error {
	for {
		res, err := linuxDoRateLimiter.Allow(ctx, key, limit)
		if err != nil {
			return fmt.Errorf("redis 限流器错误: %w", err)
		}
		if res.Allowed > 0 {
			return nil // 获取到令牌
		}
		// 未获取到令牌，等待后重试
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(res.RetryAfter):
			// 继续重试
		}
	}
}

// HandleUpdateUserGamificationScores 处理所有用户积分更新任务
func HandleUpdateUserGamificationScores(ctx context.Context, t *asynq.Task) error {
	// 分页处理用户
	pageSize := 1000
	lastID := uint64(0)

	// 计算一周前日期
	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	sessionAgeDays := config.Config.App.SessionAge / 86400
	if sessionAgeDays < 7 {
		sessionAgeDays = 7
	}
	oneWeekAgo := today.AddDate(0, 0, -sessionAgeDays)
	logger.InfoF(ctx, "[调度] 查询条件: 最后登录 >= %s, sessionAgeDays=%d", oneWeekAgo.Format("2006-01-02"), sessionAgeDays)

	for {
		var users []model.User
		if err := db.DB(ctx).Where("id > ? AND last_login_at >= ? AND is_active = ?", lastID, oneWeekAgo, true).
			Select("id, username").
			Order("id ASC").
			Limit(pageSize).
			Find(&users).Error; err != nil {
			logger.ErrorF(ctx, "查询用户失败: %v", err)
			return err
		}

		// 没有用户，退出循环
		if len(users) == 0 {
			break
		}

		for _, user := range users {
			rateLimit := config.Config.Worker.GamificationScoreRateLimit
			limit := redis_rate.Limit{
				Rate:   rateLimit.Rate,
				Burst:  1,
				Period: time.Duration(rateLimit.Period) * time.Second,
			}
			if err := waitForRateLimit(ctx, rateLimitKey, limit); err != nil {
				logger.ErrorF(ctx, "速率限制等待失败: %v", err)
				return err
			}

			if err := user.EnqueueBadgeScoreTask(ctx, 0); err != nil {
				return err
			}
		}

		lastID = users[len(users)-1].ID
	}
	return nil
}

// HandleUpdateSingleUserGamificationScore 处理单个用户积分更新任务
func HandleUpdateSingleUserGamificationScore(ctx context.Context, t *asynq.Task) error {
	// 解析任务参数
	var payload struct {
		UserID uint64 `json:"user_id"`
	}
	if err := json.Unmarshal(t.Payload(), &payload); err != nil {
		return fmt.Errorf("解析任务参数失败: %w", err)
	}

	var user model.User
	if err := user.GetByID(db.DB(ctx), payload.UserID); err != nil {
		return fmt.Errorf("查询用户ID[%d]失败: %w", payload.UserID, err)
	}

	// 获取用户积分
	response, errGet := user.GetUserGamificationScore(ctx)
	if errGet != nil {
		logger.ErrorF(ctx, "处理用户[%s]失败: %v", user.Username, errGet)
		return errGet
	}

	newCommunityBalance := decimal.NewFromInt(response.User.GamificationScore)

	if user.CommunityBalance.IsZero() && user.TotalCommunity.IsZero() {
		if err := db.DB(ctx).Model(&user).UpdateColumns(map[string]interface{}{
			"community_balance": newCommunityBalance,
		}).Error; err != nil {
			return fmt.Errorf("初始化用户[%s]社区积分失败: %w", user.Username, err)
		}
		logger.InfoF(ctx, "用户[%s]首次同步社区积分: %s", user.Username, newCommunityBalance.String())
		return nil
	}

	if newCommunityBalance.Equal(user.CommunityBalance) {
		logger.InfoF(ctx, "用户[%s]积分未变化，跳过更新", user.Username)
		return nil
	}

	// 计算差值
	diff := newCommunityBalance.Sub(user.CommunityBalance)

	if diff.IsNegative() {
		protectionDays, _ := model.GetIntByKey(ctx, model.ConfigKeyNewUserProtectionDays)
		if protectionDays > 0 {
			registeredDays := int(time.Since(user.CreatedAt).Hours() / 24)
			if registeredDays < protectionDays {
				if err := db.DB(ctx).Model(&user).UpdateColumns(map[string]interface{}{
					"community_balance": newCommunityBalance,
				}).Error; err != nil {
					return fmt.Errorf("更新用户[%s]积分失败: %w", user.Username, err)
				}

				logger.InfoF(ctx, "用户[%s]在保护期内(注册%d天，保护期%d天)，积分下降%s，跳过扣分",
					user.Username, registeredDays, protectionDays, diff.Abs().String())
				return nil
			}
		}
	}

	oldCommunityBalance := user.CommunityBalance
	now := time.Now()

	if err := db.DB(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&user).UpdateColumns(map[string]interface{}{
			"community_balance": newCommunityBalance,
			"total_community":   gorm.Expr("total_community + ?", diff),
			"total_receive":     gorm.Expr("total_receive + ?", diff),
			"available_balance": gorm.Expr("available_balance + ?", diff),
		}).Error; err != nil {
			return fmt.Errorf("更新用户[%s]积分失败: %w", user.Username, err)
		}

		order := model.Order{
			OrderName:   "社区积分更新",
			PayerUserID: 0,
			PayeeUserID: user.ID,
			Amount:      diff,
			Status:      model.OrderStatusSuccess,
			Type:        model.OrderTypeCommunity,
			Remark:      fmt.Sprintf("社区积分从 %s 更新到 %s，变化 %s", oldCommunityBalance.String(), newCommunityBalance.String(), diff.String()),
			TradeTime:   now,
			ExpiresAt:   now,
		}
		if err := tx.Create(&order).Error; err != nil {
			return fmt.Errorf("创建用户[%s]社区积分订单失败: %w", user.Username, err)
		}

		return nil
	}); err != nil {
		logger.ErrorF(ctx, "处理用户[%s]积分更新失败: %v", user.Username, err)
		return err
	}

	return nil
}
