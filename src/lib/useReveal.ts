import { useEffect, useRef } from 'react'

let sharedObserver: IntersectionObserver | null = null
const callbacks = new Map<Element, () => void>()

function getObserver() {
  if (typeof window === 'undefined') return null
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cb = callbacks.get(entry.target)
            if (cb) {
              cb()
              callbacks.delete(entry.target)
              sharedObserver?.unobserve(entry.target)
            }
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
  }
  return sharedObserver
}

export function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = getObserver()
    if (!observer) return
    callbacks.set(el, () => {
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, delay)
    })
    observer.observe(el)
    return () => {
      callbacks.delete(el)
      observer.unobserve(el)
    }
  }, [delay])
  return ref
}
