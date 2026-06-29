import { NextRequest, NextResponse } from 'next/server'

// Module-level cache — persists within the same Edge worker instance
let cached: { maintenanceMode: boolean; ts: number } | null = null
const CACHE_TTL = 5_000 // 5 seconds

export async function middleware(request: NextRequest) {
  const now = Date.now()

  if (!cached || now - cached.ts > CACHE_TTL) {
    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
      const res = await fetch(`${base}/api/globals/site-settings`, {
        cache: 'no-store',
      })
      if (res.ok) {
        const data = await res.json()
        cached = { maintenanceMode: Boolean(data?.maintenanceMode), ts: now }
      }
    } catch {
      // Fetch failed — fail open so users aren't blocked on API errors
      return NextResponse.next()
    }
  }

  if (cached?.maintenanceMode) {
    // 307 Temporary Redirect — NOT browser-cached, so turning off maintenance
    // mode takes effect immediately without users needing to clear browser cache.
    // (301 Permanent would be cached and require manual cache clearing.)
    return NextResponse.redirect(new URL('/mantenimiento', request.url), 307)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Run on all frontend routes except admin, API, /mantenimiento itself,
    // Next.js internals, and common static file extensions.
    '/((?!admin|api|mantenimiento|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpe?g|gif|svg|ico|webp|woff2?|ttf|otf)).*)',
  ],
}
