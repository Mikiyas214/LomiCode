import { Link } from 'react-router-dom'
import { Instagram, Linkedin, Send, Mail } from 'lucide-react'
import { brand, contact, services } from '../config/site.js'
import BrandLogo from './BrandLogo.jsx'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Link to="/" className="brand" aria-label={brand.name}>
            <BrandLogo variant="footer" />
          </Link>
          <p>{brand.subTagline}</p>
          <p className="site-footer__motto">{brand.motto}</p>
          <div className="site-footer__socials">
            <a href={contact.instagram} aria-label="Instagram" target="_blank" rel="noreferrer"><Instagram size={18} /></a>
            <a href={contact.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>
            <a href={contact.telegram} aria-label="Telegram" target="_blank" rel="noreferrer"><Send size={18} /></a>
            <a href={`mailto:${contact.email}`} aria-label="Email"><Mail size={18} /></a>
          </div>
        </div>

        <div className="site-footer__col">
          <h4>Services</h4>
          <ul>
            {services.slice(0, 5).map((s) => (
              <li key={s.id}><Link to="/services">{s.title}</Link></li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/work">Our Work</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h4>Get in touch</h4>
          <ul>
            <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
            <li><a href={`tel:${contact.phoneDisplay.replace(/[^+\d]/g, '')}`}>{contact.phoneDisplay}</a></li>
            <li>{contact.address}</li>
          </ul>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>© {year} {brand.name}. All rights reserved.</p>
      </div>
    </footer>
  )
}
