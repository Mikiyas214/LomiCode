import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import { brand } from '../config/site.js'
import BrandLogo from './BrandLogo.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import './Header.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={'site-header' + (scrolled ? ' is-scrolled' : '')}>
      <div className="container site-header__inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label={brand.name}>
          <BrandLogo variant="nav" />
        </Link>

        <nav className="site-nav site-nav--desktop" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => 'site-nav__link' + (isActive ? ' is-active' : '')}
              end={l.to === '/'}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <ThemeToggle />
          <Link to="/contact" className="btn btn--primary btn--sm site-header__cta">
            Start a Project <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <button
            className="menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={'mobile-nav' + (open ? ' is-open' : '')}
        aria-hidden={!open}
      >
        <nav className="mobile-nav__links" aria-label="Mobile">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => 'mobile-nav__link' + (isActive ? ' is-active' : '')}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="btn btn--primary mobile-nav__cta"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            Start a Project
          </Link>
        </nav>
      </div>
    </header>
  )
}
