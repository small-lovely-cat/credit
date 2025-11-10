/**
 * 余额服务相关类型定义
 */

/**
 * 交易类型
 */
export type TransactionType = 'receive' | 'payment' | 'transfer' | 'community';

/**
 * 交易状态
 */
export type TransactionStatus = 'success' | 'pending' | 'failed';

/**
 * 交易记录
 */
export interface Transaction {
  /** 订单名称 */
  orderName: string;
  /** 交易类型 */
  type: TransactionType;
  /** 交易金额 */
  amount: number;
  /** 付款方用户名 */
  payer_name: string;
  /** 收款方用户名 */
  payee_name: string;
  /** 订单号 */
  orderNo: string;
  /** 商户订单号 */
  merchantOrderNo: string;
  /** 交易时间 */
  time: string;
  /** 交易状态 */
  status: TransactionStatus;
}

/**
 * 余额信息
 */
export interface Balance {
  /** 总余额 */
  total: number;
  /** 可用余额 */
  available: number;
  /** 未来款项 */
  pending: number;
}

/**
 * 交易查询参数
 */
export interface TransactionQueryParams {
  /** 交易类型 */
  type?: TransactionType;
  /** 交易状态 */
  status?: TransactionStatus;
  /** 开始时间 */
  startTime?: string;
  /** 结束时间 */
  endTime?: string;
  /** 页码，从1开始 */
  page?: number;
  /** 每页数量，默认20 */
  page_size?: number;
}

