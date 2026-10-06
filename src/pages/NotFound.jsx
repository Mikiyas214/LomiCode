import { ArrowRight } from 'lucide-react'
import Button from '../components/Button.jsx'
import BrandLogo from '../components/BrandLogo.jsx'
import { brand } from '../config/site.js'
import './NotFound.css'

export default function NotFound() {
  return (
    <section className="section not-found">
      <div className="container not-found__inner">
        <div className="not-found__logo reveal">
          <BrandLogo variant="mark" />
        </div>
        <p className="eyebrow">404</p>
        <h1>This page doesn&rsquo;t exist.</h1>
        <p>
          The page you&rsquo;re looking for may have moved, or it may never have existed.
        </p>
        <div className="not-found__actions reveal">
          <Button to="/" variant="primary" icon={ArrowRight}>Back to home</Button>
          <Button to="/contact" variant="secondary">Contact {brand.name}</Button>
        </div>
      </div>
    </section>
  )
}
