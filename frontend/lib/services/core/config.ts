/**
 * API 配置
 */

/**
 * 获取 API 基础 URL
 * @returns API 基础 URL
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_LINUX_DO_PAY_BACKEND_URL || '';
  }
  // 服务端环境，使用 Next.js rewrites 代理时为空
  return process.env.LINUX_DO_PAY_BACKEND_URL || '';
}

/**
 * API 配置选项
 */
export const apiConfig = {
  /** 基础 URL - 为空时使用相对路径，走 Next.js 代理 */
  baseURL: getApiBaseUrl(),
  /** 请求超时时间（毫秒） */
  timeout: 15000,
  /** 是否携带凭证 */
  withCredentials: true,
} as const;

