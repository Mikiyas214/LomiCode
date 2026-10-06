import { brand } from '../config/site.js'

/**
 * Official Lomi Code lockup. The full logo includes a designed dark plate so
 * it reads as a badge on light backgrounds instead of an ugly cropped box.
 */
export default function BrandLogo({ variant = 'nav', className = '' }) {
  const isMark = variant === 'mark'
  return (
    <img
      src={isMark ? brand.mark : brand.logo}
      alt={brand.name}
      className={`brand-logo brand-logo--${variant}${className ? ` ${className}` : ''}`}
      draggable="false"
    />
  )
}
