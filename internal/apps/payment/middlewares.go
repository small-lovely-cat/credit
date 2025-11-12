/*
 * MIT License
 *
 * Copyright (c) 2025 linux.do
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package payment

import (
	"encoding/base64"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/linux-do/pay/internal/db"
	"github.com/linux-do/pay/internal/model"
	"github.com/linux-do/pay/internal/util"
)

// RequireMerchantAuth 验证商户 ClientID/ClientSecret（Basic Auth）
func RequireMerchantAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Authorization: Basic base64(ClientID:ClientSecret)
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, util.Err("缺少认证信息"))
			return
		}

		// 解析 Basic Auth
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Basic" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, util.Err("认证格式错误"))
			return
		}

		// 解码 base64
		decoded, err := base64.StdEncoding.DecodeString(parts[1])
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, util.Err("认证信息解码失败"))
			return
		}

		// 解析 ClientID:ClientSecret
		credentials := strings.SplitN(string(decoded), ":", 2)
		if len(credentials) != 2 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, util.Err("认证信息格式错误"))
			return
		}

		clientID := credentials[0]
		clientSecret := credentials[1]

		var apiKey model.MerchantAPIKey
		if err := db.DB(c.Request.Context()).
			Where("client_secret = ? AND client_id = ?", clientSecret, clientID).
			First(&apiKey).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, util.Err("认证失败"))
			return
		}

		SetAPIKeyToContext(c, &apiKey)

		c.Next()
	}
}
