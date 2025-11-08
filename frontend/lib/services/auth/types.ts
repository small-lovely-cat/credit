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
  /** 评分 */
  score: number;
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

