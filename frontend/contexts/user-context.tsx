"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, TrustLevel, PayLevel } from '@/lib/services/auth/types'
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
 * 用户上下文接口
 */
interface UserContextValue extends UserState {
  refetch: () => Promise<void>
  getTrustLevelLabel: (trustLevel: TrustLevel) => string
  getPayLevelLabel: (payLevel: PayLevel) => string
  logout: () => Promise<void>
}

/**
 * 信任等级映射
 */
const TRUST_LEVEL_LABELS: Record<TrustLevel, string> = {
  [TrustLevel.New]: '新用户',
  [TrustLevel.Basic]: '基本用户',
  [TrustLevel.Member]: '成员',
  [TrustLevel.Regular]: '活跃用户',
  [TrustLevel.Leader]: '领导者',
}

/**
 * 支付等级映射
 */
const PAY_LEVEL_LABELS: Record<PayLevel, string> = {
  [PayLevel.BlackGold]: '黑金',
  [PayLevel.WhiteGold]: '白金',
  [PayLevel.Gold]: '黄金',
  [PayLevel.Platinum]: '铂金',
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

/**
 * 用户Provider组件
 */
export function UserProvider({ children }: { children: ReactNode }) {
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
   * 获取支付等级标签
   */
  const getPayLevelLabel = (payLevel: PayLevel): string => {
    return PAY_LEVEL_LABELS[payLevel] || '未知'
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

  return (
    <UserContext.Provider
      value={{
        ...state,
        refetch,
        getTrustLevelLabel,
        getPayLevelLabel,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

/**
 * 使用用户上下文的Hook
 */
export function useUser(): UserContextValue {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

