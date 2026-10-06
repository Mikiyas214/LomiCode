import { useCallback, useEffect, useRef } from 'react'

/**
 * Reveals its children once, the first time they scroll into view.
 *
 * The `--spot-x` / `--spot-y` custom properties are written straight onto the
 * element rather than through React state: hover-lit cards read them to place
 * a highlight under the pointer. Updating them in state would re-render the
 * whole subtree on every mouse move, so they are set imperatively instead.
 */
export default function Reveal({
  as: Tag = 'div',
  className = '',
  delay = 0,
  children,
  ...rest
}) {
  const ref = useRef(null)

  const handlePointerMove = useCallback((event) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -48px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal-on-scroll${className ? ` ${className}` : ''}`}
      style={{ '--reveal-delay': `${delay}ms` }}
      onPointerMove={handlePointerMove}
      {...rest}
    >
      {children}
    </Tag>
  )
}
