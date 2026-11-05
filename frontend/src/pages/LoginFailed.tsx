import { Link } from 'react-router-dom'
import Logo from '../components/Logo.tsx'
import './Auth.css'

function LoginFailed() {
  return (
    <div className="auth-page auth-page-center">
      <div className="auth-card auth-card-center">
        <Logo size="sm" />
        <h2>Login failed</h2>
        <p className="auth-sub">The username or password you entered is incorrect.</p>
        <Link id="tryAgain" to="/" className="auth-button">
          Try again
        </Link>
      </div>
    </div>
  )
}

export default LoginFailed