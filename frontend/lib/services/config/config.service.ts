import { BaseService } from '../core/base.service';
import type { PublicConfigResponse } from './types';

/**
 * 配置服务
 * 处理系统公共配置相关的 API 请求
 */
export class ConfigService extends BaseService {
  protected static readonly basePath = '/api/v1/config';

  /**
   * 获取公共配置
   * @returns 公共配置信息
   * 
   * @example
   * ```typescript
   * const config = await ConfigService.getPublicConfig();
   * console.log('争议时间窗口:', config.dispute_time_window_hours, '小时');
   * ```
   */
  static async getPublicConfig(): Promise<PublicConfigResponse> {
    return this.get<PublicConfigResponse>('/public');
  }
}
