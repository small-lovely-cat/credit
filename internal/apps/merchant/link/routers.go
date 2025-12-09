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

package link

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/linux-do/pay/internal/apps/merchant"
	"github.com/linux-do/pay/internal/db"
	"github.com/linux-do/pay/internal/model"
	"github.com/linux-do/pay/internal/util"
)

// CreatePaymentLink 创建支付链接
// @Tags merchant
// @Accept json
// @Produce json
// @Param id path uint64 true "API Key ID"
// @Success 200 {object} util.ResponseAny
// @Router /api/v1/merchant/api-keys/{id}/payment-links [post]
func CreatePaymentLink(c *gin.Context) {
	apiKey, _ := util.GetFromContext[*model.MerchantAPIKey](c, merchant.APIKeyObjKey)

	paymentLink := model.MerchantPaymentLink{
		MerchantAPIKeyID: apiKey.ID,
		Token:            util.GenerateUniqueIDSimple(),
	}

	if err := db.DB(c.Request.Context()).Create(&paymentLink).Error; err != nil {
		c.JSON(http.StatusInternalServerError, util.Err(err.Error()))
		return
	}

	c.JSON(http.StatusOK, util.OK(paymentLink))
}

// ListPaymentLinks 获取支付链接列表
// @Tags merchant
// @Produce json
// @Param id path uint64 true "API Key ID"
// @Success 200 {object} util.ResponseAny
// @Router /api/v1/merchant/api-keys/{id}/payment-links [get]
func ListPaymentLinks(c *gin.Context) {
	apiKey, _ := util.GetFromContext[*model.MerchantAPIKey](c, merchant.APIKeyObjKey)

	var paymentLinks []model.MerchantPaymentLink
	if err := db.DB(c.Request.Context()).
		Where("merchant_api_key_id = ?", apiKey.ID).
		Order("created_at DESC").
		Find(&paymentLinks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, util.Err(err.Error()))
		return
	}

	c.JSON(http.StatusOK, util.OK(paymentLinks))
}

// DeletePaymentLink 删除支付链接
// @Tags merchant
// @Produce json
// @Param id path uint64 true "API Key ID"
// @Param linkId path uint64 true "Payment Link ID"
// @Success 200 {object} util.ResponseAny
// @Router /api/v1/merchant/api-keys/{id}/payment-links/{linkId} [delete]
func DeletePaymentLink(c *gin.Context) {
	apiKey, _ := util.GetFromContext[*model.MerchantAPIKey](c, merchant.APIKeyObjKey)
	linkID := c.Param("linkId")

	result := db.DB(c.Request.Context()).
		Where("id = ? AND merchant_api_key_id = ?", linkID, apiKey.ID).
		Delete(&model.MerchantPaymentLink{})

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, util.Err(result.Error.Error()))
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, util.Err(merchant.PaymentLinkNotFound))
		return
	}

	c.JSON(http.StatusOK, util.OKNil())
}
