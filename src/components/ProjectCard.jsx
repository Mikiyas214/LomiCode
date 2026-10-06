import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import './ProjectCard.css'

export default function ProjectCard({ project }) {
  return (
    <Link to={`/work/${project.id}`} className="project-card card">
      <div className="project-card__thumb" aria-hidden="true">
        <span>Placeholder image</span>
      </div>
      <div className="project-card__body">
        <span className="project-card__category">{project.category}</span>
        <h3>{project.client}</h3>
        <p>{project.description}</p>
        <p className="project-card__result">{project.result}</p>
        <span className="project-card__link">
          View project <ArrowUpRight size={15} aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
