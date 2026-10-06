import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Reveal from './Reveal.jsx'
import './Faq.css'

const items = [
  {
    q: 'How do we start a project?',
    a: 'Share a short brief through the contact form. We’ll review what you need, suggest a practical starting point, and outline next steps before any build work begins.',
  },
  {
    q: 'How long does a typical website take?',
    a: 'Most business websites take a few weeks once scope is clear. Custom software and larger applications take longer — we’ll give you a realistic timeline after the first conversation.',
  },
  {
    q: 'Do you work with remote or international clients?',
    a: 'Yes. Lomi Code is remote-first and collaborates with businesses worldwide. Communication stays clear through email, WhatsApp, or video calls.',
  },
  {
    q: 'What happens after launch?',
    a: 'We stay available for maintenance, updates, and support. Launch is the start of a working product — not the end of the relationship.',
  },
]

function FaqItem({ item, open, onToggle }) {
  const panelId = useId()
  const buttonId = useId()

  return (
    <div className={'faq-item' + (open ? ' is-open' : '')}>
      <h3>
        <button
          type="button"
          id={buttonId}
          className="faq-item__trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span>{item.q}</span>
          <ChevronDown size={18} aria-hidden="true" />
        </button>
      </h3>
      <div className="faq-item__panel" id={panelId} role="region" aria-labelledby={buttonId}>
        <div className="faq-item__inner">
          <p>{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="section section-alt" aria-labelledby="faq-heading">
      <div className="container">
        <Reveal className="section-head center">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-heading">Questions we hear most often</h2>
        </Reveal>
        <div className="faq-list">
          {items.map((item, i) => (
            <Reveal key={item.q} delay={i * 70}>
              <FaqItem
                item={item}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
