import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'lomi-theme'
const ThemeContext = createContext(undefined)

/**
 * Reads the theme that the inline bootstrap script in index.html already
 * applied to <html>, so the first client render matches what is on screen and
 * the page never flashes between themes.
 */
function readInitialTheme() {
  if (typeof document === 'undefined') return 'light'
  const attr = document.documentElement.getAttribute('data-theme')
  return attr === 'dark' ? 'dark' : 'light'
}

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    // Private mode / blocked storage — fall back to following the system.
    return null
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.style.colorScheme = theme
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readInitialTheme)

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Ignore storage failures (private mode, blocked storage).
    }
  }, [theme])

  // While the visitor has not made an explicit choice, keep following the OS
  // preference. Once they use the toggle, localStorage pins the theme and this
  // listener stops having any visible effect.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => {
      if (readStoredTheme() === null) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }

    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      setTheme: setThemeState,
      toggleTheme: () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (ctx === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
