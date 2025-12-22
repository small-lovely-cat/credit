import type { PayLevel } from '@/lib/services/auth/types';

/**
 * 系统配置信息
 */
export interface SystemConfig {
  /** 配置键 */
  key: string;
  /** 配置值 */
  value: string;
  /** 配置描述 */
  description: string;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

/**
 * 创建系统配置请求参数
 */
export interface CreateSystemConfigRequest {
  /** 配置键（最大64字符） */
  key: string;
  /** 配置值（最大255字符） */
  value: string;
  /** 配置描述（最大255字符，可选） */
  description?: string;
}

/**
 * 更新系统配置请求参数
 */
export interface UpdateSystemConfigRequest {
  /** 配置值（最大255字符） */
  value: string;
  /** 配置描述（最大255字符，可选） */
  description?: string;
}

/**
 * 用户积分配置信息
 */
export interface UserPayConfig {
  /** 配置ID */
  id: number;
  /** 积分等级 */
  level: PayLevel;
  /** 最低分数 */
  min_score: number;
  /** 最高分数（可选） */
  max_score: number | null;
  /** 每日限额（可选） */
  daily_limit: number | null;
  /** 手续费率（0-1之间的小数，最多2位小数） */
  fee_rate: number | string;
  /** 积分费率（0-1之间的小数，最多2位小数） */
  score_rate: number | string;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

/**
 * 创建用户积分配置请求参数
 */
export interface CreateUserPayConfigRequest {
  /** 积分等级 */
  level: PayLevel;
  /** 最低分数（必须 >= 0） */
  min_score: number;
  /** 最高分数（可选，必须大于 min_score） */
  max_score?: number | null;
  /** 每日限额（可选） */
  daily_limit?: number | null;
  /** 手续费率（0-1之间的小数，最多2位小数） */
  fee_rate: number | string;
  /** 积分费率（0-1之间的小数，最多2位小数） */
  score_rate: number | string;
}

/**
 * 更新用户积分配置请求参数
 */
export interface UpdateUserPayConfigRequest {
  /** 最低分数（必须 >= 0） */
  min_score: number;
  /** 最高分数（可选，必须大于 min_score） */
  max_score?: number | null;
  /** 每日限额（可选） */
  daily_limit?: number | null;
  /** 手续费率（0-1之间的小数，最多2位小数） */
  fee_rate: number | string;
  /** 积分费率（0-1之间的小数，最多2位小数） */
  score_rate: number | string;
}

