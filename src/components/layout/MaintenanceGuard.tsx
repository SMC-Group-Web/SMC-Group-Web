"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"

const POLL_INTERVAL = 5_000
const ON_MAINTENANCE_PAGE = (p: string) => p.startsWith("/mantenimiento")

export default function MaintenanceGuard() {
  const pathname = usePathname()
  const router = useRouter()
  const lastMode = useRef<boolean | null>(null)

  useEffect(() => {
    let active = true

    async function check() {
      try {
        const base = process.env.NEXT_PUBLIC_SERVER_URL ?? ""
        const res = await fetch(`${base}/api/globals/site-settings`, {
          cache: "no-store",
        })
        if (!res.ok || !active) return
        const data = await res.json()
        const mode: boolean = Boolean(data?.maintenanceMode)

        if (lastMode.current === mode) return
        lastMode.current = mode

        if (mode && !ON_MAINTENANCE_PAGE(pathname)) {
          router.replace("/mantenimiento")
        } else if (!mode && ON_MAINTENANCE_PAGE(pathname)) {
          router.replace("/")
        }
      } catch {
        // fail open — no interrumpir la navegación por errores de red
      }
    }

    check()
    const id = setInterval(check, POLL_INTERVAL)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [pathname, router])

  return null
}
