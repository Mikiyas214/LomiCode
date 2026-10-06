import { Check, ArrowRight } from 'lucide-react'
import Button from './Button.jsx'
import './ServiceCard.css'

export default function ServiceCard({ service, detailed = false }) {
  return (
    <article className="service-card card">
      <h3>{service.title}</h3>
      <p>{service.summary}</p>

      {detailed && (
        <ul className="service-card__outcomes">
          {service.outcomes.map((o) => (
            <li key={o}>
              <Check size={16} aria-hidden="true" />
              <span>{o}</span>
            </li>
          ))}
        </ul>
      )}

      <Button to="/contact" variant="ghost" icon={ArrowRight}>
        Request a Quote
      </Button>
    </article>
  )
}
