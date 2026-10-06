import ProjectCard from '../components/ProjectCard.jsx'
import CTASection from '../components/CTASection.jsx'
import Reveal from '../components/Reveal.jsx'
import { portfolio } from '../config/site.js'
import './Work.css'

export default function Work() {
  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Our work</p>
            <h1>A look at the kind of projects we take on</h1>
            <p className="page-hero__sub">
              The projects below are placeholders that show how real case studies will be
              structured — client, category, description, and results.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section work-grid-section">
        <div className="container">
          <div className="grid-3">
            {portfolio.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Want your project featured here next?"
        subtitle="Let’s talk about what you’re building and how we can help."
      />
    </>
  )
}
