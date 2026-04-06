'use client'

import { useReveal } from '@/lib/useReveal'

export default function RevealWrapper({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useReveal(delay)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: 'translateY(28px)',
        transition: 'opacity 0.55s ease, transform 0.55s ease',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
