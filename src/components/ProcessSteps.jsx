import { process } from '../config/site.js'
import Reveal from './Reveal.jsx'
import './ProcessSteps.css'

export default function ProcessSteps() {
  return (
    <ol className="process-steps">
      {process.map((p, i) => (
        <Reveal key={p.step} as="li" className="process-steps__item" delay={i * 110}>
          <span className="process-steps__index">{i + 1}</span>
          <div>
            <h3>{p.step}</h3>
            <p>{p.description}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  )
}
