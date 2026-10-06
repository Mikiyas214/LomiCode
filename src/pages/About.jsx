import CTASection from '../components/CTASection.jsx'
import Reveal from '../components/Reveal.jsx'
import { brand, team, values } from '../config/site.js'
import './About.css'

export default function About() {
  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <Reveal>
            <p className="eyebrow">About us</p>
            <h1>A small, founder-led studio built around real relationships</h1>
            <p className="page-hero__sub">
              {brand.name} is a small, ambitious team that works closely with each client — no
              account managers, no hand-offs, just the people actually doing the work.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Meet the team</p>
            <h2>The people behind the work</h2>
          </Reveal>
          <div className="team-grid">
            {team.map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <div className="team-card card">
                  <div className="team-card__avatar" aria-hidden="true">
                    {t.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <h3>{t.name}</h3>
                  <p className="team-card__role">{t.role}</p>
                  <p>{t.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">What we value</p>
            <h2>How we work with clients</h2>
          </Reveal>
          <div className="values-list">
            {values.map((v, i) => (
              <Reveal key={v.id} className="values-list__item" delay={i * 70}>
                <h3>{v.title}</h3>
                <p>{v.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
