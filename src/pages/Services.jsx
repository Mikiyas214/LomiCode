import ServiceCard from '../components/ServiceCard.jsx'
import CTASection from '../components/CTASection.jsx'
import Reveal from '../components/Reveal.jsx'
import { services } from '../config/site.js'
import './Services.css'

export default function Services() {
  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Services</p>
            <h1>Everything you need to look professional and work smarter</h1>
            <p className="page-hero__sub">
              Pick a single service or combine a few — every engagement starts with a
              conversation about what your business actually needs.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section services-grid-section">
        <div className="container">
          <div className="grid-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 60}>
                <ServiceCard service={s} detailed />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Not sure which service fits?"
        subtitle="Tell us what you’re working on and we’ll help you figure out the right starting point."
      />
    </>
  )
}
