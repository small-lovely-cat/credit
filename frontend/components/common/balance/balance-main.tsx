"use client"

import * as React from "react"
import { useUser } from "@/contexts/user-context"
import { BalanceSummary } from "./balance-summary"
import { BalanceTable } from "./balance-table"
import { BalanceReport } from "./balance-report"

/**
 * 余额主页面组件
 * 负责组装余额页面的各个子组件
 * 
 * @example
 * ```tsx
 * <BalanceMain />
 * ```
 */
export function BalanceMain() {
  const { user, loading } = useUser()

  const totalBalance = user?.total_balance ?? 0

  return (
    <div className="py-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <h1 className="text-2xl">
          <span className="font-semibold">余额</span>
          <span className="pl-2">LDC</span>
          <span className="pl-2">{loading ? '-' : totalBalance.toFixed(2)}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-4">
          <BalanceSummary currency="LDC" />
          <BalanceTable />
        </div>

        <div className="lg:col-span-1">
          <BalanceReport />
        </div>
      </div>
    </div>
  )
}