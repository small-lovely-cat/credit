"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, Check } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Spinner } from "@/components/ui/spinner"
import { motion, AnimatePresence } from "motion/react"
import services from "@/lib/services"
import { toast } from "sonner"

export function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 判断是否为OAuth回调
  const [isProcessingCallback, setIsProcessingCallback] = useState(() => {
    const state = searchParams.get('state')
    const code = searchParams.get('code')
    return !!(state && code)
  })
  
  // 登录成功状态
  const [loginSuccess, setLoginSuccess] = useState(false)
  
  // 轮播标语
  const slogans = [
    "Fast and convenient payment solution.",
    "Pay your bills with ease and security.",
    "Secure transactions, anytime, anywhere.",
    "Your trusted payment partner."
  ]
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0)
  
  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSloganIndex((prev) => (prev + 1) % slogans.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [slogans.length])

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const state = searchParams.get('state')
      const code = searchParams.get('code')
    
      // 如果存在state和code，则处理OAuth回调
      if (state && code) {
        setIsProcessingCallback(true)
        try {
          await services.auth.handleCallback({ state, code })
          setLoginSuccess(true)
          toast.success("登录成功")

          setTimeout(() => {
            router.replace('/home')
          }, 1500)
        } catch (error) {
          console.error('OAuth callback error:', error)
          toast.error(error instanceof Error ? error.message : "登录失败，请重试")
          setIsProcessingCallback(false)
          router.replace('/login')
        }
      }
    }
    // 处理OAuth回调
    handleOAuthCallback()
  }, [searchParams, router])

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex items-center justify-center">
              <CreditCard className="size-5" />
            </div>
            LINUX DO PAY
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <AnimatePresence mode="wait">
            {isProcessingCallback ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-4"
              >
                {loginSuccess ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      className="mx-auto w-12 h-12 rounded-full bg-green-500 flex items-center justify-center"
                    >
                      <Check className="w-6 h-6 text-white" strokeWidth={3} />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2"
                    >
                      <div className="text-lg font-semibold">验证成功</div>
                      <p className="text-sm text-muted-foreground">即将跳转至首页...</p>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <div className="text-lg font-medium flex items-center justify-center gap-2">
                      <Spinner/>
                      <span>正在验证您的登录信息</span>
                    </div>
                    <p className="text-sm text-muted-foreground">请稍候，即将完成验证...</p>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-xs"
              >
                <LoginForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="relative hidden lg:flex items-center justify-center bg-muted">
        <div className="absolute inset-0 z-0">
          <AuroraBackground>
            <motion.div
              initial={{ opacity: 0.0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="relative z-10 flex flex-col gap-4 items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.4,
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="text-6xl font-bold dark:text-white text-center"
              >
                LINUX DO <span className="text-7xl italic font-serif text-blue-800 dark:text-blue-200">PAY</span>
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSloganIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="text-2xl font-extralight dark:text-neutral-200"
                >
                  {slogans[currentSloganIndex]}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </AuroraBackground>
        </div>
      </div>
    </div>
  )
}
