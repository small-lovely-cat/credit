import { useState, useEffect } from 'react'
import { ConfigService, PublicConfigResponse } from '@/lib/services'

/**
 * 使用公共配置 Hook
 * 自动获取并缓存公共配置，避免重复请求
 * 
 * @returns 公共配置数据、加载状态和错误信息
 * 
 * @example
 * ```tsx
 * const { config, loading, error } = usePublicConfig()
 * 
 * if (loading) return <Spinner />
 * if (error) return <Error message={error.message} />
 * 
 * console.log('争议时间窗口:', config.dispute_time_window_hours)
 * ```
 */
export function usePublicConfig() {
  const [config, setConfig] = useState<PublicConfigResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchConfig = async () => {
      try {
        const data = await ConfigService.getPublicConfig()
        if (mounted) {
          setConfig(data)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('获取配置失败'))
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchConfig()

    return () => {
      mounted = false
    }
  }, [])

  return { config, loading, error }
}
