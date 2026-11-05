import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.tsx'
import { registerUser } from '../api.ts'

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
        // Back to the login page with a success message
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
    <AuthLayout
      heading="Create an account"
      subheading="Sign up to start logging runs and tracking your car&rsquo;s performance with Accelly."
    >
      <div className="entry-card-header">
        <h2>Sign up</h2>
        <p>Create your account details below.</p>
      </div>

      <form className="entry-form" onSubmit={handleSubmit}>
        {error && (
          <p className="entry-message entry-message-error" role="alert">
            {error}
          </p>
        )}

        <div className="entry-fields">
          <div className="entry-row">
            <div className="entry-field">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="entry-field">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="entry-field">
            <label htmlFor="registerLogin">Username</label>
            <input
              id="registerLogin"
              type="text"
              autoComplete="username"
              placeholder="Choose a username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="entry-field">
            <label htmlFor="registerEmail">Email</label>
            <input
              id="registerEmail"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="entry-field">
            <label htmlFor="registerPassword">Password</label>
            <input
              id="registerPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button id="registerButton" type="submit" className="entry-button" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className="entry-switch">
          Already have an account? <Link id="goToLogin" to="/">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default Register
