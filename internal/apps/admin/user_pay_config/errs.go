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
 * OUT OF OR IN CONNECTION WITH THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package user_pay_config

const (
	UserPayConfigNotFound       = "支付配置不存在"
	LevelRequired               = "等级不能为空"
	MinScoreRequired            = "最小分数不能为空"
	ScoreRangeInvalid           = "分数范围无效：最大分数必须大于最小分数"
	FeeRateInvalid              = "费率必须在 0 到 1 之间"
	LevelExists                 = "等级已存在"
	AmountDecimalPlacesExceeded = "金额小数位数不能超过2位"
)
