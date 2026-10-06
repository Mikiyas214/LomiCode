import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'
import './ThemeToggle.css'

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      className={`theme-toggle${className ? ` ${className}` : ''}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <Sun className={'theme-toggle__icon' + (isDark ? '' : ' is-active')} size={16} />
        <Moon className={'theme-toggle__icon' + (isDark ? ' is-active' : '')} size={16} />
      </span>
    </button>
  )
}
