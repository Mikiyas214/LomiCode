import { Mail, MessageCircle, Send, Instagram, Linkedin } from 'lucide-react'
import ContactForm from '../components/ContactForm.jsx'
import Reveal from '../components/Reveal.jsx'
import { contact } from '../config/site.js'
import './Contact.css'

const channels = [
  { icon: MessageCircle, label: 'WhatsApp', href: contact.whatsapp },
  { icon: Send, label: 'Telegram', href: contact.telegram },
  { icon: Mail, label: 'Email', href: `mailto:${contact.email}` },
  { icon: Instagram, label: 'Instagram', href: contact.instagram },
  { icon: Linkedin, label: 'LinkedIn', href: contact.linkedin },
]

export default function Contact() {
  return (
    <section className="section contact-page">
      <div className="container contact-page__grid">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h1>Tell us what you need.</h1>
          <p className="contact-page__sub">We’ll get back to you with the best next step.</p>

          <div className="contact-channels">
            {channels.map((c) => (
              <a key={c.label} href={c.href} className="contact-channel" target="_blank" rel="noreferrer">
                <c.icon size={18} aria-hidden="true" />
                <span>{c.label}</span>
              </a>
            ))}
          </div>

          <p className="contact-page__note">{contact.address}</p>
        </Reveal>

        <Reveal delay={80}>
          <div className="card contact-page__form-card">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
