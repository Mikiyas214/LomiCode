import { ArrowRight } from 'lucide-react'
import Button from './Button.jsx'
import BrandLogo from './BrandLogo.jsx'
import { brand } from '../config/site.js'
import './Hero.css'

// Splits the tagline into words so each one can rise into place in sequence.
// Spans are inline-block; the literal spaces between them keep the sentence
// intact for screen readers and for text selection.
function AnimatedHeadline({ text }) {
  return (
    <h1 className="hero-anim hero-anim--2">
      {text.split(' ').map((word, i) => (
        <span className="hero__word" key={`${word}-${i}`}>
          {word}
          {i < text.split(' ').length - 1 ? ' ' : ''}
        </span>
      ))}
    </h1>
  )
}

export default function Hero() {
  return (
    <section className="hero section">
      <div className="hero__glow" aria-hidden="true">
        <span className="hero__orb hero__orb--a" />
        <span className="hero__orb hero__orb--b" />
        <span className="hero__grid-lines" />
      </div>

      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow hero-anim hero-anim--1">Web design &amp; software studio</p>
          <AnimatedHeadline text={brand.tagline} />
          <p className="hero__sub hero-anim hero-anim--3">{brand.subTagline}</p>
          <div className="hero__actions hero-anim hero-anim--4">
            <Button to="/contact" variant="primary" size="lg" icon={ArrowRight}>Start a Project</Button>
            <Button to="/work" variant="secondary" size="lg">View Our Work</Button>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero-logo-wrap">
            <BrandLogo variant="hero" />
            <span className="hero-logo-wrap__sheen" />
          </div>
          <div className="mock-panel">
            <div className="mock-panel__head">
              <span className="mock-dot mock-dot--accent"></span>
              <div className="mock-line mock-line--tiny"></div>
            </div>
            <div className="mock-bars">
              <div className="mock-bar" style={{ '--bar-h': '38%' }}></div>
              <div className="mock-bar" style={{ '--bar-h': '62%' }}></div>
              <div className="mock-bar" style={{ '--bar-h': '48%' }}></div>
              <div className="mock-bar" style={{ '--bar-h': '80%' }}></div>
              <div className="mock-bar" style={{ '--bar-h': '55%' }}></div>
            </div>
            <div className="mock-line mock-line--wide" style={{ marginTop: 14 }}></div>
            <div className="mock-line mock-line--mid"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
