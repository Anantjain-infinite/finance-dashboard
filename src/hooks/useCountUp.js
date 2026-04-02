import { useEffect, useRef, useState } from 'react'

export function useCountUp(target, duration = 800, enabled = true) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)
  const prevTarget = useRef(0)

  useEffect(() => {
    if (!enabled || target === undefined || target === null) return

    const from = prevTarget.current
    const to = target
    prevTarget.current = to

    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    const step = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(from + (to - from) * eased))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setValue(to)
        startRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      startRef.current = null
    }
  }, [target, duration, enabled])

  return value
}
