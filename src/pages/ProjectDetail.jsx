import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import CTASection from '../components/CTASection.jsx'
import { portfolio } from '../config/site.js'
import './ProjectDetail.css'

export default function ProjectDetail() {
  const { projectId } = useParams()
  const project = portfolio.find((p) => p.id === projectId)

  if (!project) {
    return <Navigate to="/work" replace />
  }

  return (
    <>
      <section className="section project-detail">
        <div className="container">
          <Link to="/work" className="project-detail__back">
            <ArrowLeft size={16} aria-hidden="true" /> Back to work
          </Link>

          <p className="eyebrow">{project.category}</p>
          <h1>{project.client}</h1>

          <div className="project-detail__thumb" aria-hidden="true">
            <span>Placeholder image</span>
          </div>

          <div className="project-detail__body">
            <div>
              <h2>Overview</h2>
              <p>{project.description}</p>
            </div>
            <div>
              <h2>Result</h2>
              <p>{project.result}</p>
            </div>
          </div>

          <p className="project-detail__note">
            This is placeholder content. Replace with a real case study — process,
            screenshots, and outcomes — once the project is complete.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  )
}
