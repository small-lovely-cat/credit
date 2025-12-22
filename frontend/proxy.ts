import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js 16 代理
 * 在渲染页面之前通过会话 cookie 执行快速身份验证检查
 *
 * 流程：
 * 1. 检查路由是否受保护
 * 2. 检查会话 cookie 是否存在
 * 3. 受保护路由上没有 cookie → 立即重定向到 /login
 * 4. 有 cookie → 允许通过（UserProvider 将获取用户信息）
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const sessionCookie = request.cookies.get('linux_do_credit_session_id')

  // 定义不需要身份验证的公共路由
  const publicRoutes = [
    '/',
    '/login',
    '/callback',
    '/privacy',
    '/terms',
    '/docs',
  ]

  // 定义公共路径前缀
  const publicPrefixes = [
    '/pay/',  // 无需认证即可访问的支付页面
    '/_next/', // Next.js 内部文件
    '/api/',  // API 路由
  ]

  // 检查当前路径是否为公共路径
  const isPublicRoute = publicRoutes.includes(pathname) ||
    publicPrefixes.some(prefix => pathname.startsWith(prefix))

  // 如果是公共路由，允许通过
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // 受保护路由：检查会话 cookie
  if (!sessionCookie) {
    const callbackUrl = encodeURIComponent(pathname + search)
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', callbackUrl)

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

/**
 * 配置代理应在哪些路由上运行
 * 使用匹配器排除静态文件以获得更好的性能
 */
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，但排除：
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico, robots.txt, sitemap.xml (元文件)
     * - 图片和其他静态资源
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)).*)',
  ],
}
