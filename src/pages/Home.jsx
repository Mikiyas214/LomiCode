import { ShieldCheck, Rocket, MessageCircle, ArrowRight } from 'lucide-react'
import Hero from '../components/Hero.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import ProcessSteps from '../components/ProcessSteps.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import Testimonials from '../components/Testimonials.jsx'
import CTASection from '../components/CTASection.jsx'
import Faq from '../components/Faq.jsx'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import { services, portfolio, values } from '../config/site.js'
import './Home.css'

const valueIcons = { communication: MessageCircle, quality: ShieldCheck, practical: Rocket, support: ShieldCheck }

export default function Home() {
  return (
    <>
      <Hero />

      <section className="section" aria-labelledby="services-heading">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">What we do</p>
            <h2 id="services-heading">Services built around what your business actually needs</h2>
            <p>From a first website to custom software, we cover the full range of digital work.</p>
          </Reveal>
          <div className="grid-3">
            {services.slice(0, 6).map((s, i) => (
              <Reveal key={s.id} delay={i * 70}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
          <div className="section-footer-link">
            <Button to="/services" variant="ghost" icon={ArrowRight}>See all services</Button>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="process-heading">
        <div className="container">
          <Reveal className="section-head center">
            <p className="eyebrow">How we work</p>
            <h2 id="process-heading">A simple, three-step process</h2>
          </Reveal>
          <ProcessSteps />
        </div>
      </section>

      <section className="section" aria-labelledby="work-heading">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Featured work</p>
            <h2 id="work-heading">A sample of what we build</h2>
            <p className="home-work__note">Sample placeholder projects — shown to illustrate layout and structure.</p>
          </Reveal>
          <div className="grid-3">
            {portfolio.slice(0, 3).map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
          <div className="section-footer-link">
            <Button to="/work" variant="ghost" icon={ArrowRight}>View all work</Button>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="why-heading">
        <div className="container">
          <Reveal className="section-head center">
            <p className="eyebrow">Why choose us</p>
            <h2 id="why-heading">A studio that treats your project like it matters</h2>
          </Reveal>
          <div className="grid-4">
            {values.map((v, i) => {
              const Icon = valueIcons[v.id] ?? ShieldCheck
              return (
                <Reveal key={v.id} delay={i * 70}>
                  <div className="value-card">
                    <Icon size={22} aria-hidden="true" />
                    <h3>{v.title}</h3>
                    <p>{v.description}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="testimonials-heading">
        <div className="container">
          <Reveal className="section-head center">
            <p className="eyebrow">What clients say</p>
            <h2 id="testimonials-heading">Sample feedback</h2>
          </Reveal>
          <Testimonials />
        </div>
      </section>

      <Faq />
      <CTASection />
    </>
  )
}
