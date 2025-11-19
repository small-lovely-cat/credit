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

package model

import (
	"time"
)

type DisputeStatus string

const (
	DisputeStatusDisputing DisputeStatus = "disputing"
	DisputeStatusRefund    DisputeStatus = "refund"
	DisputeStatusClosed    DisputeStatus = "closed"
)

type Dispute struct {
	ID                uint64        `json:"id" gorm:"primaryKey;autoIncrement"`
	OrderID           uint64        `json:"order_id" gorm:"uniqueIndex:idx_dispute_order;index:idx_dispute_order_status,priority:1;not null"`
	InitiatorUserID   uint64        `json:"initiator_user_id" gorm:"not null;index:idx_initiator_status_created,priority:1"`
	Reason            string        `json:"reason" gorm:"size:500;not null"`
	Status            DisputeStatus `json:"status" gorm:"type:varchar(20);index;index:idx_dispute_order_status,priority:2;index:idx_initiator_status_created,priority:2;not null;default:'disputing'"`
	HandlerUserID     *uint64       `json:"handler_user_id" gorm:"index"`
	InitiatorUsername string        `json:"initiator_username" gorm:"-"`
	HandlerUsername   string        `json:"handler_username" gorm:"-"`
	CreatedAt         time.Time     `json:"created_at" gorm:"autoCreateTime;index:idx_initiator_status_created,priority:3"`
	UpdatedAt         time.Time     `json:"updated_at" gorm:"autoUpdateTime"`
}
