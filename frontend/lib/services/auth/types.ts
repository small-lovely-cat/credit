/**
 * 信任等级
 */
export enum TrustLevel {
  /** 新用户 */
  New = 0,
  /** 基础用户 */
  Basic = 1,
  /** 成员 */
  Member = 2,
  /** 常规用户 */
  Regular = 3,
  /** 领导者 */
  Leader = 4,
}

/**
 * 支付等级
 */
export enum PayLevel {
  /** 黑金 */
  BlackGold = 0,
  /** 白金 */
  WhiteGold = 1,
  /** 黄金 */
  Gold = 2,
  /** 铂金 */
  Platinum = 3,
}

/**
 * 用户基本信息
 */
export interface User {
  /** 用户 ID */
  id: number;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 信任等级 */
  trust_level: TrustLevel;
  /** 头像 URL */
  avatar_url: string;
  /** 支付评分 */
  pay_score: number;
  /** 总余额 */
  total_balance: number;
  /** 可用余额 */
  available_balance: number;
  /** 当日剩余配额 */
  remain_quota: number;
  /** 支付等级 */
  pay_level: PayLevel;
  /** 每日限额 */
  daily_limit: number | null;
}

/**
 * OAuth 登录 URL 响应
 * 后端直接返回字符串 URL
 */
export type OAuthLoginUrlResponse = string;

/**
 * OAuth 回调请求参数
 */
export interface OAuthCallbackRequest {
  /** 状态码 */
  state: string;
  /** 授权码 */
  code: string;
}

