import { BaseService } from '../core/base.service';
import type { TransactionQueryParams, TransactionListResponse, CreateDisputeRequest } from './types';

/**
 * 交易服务
 * 处理订单和交易记录相关的 API 请求
 */
export class TransactionService extends BaseService {
  protected static readonly basePath = '/api/v1/order';

  /**
   * 获取交易记录列表（分页）
   * @param params - 查询参数
   * @returns 交易记录列表
   * @throws {UnauthorizedError} 当未登录时
   * @throws {ValidationError} 当参数验证失败时
   * 
   * @example
   * ```typescript
   * const result = await TransactionService.getTransactions({
   *   page: 1,
   *   page_size: 20,
   *   type: 'receive',
   *   status: 'success'
   * });
   * ```
   */
  static async getTransactions(params: TransactionQueryParams): Promise<TransactionListResponse> {
    return this.post<TransactionListResponse>('/transactions', params);
  }
  /**
   * 创建争议
   * @param data - 争议信息
   * @throws {UnauthorizedError} 当未登录时
   * @throws {NotFoundError} 当订单不存在或不符合争议条件时
   * @throws {ValidationError} 当参数验证失败时
   */
  static async createDispute(data: CreateDisputeRequest): Promise<void> {
    return this.post('/dispute', data);
  }
}

