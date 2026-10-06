import { useState } from 'react'
import { CheckCircle2, Send, Loader2, AlertCircle, MessageCircle } from 'lucide-react'
import { serviceOptions, budgetRanges, buildWhatsAppLink } from '../config/site.js'
// `supabasePublic`, not `supabase`: this insert must always go out as the
// `anon` role so the public INSERT policy applies, even when an admin is
// signed in on this same browser.
import { supabasePublic } from '../lib/supabase.js'
import './ContactForm.css'

const initialValues = {
  fullName: '',
  businessName: '',
  email: '',
  phone: '',
  service: '',
  budget: '',
  details: '',
}

function validate(values) {
  const errors = {}
  if (!values.fullName.trim()) errors.fullName = 'Please enter your full name.'
  if (!values.email.trim()) {
    errors.email = 'Please enter your email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!values.service) errors.service = 'Please select the service you need.'
  if (!values.details.trim()) {
    errors.details = 'Please tell us a bit about your project.'
  } else if (values.details.trim().length < 20) {
    errors.details = 'Please add a little more detail (at least 20 characters).'
  }
  return errors
}

export default function ContactForm() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors(validate({ ...values }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    const validationErrors = validate(values)
    setErrors(validationErrors)
    setTouched({
      fullName: true, businessName: true, email: true, phone: true,
      service: true, budget: true, details: true,
    })

    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)

    let insertError = null
    try {
      const { error } = await supabasePublic.from('inquiries').insert({
        full_name: values.fullName.trim(),
        business_name: values.businessName.trim() || null,
        email: values.email.trim(),
        phone: values.phone.trim() || null,
        service_needed: values.service,
        budget_range: values.budget || null,
        project_details: values.details.trim(),
      })
      insertError = error
    } catch (err) {
      // Covers unexpected failures (e.g. network errors) that reject
      // instead of resolving with an `error` field.
      insertError = err
    }

    setSubmitting(false)

    if (insertError) {
      // Logged for debugging; the message shown to the visitor stays
      // generic and points them to a working fallback (WhatsApp/email).
      console.error('Failed to save inquiry to Supabase:', insertError)
      console.error('Error JSON:', JSON.stringify(insertError, null, 2))
      setSubmitError(
        "Something went wrong sending your inquiry. Please try again, or reach us directly on WhatsApp below."
      )
      return
    }

    setSubmitted(true)
  }

  const handleReset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setSubmitted(false)
    setSubmitError('')
  }

  if (submitted) {
    const whatsappLink = buildWhatsAppLink(values)

    return (
      <div className="form-success card" role="status">
        <CheckCircle2 size={40} aria-hidden="true" />
        <h3>Thanks, {values.fullName.split(' ')[0] || 'there'} — your message is in.</h3>
        <p>We’ve saved your inquiry and will review your project details soon.</p>
        <div className="form-success__actions">
          <a
            className="btn btn--primary"
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} aria-hidden="true" /> Continue on WhatsApp
          </a>
          <button type="button" className="btn btn--secondary" onClick={handleReset}>
            Send another inquiry
          </button>
        </div>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="fullName">Full name *</label>
          <input
            id="fullName" name="fullName" type="text" autoComplete="name"
            value={values.fullName} onChange={handleChange} onBlur={handleBlur}
            aria-invalid={!!(touched.fullName && errors.fullName)}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          />
          {touched.fullName && errors.fullName && (
            <span className="form-error" id="fullName-error">{errors.fullName}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="businessName">Business name</label>
          <input
            id="businessName" name="businessName" type="text" autoComplete="organization"
            value={values.businessName} onChange={handleChange} onBlur={handleBlur}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="email">Email *</label>
          <input
            id="email" name="email" type="email" autoComplete="email"
            value={values.email} onChange={handleChange} onBlur={handleBlur}
            aria-invalid={!!(touched.email && errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {touched.email && errors.email && (
            <span className="form-error" id="email-error">{errors.email}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone / WhatsApp</label>
          <input
            id="phone" name="phone" type="tel" autoComplete="tel"
            value={values.phone} onChange={handleChange} onBlur={handleBlur}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="service">Service needed *</label>
          <select
            id="service" name="service"
            value={values.service} onChange={handleChange} onBlur={handleBlur}
            aria-invalid={!!(touched.service && errors.service)}
            aria-describedby={errors.service ? 'service-error' : undefined}
          >
            <option value="">Select a service</option>
            {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {touched.service && errors.service && (
            <span className="form-error" id="service-error">{errors.service}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="budget">Budget range</label>
          <select
            id="budget" name="budget"
            value={values.budget} onChange={handleChange} onBlur={handleBlur}
          >
            <option value="">Select a range</option>
            {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="details">Project details *</label>
        <textarea
          id="details" name="details" rows={5}
          value={values.details} onChange={handleChange} onBlur={handleBlur}
          aria-invalid={!!(touched.details && errors.details)}
          aria-describedby={errors.details ? 'details-error' : undefined}
          placeholder="What are you trying to build or improve?"
        />
        {touched.details && errors.details && (
          <span className="form-error" id="details-error">{errors.details}</span>
        )}
      </div>

      {submitError && (
        <p className="form-submit-error" role="alert">
          <AlertCircle size={16} aria-hidden="true" /> {submitError}
        </p>
      )}

      <button type="submit" className="btn btn--primary form-submit" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 size={16} className="spin" aria-hidden="true" /> Sending…
          </>
        ) : (
          <>
            Send Inquiry <Send size={16} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  )
}
