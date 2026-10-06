import { Link } from 'react-router-dom'
import './Button.css'

/**
 * Reusable button/link. Renders a <Link> when `to` is given, otherwise a
 * native <button>.
 */
export default function Button({
  to,
  href,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  block = false,
  icon: Icon,
  children,
  ...rest
}) {
  const className = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    block ? 'btn--block' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {children}
      {Icon && <Icon size={16} className="btn__icon" aria-hidden="true" />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={className} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={className} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} className={className} onClick={onClick} {...rest}>
      {content}
    </button>
  )
}
