import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.tsx'
import { loginUser, saveUser } from '../api.ts'
import './Auth.css'

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
    <div className="auth-page">
      <section className="auth-intro">
        <Logo size="sm" />
        <h1>Welcome back</h1>
        <p>Log in to your account to see your runs and start a new session.</p>
        <div className="auth-art" aria-hidden="true">
          <span>7.4 s</span>
          <small>0-100 km/h</small>
        </div>
      </section>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Sign in</h2>
        <p className="auth-sub">Enter your details below.</p>

        {justRegistered && <p className="auth-success">Account created. You can sign in now.</p>}

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

        {error && <p className="auth-error">{error}</p>}

        <button id="loginButton" type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="auth-switch">
          Don&rsquo;t have an account? <Link id="goToRegister" to="/register">Sign up</Link>
        </p>
      </form>
    </div>
  )
}

export default Login