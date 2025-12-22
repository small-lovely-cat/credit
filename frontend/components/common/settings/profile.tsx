"use client"

import * as React from "react"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { cn } from "@/lib/utils"
import { PayLevel, User } from "@/lib/services/auth"
import { useUser } from "@/contexts/user-context"
import services from "@/lib/services"
import type { UserPayConfig } from "@/lib/services/admin"


/**
 * 等级配置
 */
interface LevelConfig {
  level: PayLevel
  name: string
  nameEn: string
  minScore: number
  maxScore: number | null
  gradient: string
  textColor: string
  metalEffect?: boolean
  dailyLimit: number | null
  feeRate: number | string
  scoreRate: number | string
}

/** 等级视觉样式配置（不包含业务数据） */
const LEVEL_STYLES = [
  {
    level: PayLevel.BlackGold,
    name: "黑金会员",
    nameEn: "BLACK MEMBER",
    gradient: "from-slate-800 via-gray-900 to-black",
    textColor: "text-white",
    metalEffect: true,
  },
  {
    level: PayLevel.WhiteGold,
    name: "白金会员",
    nameEn: "PLATINUM MEMBER",
    gradient: "from-slate-400 via-slate-300 to-slate-400",
    textColor: "text-slate-900",
  },
  {
    level: PayLevel.Gold,
    name: "黄金会员",
    nameEn: "GOLD MEMBER",
    gradient: "from-[#F3E3B3] via-[#E6D4A3] via-[#F3E3B3] to-[#D4AF37]",
    textColor: "text-amber-950",
  },
  {
    level: PayLevel.Platinum,
    name: "铂金会员",
    nameEn: "DIAMOND MEMBER",
    gradient: "from-purple-600 via-pink-500 to-purple-600",
    textColor: "text-white",
  },
] as const

/** 合并 API 数据和视觉样式 */
function mergeLevelConfigs(apiConfigs: UserPayConfig[]): LevelConfig[] {
  return LEVEL_STYLES.map(style => {
    const apiConfig = apiConfigs.find(c => c.level === style.level)
    if (apiConfig) {
      return {
        ...style,
        minScore: apiConfig.min_score,
        maxScore: apiConfig.max_score,
        dailyLimit: apiConfig.daily_limit,
        feeRate: apiConfig.fee_rate,
        scoreRate: apiConfig.score_rate,
      }
    }
    return {
      ...style,
      minScore: 0,
      maxScore: null,
      dailyLimit: null,
      feeRate: 0,
      scoreRate: 0,
    }
  })
}

function getLevelConfig(score: number, configs: LevelConfig[]): LevelConfig {
  if (configs.length === 0) {
    return {
      level: PayLevel.BlackGold,
      name: "加载中...",
      nameEn: "LOADING...",
      gradient: "from-slate-800 via-gray-900 to-black",
      textColor: "text-white",
      minScore: 0,
      maxScore: null,
      dailyLimit: null,
      feeRate: 0,
      scoreRate: 0,
    }
  }

  for (let i = configs.length - 1; i >= 0; i--) {
    if (score >= configs[i].minScore) {
      return configs[i]
    }
  }
  return configs[0]
}

function MembershipCard({
  config,
  user,
  score,
  currentLevel,
  isActive,
  levelConfigs,
}: {
  config: LevelConfig
  user: User
  score: number
  currentLevel: LevelConfig
  isActive: boolean
  levelConfigs: LevelConfig[]
}) {
  const isAccessible = levelConfigs.findIndex(l => l.level === config.level) <= levelConfigs.findIndex(l => l.level === currentLevel.level)
  const isDarkCard = config.level === PayLevel.BlackGold || config.level === PayLevel.Platinum

  return (
    <div
      className={cn(
        "transition-all duration-500",
        isActive ? "opacity-100 scale-100" : "opacity-40 scale-95"
      )}
    >
      <div
        className={cn(
          "relative w-full aspect-[2/1] rounded-xl overflow-hidden bg-gradient-to-br shadow-lg",
          config.gradient,
          config.metalEffect && "shadow-2xl"
        )}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        {config.metalEffect && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-transparent" />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/25" />
            <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-white/15 via-transparent to-transparent rounded-t-xl" />
          </>
        )}

        <div className={cn("relative h-full flex flex-col justify-between p-5", config.textColor)}>
          <div>
            <div className="text-[10px] font-medium opacity-70 tracking-wider">
              {config.nameEn}
            </div>
            <div className="text-lg font-bold tracking-tight">
              {config.name}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] opacity-70 tracking-wide">平台分数</div>
            <div className="text-2xl font-bold tracking-tight tabular-nums">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="text-[10px] opacity-70">
              LINUX DO <span className="italic font-serif">Credit</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] opacity-70">分数范围</div>
              <div className="text-[10px] font-medium tabular-nums">
                {config.minScore.toLocaleString()} - {config.maxScore?.toLocaleString() || "∞"}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-5 right-5">
          {isAccessible ? (
            <Avatar className="size-10 border-2 border-white/20">
              <AvatarImage src={user?.avatar_url} alt={user?.nickname} />
              <AvatarFallback
                className={cn(
                  "text-sm font-semibold",
                  isDarkCard ? "bg-white/20 text-white" : "bg-black/20 text-black"
                )}
              >
                {user?.nickname?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div
              className={cn(
                "px-2 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm",
                isDarkCard ? "bg-white/20 text-white" : "bg-black/20 text-black"
              )}
            >
              未获得
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getPayLevelLabel(level: PayLevel): string {
  switch (level) {
    case PayLevel.BlackGold:
      return "黑金会员"
    case PayLevel.WhiteGold:
      return "白金会员"
    case PayLevel.Gold:
      return "黄金会员"
    case PayLevel.Platinum:
      return "铂金会员"
    default:
      return "未知等级"
  }
}

export function ProfileMain() {
  const { user, loading, getTrustLevelLabel } = useUser()
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [levelConfigs, setLevelConfigs] = React.useState<LevelConfig[]>([])

  const score = user?.pay_score ?? 0
  const currentLevel = getLevelConfig(score, levelConfigs)

  React.useEffect(() => {
    async function fetchPayConfigs() {
      const configs = await services.config.getUserPayConfigs()
      setLevelConfigs(mergeLevelConfigs(configs))
    }
    fetchPayConfigs()
  }, [])

  React.useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())
    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  React.useEffect(() => {
    if (user && api) {
      const currentLevelIndex = levelConfigs.findIndex(
        (config) => config.level === currentLevel.level
      )
      api.scrollTo(currentLevelIndex, false)
    }
  }, [user, currentLevel.level, api, levelConfigs])

  if (loading) {
    return (
      <div className="py-6 space-y-4">
        <div className="border-b border-border pb-4">
          <h1 className="text-2xl font-semibold">个人资料</h1>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="py-6 space-y-6">
        <div className="text-sm text-muted-foreground">未找到用户信息</div>
      </div>
    )
  }

  return (
    <div className="py-6 space-y-6">
      <div className="font-semibold">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/settings" className="text-base text-primary">设置</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-base font-semibold">个人资料</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h2 className="font-medium text-sm text-muted-foreground">会员等级</h2>

      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: false,
          containScroll: false,
        }}
        className="w-full relative"
      >
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
        <CarouselContent className="-ml-4">
          {levelConfigs.map((config, index) => (
            <CarouselItem key={config.level} className="pl-4 basis-[85%] sm:basis-[70%] md:basis-[65%] lg:basis-[50%] xl:basis-[40%] 2xl:basis-[35%]">
              <MembershipCard
                config={config}
                user={user}
                score={score}
                currentLevel={currentLevel}
                isActive={index === current}
                levelConfigs={levelConfigs}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>


      <div className="space-y-4">
        <h2 className="font-medium text-sm text-muted-foreground">基本信息</h2>

        <div className="flex items-start gap-18">
          <Avatar className="size-16">
            <AvatarImage src={user.avatar_url} alt={user.nickname || user.username} />
            <AvatarFallback className="text-xl">
              {(user.nickname || user.username).slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">账户</div>
                <div className="text-sm font-medium">@{user.username}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">昵称</div>
                <div className="text-sm font-medium">{user.nickname || '未设置'}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">用户ID</div>
                <div className="text-sm font-medium">{user.id}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">信任等级</div>
                <div className="text-sm font-medium">{getTrustLevelLabel(user.trust_level)}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">平台等级</div>
                <div className="text-sm font-medium">{getPayLevelLabel(user.pay_level)}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">平台分数</div>
                <div className="text-sm font-medium">{user.pay_score.toLocaleString()}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">每日流转限额</div>
                <div className="text-sm font-medium">
                  {currentLevel.dailyLimit ? `${ currentLevel.dailyLimit.toLocaleString() } 积分` : '无限额'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">集市手续费率</div>
                <div className="text-sm font-medium">
                  {typeof currentLevel.feeRate === 'number'
                    ? `${ (currentLevel.feeRate * 100).toFixed(2) }%`
                    : `${ (parseFloat(currentLevel.feeRate as string) * 100).toFixed(2) }%`}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">平台分数转化率</div>
                <div className="text-sm font-medium">
                  {typeof currentLevel.scoreRate === 'number'
                    ? `${ (currentLevel.scoreRate * 100).toFixed(2) }%`
                    : `${ (parseFloat(currentLevel.scoreRate as string) * 100).toFixed(2) }%`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
