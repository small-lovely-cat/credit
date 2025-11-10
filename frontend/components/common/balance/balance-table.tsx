"use client"

import * as React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileTextIcon, BarChartIcon } from "lucide-react"
import { useTransactions } from "@/hooks/use-balance"
import type { Transaction, TransactionType } from "@/lib/services"
import { Button } from "@/components/ui/button"
import { ErrorInline } from "@/components/common/status/error"
import { EmptyStateWithBorder } from "@/components/common/status/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"

const TAB_TRIGGER_STYLES = "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-0 data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] bg-transparent rounded-none border-0 border-b-2 border-transparent px-0 text-sm font-bold text-muted-foreground data-[state=active]:text-[#6366f1] -mb-[2px] relative hover:text-foreground transition-colors flex-none"

/**
 * 余额活动表格组件
 * 显示收款、转账、社区划转和所有活动的交易记录（支持分页）
 * 
 * @example
 * ```tsx
 * <BalanceTable />
 * ```
 */
export function BalanceTable() {
  const [activeTab, setActiveTab] = useState<TransactionType | 'all'>('all')

  return (
    <div>
      <div className="font-semibold py-4">近期活动</div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TransactionType | 'all')} className="w-full">
        <TabsList className="flex p-0 gap-4 rounded-none w-full bg-transparent justify-start border-b border-border">
          <TabsTrigger value="receive" className={TAB_TRIGGER_STYLES}>
            收款
          </TabsTrigger>
          <TabsTrigger value="transfer" className={TAB_TRIGGER_STYLES}>
            转账
          </TabsTrigger>
          <TabsTrigger value="community" className={TAB_TRIGGER_STYLES}>
            社区划转
          </TabsTrigger>
          <TabsTrigger value="all" className={TAB_TRIGGER_STYLES}>
            所有活动
          </TabsTrigger>
        </TabsList>

        <TabsContent value="receive" className="mt-2">
          <TransactionListWithPagination type="receive" />
        </TabsContent>

        <TabsContent value="transfer" className="mt-2">
          <TransactionListWithPagination type="transfer" />
        </TabsContent>

        <TabsContent value="community" className="mt-2">
          <TransactionListWithPagination type="community" />
        </TabsContent>

        <TabsContent value="all" className="mt-2">
          <TransactionListWithPagination />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * 带分页的交易列表组件
 */
function TransactionListWithPagination({ type }: { type?: TransactionType }) {
  const { data, loading, error, refetch, loadMore, loadingMore } = useTransactions({
    type,
    page_size: 20,
  })

  if (loading) {
    return (
      <div className="bg-muted rounded-lg overflow-hidden">
        <div className="overflow-x-auto p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap w-[180px]">订单名称</TableHead>
                <TableHead className="whitespace-nowrap text-center w-[80px]">类型</TableHead>
                <TableHead className="whitespace-nowrap text-right w-[120px]">订单金额</TableHead>
                <TableHead className="whitespace-nowrap text-center w-[140px]">交易双方</TableHead>
                <TableHead className="whitespace-nowrap text-center w-[160px]">订单号</TableHead>
                <TableHead className="whitespace-nowrap text-center w-[160px]">商户订单号</TableHead>
                <TableHead className="whitespace-nowrap text-center w-[120px]">订单时间</TableHead>
                <TableHead className="whitespace-nowrap text-center w-[80px]">状态</TableHead>
                <TableHead className="sticky right-0 whitespace-nowrap text-center bg-muted shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)] w-[150px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, i) => (
                <TableRow key={i} className="h-8">
                  <TableCell className="py-1">
                    <Skeleton className="h-3 w-full" />
                  </TableCell>
                  <TableCell className="py-1">
                    <Skeleton className="h-4 w-12 mx-auto" />
                  </TableCell>
                  <TableCell className="py-1">
                    <Skeleton className="h-3 w-16 ml-auto" />
                  </TableCell>
                  <TableCell className="py-1">
                    <Skeleton className="h-4 w-20 mx-auto rounded-full" />
                  </TableCell>
                  <TableCell className="py-1">
                    <Skeleton className="h-3 w-full" />
                  </TableCell>
                  <TableCell className="py-1">
                    <Skeleton className="h-3 w-full" />
                  </TableCell>
                  <TableCell className="py-1">
                    <Skeleton className="h-3 w-full" />
                  </TableCell>
                  <TableCell className="py-1">
                    <Skeleton className="h-4 w-12 mx-auto" />
                  </TableCell>
                  <TableCell className="sticky right-0 bg-muted py-1">
                    <Skeleton className="h-5 w-12 mx-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 border-2 border-dashed border-border rounded-lg">
        <ErrorInline error={error} onRetry={refetch} className="justify-center" />
      </div>
    )
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyStateWithBorder
        icon={type === 'transfer' ? BarChartIcon : FileTextIcon}
        description={getEmptyMessage(type)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-muted rounded-lg overflow-hidden">
        <div className="overflow-x-auto p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap w-[180px]">名称</TableHead>
                <TableHead className="whitespace-nowrap text-center w-[80px]">类型</TableHead>
                <TableHead className="whitespace-nowrap text-right w-[120px]">金额</TableHead>
                <TableHead className="whitespace-nowrap text-center w-[140px]">交易双方</TableHead>
                <TableHead className="whitespace-nowrap text-center w-[160px]">订单号</TableHead>
                <TableHead className="whitespace-nowrap text-center w-[160px]">商户订单号</TableHead>
                <TableHead className="whitespace-nowrap text-center w-[120px]">时间</TableHead>
                <TableHead className="whitespace-nowrap text-center w-[80px]">状态</TableHead>
                <TableHead className="sticky right-0 whitespace-nowrap text-center bg-muted shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)] w-[150px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody key={`${type}-${data.page}`} className="animate-in fade-in duration-200">
              {data.items.map((transaction) => (
                <TransactionTableRow key={transaction.orderNo} transaction={transaction} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {data.page < data.total_pages && (
        <Button
          variant="outline"
          onClick={loadMore}
          disabled={loadingMore}
          className="w-full"
        >
          {loadingMore ? '加载中...' : `加载更多 (${data.items.length}/${data.total})`}
        </Button>
      )}

      {data.page >= data.total_pages && data.total > 0 && (
        <div className="pt-2 text-center text-xs text-muted-foreground">
          已加载全部 {data.total} 条记录
        </div>
      )}
    </div>
  )
}

/**
 * 交易表格行组件
 */
function TransactionTableRow({ transaction }: { transaction: Transaction }) {
  const typeConfig = {
    receive: { label: '收款', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    payment: { label: '付款', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    transfer: { label: '转账', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    community: { label: '社区划转', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' }
  }

  const statusConfig = {
    success: { label: '成功', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    pending: { label: '处理中', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    failed: { label: '失败', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
  }

  const getAmountDisplay = (amount: number) => {
    return (
      <span className="text-xs font-semibold">
        {amount.toFixed(2)}
      </span>
    )
  }

  return (
    <TableRow className="h-8">
      <TableCell className="text-xs font-medium whitespace-nowrap py-1">
        {transaction.orderName}
      </TableCell>
      <TableCell className="whitespace-nowrap text-center py-1">
        <Badge
          variant="secondary"
          className={`text-[11px] px-1 ${typeConfig[transaction.type].color}`}
        >
          {typeConfig[transaction.type].label}
        </Badge>
      </TableCell>
      <TableCell className="whitespace-nowrap text-right py-1">
        {getAmountDisplay(transaction.amount)}
      </TableCell>
      <TableCell className="whitespace-nowrap text-center py-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center cursor-pointer gap-1 justify-center">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="text-[9px] bg-primary text-primary-foreground">
                    {transaction.payer_name.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-xs font-bold">⭢</div>
                <Avatar className="h-4 w-4">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="text-[9px] bg-primary text-primary-foreground">
                    {transaction.payee_name.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="p-3">
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold">付款方</p>
                  <p className="text-xs">账户: {transaction.payer_name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold">收款方</p>
                  <p className="text-xs">账户: {transaction.payee_name}</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="font-mono text-xs text-center py-1">
        {transaction.orderNo}
      </TableCell>
      <TableCell className="font-mono text-xs text-center py-1">
        {transaction.merchantOrderNo}
      </TableCell>
      <TableCell className="text-xs text-center py-1">
        {transaction.time}
      </TableCell>
      <TableCell className="whitespace-nowrap text-center py-1">
        <Badge
          variant="secondary"
          className={`text-[11px] px-1 ${statusConfig[transaction.status].color}`}
        >
          {statusConfig[transaction.status].label}
        </Badge>
      </TableCell>
      <TableCell className="sticky right-0 whitespace-nowrap text-center bg-muted shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)] py-1">
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          详情
        </Button>
      </TableCell>
    </TableRow>
  )
}

/**
 * 获取空状态提示信息
 */
function getEmptyMessage(type?: TransactionType): string {
  const messages: Record<TransactionType, string> = {
    receive: '未发现收款记录',
    payment: '未发现付款记录',
    transfer: '未发现转账记录',
    community: '未发现社区划转记录',
  }
  return type ? messages[type] : '未发现活动'
}
