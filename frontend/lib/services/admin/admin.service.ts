import { BaseService } from '../core/base.service';
import type {
  SystemConfig,
  CreateSystemConfigRequest,
  UpdateSystemConfigRequest,
  UserPayConfig,
  CreateUserPayConfigRequest,
  UpdateUserPayConfigRequest,
} from './types';

/**
 * 管理员服务
 * 处理系统配置和用户积分配置管理相关的 API 请求
 * 
 * @remarks
 * 所有接口都需要管理员权限
 */
export class AdminService extends BaseService {
  protected static readonly basePath = '/api/v1/admin';

  // ==================== 系统配置管理 ====================

  /**
   * 创建系统配置
   * @param request - 创建系统配置的请求参数
   * @returns void
   * @throws {UnauthorizedError} 当未登录时
   * @throws {ForbiddenError} 当无管理员权限时
   * @throws {ValidationError} 当参数验证失败或配置键已存在时
   * 
   * @example
   * ```typescript
   * await AdminService.createSystemConfig({
   *   key: 'app.version',
   *   value: '1.0.0',
   *   description: '应用版本号'
   * });
   * ```
   */
  static async createSystemConfig(
    request: CreateSystemConfigRequest,
  ): Promise<void> {
    return this.post<void>('/system-configs', request);
  }

  /**
   * 获取系统配置列表
   * @returns 系统配置列表
   * @throws {UnauthorizedError} 当未登录时
   * @throws {ForbiddenError} 当无管理员权限时
   * 
   * @example
   * ```typescript
   * const configs = await AdminService.listSystemConfigs();
   * console.log('系统配置数量:', configs.length);
   * ```
   */
  static async listSystemConfigs(): Promise<SystemConfig[]> {
    return this.get<SystemConfig[]>('/system-configs');
  }

  /**
   * 获取单个系统配置
   * @param key - 配置键
   * @returns 系统配置信息
   * @throws {UnauthorizedError} 当未登录时
   * @throws {ForbiddenError} 当无管理员权限时
   * @throws {NotFoundError} 当配置不存在时
   * 
   * @example
   * ```typescript
   * const config = await AdminService.getSystemConfig('app.version');
   * console.log('应用版本:', config.value);
   * ```
   */
  static async getSystemConfig(key: string): Promise<SystemConfig> {
    return this.get<SystemConfig>(`/system-configs/${key}`);
  }

  /**
   * 更新系统配置
   * @param key - 配置键
   * @param request - 更新系统配置的请求参数
   * @returns void
   * @throws {UnauthorizedError} 当未登录时
   * @throws {ForbiddenError} 当无管理员权限时
   * @throws {NotFoundError} 当配置不存在时
   * @throws {ValidationError} 当参数验证失败时
   * 
   * @example
   * ```typescript
   * await AdminService.updateSystemConfig('app.version', {
   *   value: '1.1.0',
   *   description: '更新到新版本'
   * });
   * ```
   */
  static async updateSystemConfig(
    key: string,
    request: UpdateSystemConfigRequest,
  ): Promise<void> {
    return this.put<void>(`/system-configs/${key}`, request);
  }

  /**
   * 删除系统配置
   * @param key - 配置键
   * @returns void
   * @throws {UnauthorizedError} 当未登录时
   * @throws {ForbiddenError} 当无管理员权限时
   * @throws {NotFoundError} 当配置不存在时
   * 
   * @example
   * ```typescript
   * await AdminService.deleteSystemConfig('app.version');
   * ```
   */
  static async deleteSystemConfig(key: string): Promise<void> {
    return this.delete<void>(`/system-configs/${key}`);
  }

  // ==================== 用户积分配置管理 ====================

  /**
   * 创建用户积分配置
   * @param request - 创建用户积分配置的请求参数
   * @returns 创建的用户积分配置
   * @throws {UnauthorizedError} 当未登录时
   * @throws {ForbiddenError} 当无管理员权限时
   * @throws {ValidationError} 当参数验证失败或等级已存在时
   * 
   * @example
   * ```typescript
   * const config = await AdminService.createUserPayConfig({
   *   level: PayLevel.Premium,
   *   min_score: 1000,
   *   max_score: null,
   *   daily_limit: 100000,
   *   fee_rate: 0.01
   * });
   * console.log('配置ID:', config.id);
   * ```
   * 
   * @remarks
   * - min_score 必须 >= 0
   * - max_score 必须大于 min_score（如果提供）
   * - fee_rate 必须在 0-1 之间，最多2位小数
   */
  static async createUserPayConfig(
    request: CreateUserPayConfigRequest,
  ): Promise<UserPayConfig> {
    return this.post<UserPayConfig>('/user-pay-configs', request);
  }

  /**
   * 获取用户积分配置列表
   * @returns 用户积分配置列表（按最低分数升序排序）
   * @throws {UnauthorizedError} 当未登录时
   * @throws {ForbiddenError} 当无管理员权限时
   * 
   * @example
   * ```typescript
   * const configs = await AdminService.listUserPayConfigs();
   * console.log('积分配置数量:', configs.length);
   * ```
   */
  static async listUserPayConfigs(): Promise<UserPayConfig[]> {
    return this.get<UserPayConfig[]>('/user-pay-configs');
  }

  /**
   * 获取单个用户积分配置
   * @param id - 配置ID
   * @returns 用户积分配置信息
   * @throws {UnauthorizedError} 当未登录时
   * @throws {ForbiddenError} 当无管理员权限时
   * @throws {NotFoundError} 当配置不存在时
   * 
   * @example
   * ```typescript
   * const config = await AdminService.getUserPayConfig(123);
   * console.log('手续费率:', config.fee_rate);
   * ```
   */
  static async getUserPayConfig(id: number): Promise<UserPayConfig> {
    return this.get<UserPayConfig>(`/user-pay-configs/${id}`);
  }

  /**
   * 更新用户积分配置
   * @param id - 配置ID
   * @param request - 更新用户积分配置的请求参数
   * @returns void
   * @throws {UnauthorizedError} 当未登录时
   * @throws {ForbiddenError} 当无管理员权限时
   * @throws {NotFoundError} 当配置不存在时
   * @throws {ValidationError} 当参数验证失败时
   * 
   * @example
   * ```typescript
   * await AdminService.updateUserPayConfig(123, {
   *   min_score: 500,
   *   max_score: 999,
   *   daily_limit: 50000,
   *   fee_rate: 0.02
   * });
   * ```
   * 
   * @remarks
   * - min_score 必须 >= 0
   * - max_score 必须大于 min_score（如果提供）
   * - fee_rate 必须在 0-1 之间，最多2位小数
   */
  static async updateUserPayConfig(
    id: number,
    request: UpdateUserPayConfigRequest,
  ): Promise<void> {
    return this.put<void>(`/user-pay-configs/${id}`, request);
  }

  /**
   * 删除用户积分配置
   * @param id - 配置ID
   * @returns void
   * @throws {UnauthorizedError} 当未登录时
   * @throws {ForbiddenError} 当无管理员权限时
   * @throws {NotFoundError} 当配置不存在时
   * 
   * @example
   * ```typescript
   * await AdminService.deleteUserPayConfig(123);
   * ```
   */
  static async deleteUserPayConfig(id: number): Promise<void> {
    return this.delete<void>(`/user-pay-configs/${id}`);
  }
}

