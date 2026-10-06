import { ArrowRight } from 'lucide-react'
import Button from './Button.jsx'
import './CTASection.css'

export default function CTASection({
  title = 'Ready to move your business forward?',
  subtitle = 'Tell us what you need. We’ll get back to you with the best next step.',
  ctaLabel = 'Start a Project',
  ctaTo = '/contact',
}) {
  return (
    <section className="cta-section">
      <div className="container cta-section__inner">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
            <Button to={ctaTo} variant="primary" size="lg" icon={ArrowRight}>{ctaLabel}</Button>
      </div>
    </section>
  )
}
