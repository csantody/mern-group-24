import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.tsx'
import { registerUser } from '../api.ts'
import './Auth.css'

function Register() {
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { status, data } = await registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        login: login.trim(),
        password,
      })
      if (status === 201) {
        navigate('/', { state: { registered: true } })
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-intro">
        <Logo size="sm" />
        <h1>Create an account</h1>
        <p>Sign up to start logging runs and tracking your car&rsquo;s performance with Accelly.</p>
        <div className="auth-art" aria-hidden="true">
          <span>0.82 g</span>
          <small>Peak acceleration</small>
        </div>
      </section>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Sign up</h2>
        <p className="auth-sub">Create your account details below.</p>

        <div className="auth-row">
          <div>
            <label htmlFor="firstName">First name</label>
            <input id="firstName" type="text" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="lastName">Last name</label>
            <input id="lastName" type="text" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>

        <label htmlFor="registerEmail">Email</label>
        <input id="registerEmail" type="email" autoComplete="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="registerLogin">Username</label>
        <input id="registerLogin" type="text" autoComplete="username" placeholder="Choose a username" value={login} onChange={(e) => setLogin(e.target.value)} required />

        <label htmlFor="registerPassword">Password</label>
        <input id="registerPassword" type="password" autoComplete="new-password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="auth-error">{error}</p>}

        <button id="registerButton" type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link id="goToLogin" to="/">Log in</Link>
        </p>
      </form>
    </div>
  )
}

export default Register