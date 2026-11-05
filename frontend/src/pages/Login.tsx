import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.tsx'
import { loginUser, saveUser } from '../api.ts'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const justRegistered = location.state?.registered === true

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { status, data } = await loginUser(login.trim(), password)
      if (status === 200) {
        saveUser(data.user)
        navigate('/home')
      } else if (status === 401) {
        // Wrong username or password -> generic error page
        navigate('/login-failed')
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
      heading="Welcome back"
      subheading="Log in to your account to see your runs and start a new session."
    >
      <div className="entry-card-header">
        <h2>Sign in</h2>
        <p>Enter your details below.</p>
      </div>

      <form className="entry-form" onSubmit={handleSubmit}>
        {justRegistered && (
          <p className="entry-message entry-message-success" role="status">
            Account created. You can sign in now.
          </p>
        )}
        {error && (
          <p className="entry-message entry-message-error" role="alert">
            {error}
          </p>
        )}

        <div className="entry-fields">
          <div className="entry-field">
            <label htmlFor="loginName">Username</label>
            <input
              id="loginName"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="entry-field">
            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button id="loginButton" type="submit" className="entry-button" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="entry-switch">
          Don&rsquo;t have an account? <Link id="goToRegister" to="/register">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default Login
