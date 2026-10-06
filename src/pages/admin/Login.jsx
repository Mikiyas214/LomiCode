import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { LogIn, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { brand } from '../../config/site.js'
import BrandLogo from '../../components/BrandLogo.jsx'
import './Admin.css'

export default function AdminLogin() {
  const { signIn, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/admin'

  if (isAuthenticated) {
    navigate(from, { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter both your email and password.')
      return
    }

    setLoading(true)
    const { error: signInError } = await signIn(email.trim(), password)
    setLoading(false)

    if (signInError) {
      setError('Incorrect email or password. Please try again.')
      return
    }

    navigate(from, { replace: true })
  }

  return (
    <div className="admin-auth">
      <div className="admin-auth__card card">
        <Link to="/" className="admin-auth__brand" aria-label={brand.name}>
          <BrandLogo variant="admin" />
        </Link>

        <h1>Admin sign in</h1>
        <p>Sign in to view and manage project inquiries.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
            />
          </div>

          <div className="form-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!error}
            />
          </div>

          {error && (
            <p className="admin-auth__error" role="alert">
              <AlertCircle size={16} aria-hidden="true" /> {error}
            </p>
          )}

          <button type="submit" className="btn btn--primary admin-auth__submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="spin" aria-hidden="true" /> Signing in…
              </>
            ) : (
              <>
                <LogIn size={16} aria-hidden="true" /> Sign in
              </>
            )}
          </button>
        </form>

        <p className="admin-auth__note">
          Admin accounts are created directly in Supabase Authentication — see the
          project README for setup steps. There's no public sign-up here.
        </p>
      </div>
    </div>
  )
}
