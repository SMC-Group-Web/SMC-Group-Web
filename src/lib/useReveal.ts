'use client'

import { useEffect, useRef } from 'react'

export function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            el.style.willChange = 'auto'
          }, delay)
        } else {
          // Sale del viewport — resetea para que vuelva a animar
          el.style.opacity = '0'
          el.style.transform = 'translateY(28px)'
          el.style.willChange = 'opacity, transform'
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return ref
}
