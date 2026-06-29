import { NextRequest, NextResponse } from 'next/server'

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
      } else {
        // API error (e.g. table not created yet, 500, 404) — fail open.
        // Must update ts so we don't hammer the failing API on every request.
        cached = { maintenanceMode: false, ts: now }
      }
    } catch {
      // Network error — fail open. Cache the result to avoid hammering.
      cached = { maintenanceMode: false, ts: now }
    }
  }

  if (cached.maintenanceMode) {
    return NextResponse.redirect(new URL('/mantenimiento', request.url), 307)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Exclude admin, API routes, maintenance page, ALL Next.js internals,
    // and static file extensions. Everything else gets maintenance-mode checked.
    '/((?!admin|api|mantenimiento|_next|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpe?g|gif|svg|ico|webp|woff2?|ttf|otf)).*)',
  ],
}
