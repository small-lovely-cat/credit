"use client"

import { useState, useEffect } from 'react'
import { User, TrustLevel } from '@/lib/services/auth/types'
import services from '@/lib/services'

/**
 * 用户状态接口
 */
interface UserState {
  user: User | null
  loading: boolean
  error: string | null
}

/**
 * 信任等级映射
 */
const TRUST_LEVEL_LABELS: Record<TrustLevel, string> = {
  [TrustLevel.New]: 'Trust Level 0',
  [TrustLevel.Basic]: 'Trust Level 1',
  [TrustLevel.Member]: 'Trust Level 2',
  [TrustLevel.Regular]: 'Trust Level 3',
  [TrustLevel.Leader]: 'Trust Level 4',
}

/**
 * 用户信息hook
 * 用于获取和管理当前登录用户信息
 *
 * @example
 * ```tsx
 * const { user, loading, error } = useUser()
 *
 * if (loading) return <div>加载中...</div>
 * if (error) return <div>错误: {error}</div>
 * if (!user) return <div>未登录</div>
 *
 * return <div>欢迎, {user.username}!</div>
 * ```
 */
export function useUser(): UserState & {
  refetch: () => Promise<void>
  getTrustLevelLabel: (trustLevel: TrustLevel) => string
  logout: () => Promise<void>
} {
  const [state, setState] = useState<UserState>({
    user: null,
    loading: true,
    error: null,
  })

  /**
   * 获取信任等级标签
   */
  const getTrustLevelLabel = (trustLevel: TrustLevel): string => {
    return TRUST_LEVEL_LABELS[trustLevel] || '未知'
  }

  /**
   * 获取用户信息
   */
  const fetchUser = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const user = await services.auth.getUserInfo()
      setState({ user, loading: false, error: null })
    } catch (error) {
      setState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : '获取用户信息失败',
      })
    }
  }

  /**
   * 重新获取用户信息
   */
  const refetch = async () => {
    await fetchUser()
  }

  /**
   * 用户登出
   */
  const logout = async () => {
    try {
      await services.auth.logout()
      setState({ user: null, loading: false, error: null })
      // 重定向到登录页
      window.location.href = '/login'
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '登出失败',
      }))
    }
  }

  // 组件挂载时获取用户信息
  useEffect(() => {
    fetchUser()
  }, [])

  return {
    ...state,
    refetch,
    getTrustLevelLabel,
    logout,
  }
}
