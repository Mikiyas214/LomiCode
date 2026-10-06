import { testimonials } from '../config/site.js'
import Reveal from './Reveal.jsx'
import './Testimonials.css'

export default function Testimonials() {
  return (
    <div className="testimonials">
      <p className="testimonials__label">Sample content — placeholder testimonials</p>
      <div className="testimonials__grid">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={i * 80} as="blockquote" className="testimonial card">
            <p>&ldquo;{t.quote}&rdquo;</p>
            <footer>
              <span className="testimonial__name">{t.name}</span>
              <span className="testimonial__role">{t.role}</span>
            </footer>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
