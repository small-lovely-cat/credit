"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Plus, Settings, Search, Moon, Sun } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { SearchDialog } from "@/components/layout/search-dialog"


/**
 * 站点头部组件
 * 用于显示站点头部
 * 
 * @example
 * ```tsx
 * <SiteHeader />
 * ```
 */
export function SiteHeader() {
  const { user } = useUser()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center bg-background px-4 md:px-0">
      <div className="flex w-full items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <span className="text-sm font-medium truncate max-w-[120px]">
            {user?.nickname || user?.username || "Guest"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-foreground" onClick={() => setSearchOpen(true)}>
            <Search className="size-[18px]" />
            <span className="sr-only">搜索</span>
          </Button>
          <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-foreground">
            <Bell className="size-[18px]" />
            <span className="sr-only">通知</span>
          </Button>
          <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-foreground" onClick={() => router.push('/settings')}>
            <Settings className="size-[18px]" />
            <span className="sr-only">设置</span>
          </Button>
        </div>
      </div>

      <div className="hidden md:flex w-full max-w-[1320px] mx-auto px-12 items-center gap-4">
        <div className="relative w-64 cursor-pointer" onClick={() => setSearchOpen(true)}>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <div className="h-8 border-none bg-muted/100 pl-10 pr-3 text-sm rounded-md flex items-center text-muted-foreground">
            <span>搜索</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-foreground">
            <Bell className="size-[18px]" />
            <span className="sr-only">通知</span>
          </Button>
          <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-foreground" onClick={() => router.push('/settings')}>
            <Settings className="size-[18px]" />
            <span className="sr-only">设置</span>
          </Button>
          <Button className="mx-1 size-7 rounded-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => router.push('/merchant')}>
            <Plus className="size-4" />
            <span className="sr-only">新建</span>
          </Button>

          <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-foreground" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {mounted ? (theme === 'dark' ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />) : <Moon className="size-[18px]" />}
            <span className="sr-only">主题切换</span>
          </Button>
        </div>
      </div>

      {mounted && <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />}
    </header>
  )
}
