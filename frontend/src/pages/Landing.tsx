import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.tsx'
import { clearUser, getUser } from '../api.ts'
import './Landing.css'

const GITHUB_URL = 'https://github.com/csantody/mern-group-24'

const navLinks = [
  { id: 'navFeatures', label: 'Features', href: '#features' },
  { id: 'navFaq', label: 'FAQ', href: '#faq' },
  { id: 'navAbout', label: 'About', href: '#about' },
]

const highlights = ['Built for enthusiasts', 'Not a replacement for a dyno', 'Clear, usable insights']

const desktopStats = [
  { label: '0-100 time', value: '7.4 s' },
  { label: 'Peak g', value: '0.82 g' },
  { label: 'Rolling avg', value: '0.74 g' },
]

const keyRows = [12, 12, 11, 9]

function AccelChart() {
  return (
    <svg className="accel-chart" viewBox="0 0 300 90" preserveAspectRatio="none" aria-hidden="true">
      <path
        className="accel-chart-fill"
        d="M0,82 C40,72 70,50 110,40 S190,24 230,19 S280,13 300,11 L300,90 L0,90 Z"
      />
      <path
        className="accel-chart-line"
        d="M0,82 C40,72 70,50 110,40 S190,24 230,19 S280,13 300,11"
      />
      <circle className="accel-chart-dot" cx="296" cy="12" r="4" />
    </svg>
  )
}

function Landing() {
  const navigate = useNavigate()
  const user = getUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!recording) return
    const timer = setInterval(() => setSeconds((s) => s + 0.1), 100)
    return () => clearInterval(timer)
  }, [recording])

  if (!user) {
    return <Navigate to="/" replace />
  }

  const handleLogout = () => {
    clearUser()
    navigate('/')
  }

  const handleTryAccelly = () => {
    setSeconds(0)
    setRecording(true)
  }

  const handleGithub = () => {
    window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')
  }

  const handleStartSession = () => {
    if (recording) {
      setRecording(false)
    } else {
      setSeconds(0)
      setRecording(true)
    }
  }

  const toggleMenu = () => {
    setMenuOpen((open) => !open)
  }

  return (
    <div className="landing">
      <header className="landing-nav">
        <a className="landing-brand" href="/" aria-label="Accelly home">
          <span className="brand-md"><Logo /></span>
          <span className="brand-sm"><Logo size="sm" /></span>
        </a>

        <nav className="nav-links" aria-label="Main">
          {navLinks.map((link) => (
            <a key={link.id} id={link.id} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <span className="nav-user">Hi, {user.firstName}</span>
          <button id="logout" type="button" className="btn btn-primary btn-cta" onClick={handleLogout}>
            Log out
          </button>
          <button
            id="menuToggle"
            type="button"
            className="menu-toggle"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {menuOpen && (
          <nav id="mobileMenu" className="mobile-menu" aria-label="Mobile">
            {navLinks.map((link) => (
              <a key={link.id} href={link.href} className="nav-link" onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="hero">
        <section className="hero-copy">
          <span className="hero-pill">Vehicle performance insights</span>
          <h1 className="hero-title">Bring the dyno home.</h1>
          <p className="hero-sub">
            A starting point for understanding your vehicle&rsquo;s performance&mdash;when a dyno isn&rsquo;t within reach.
          </p>
          <div className="hero-buttons">
            <button id="tryAccelly" type="button" className="btn btn-primary" onClick={handleTryAccelly}>
              Try Accelly
            </button>
            <button id="github" type="button" className="btn btn-outline" onClick={handleGithub}>
              Github
            </button>
          </div>
          <ul className="hero-points">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="hero-preview" aria-label="App preview with sample data">
          <div className="preview-stage">
            <div className="laptop">
              <div className="laptop-screen">
                <div className="window-bar">
                  <span className="window-title">Accelly</span>
                  <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
                </div>
                <div className="panel">
                  <div className="panel-head">
                    <span className="panel-icon" aria-hidden="true" />
                    <div className="panel-head-text">
                      <strong>Performance overview</strong>
                      <small>Example session</small>
                    </div>
                    <span className="badge">Preview</span>
                  </div>
                  <div className="chart-card">
                    <div className="chart-card-head">
                      <strong>Acceleration</strong>
                      <small>0-100 km/h</small>
                    </div>
                    <AccelChart />
                    <div className="stat-row">
                      {desktopStats.map((stat) => (
                        <div key={stat.label} className="stat">
                          <small>{stat.label}</small>
                          <strong>{stat.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="stat-row stat-row-2">
                    <div className="stat stat-card">
                      <small>Best pull</small>
                      <strong>7.4 s</strong>
                    </div>
                    <div className="stat stat-card">
                      <small>Top speed</small>
                      <strong>182 km/h</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className="laptop-base" aria-hidden="true">
                {keyRows.map((count, row) => (
                  <div key={row} className="key-row">
                    {Array.from({ length: count }, (_, i) => (
                      <i key={i} />
                    ))}
                  </div>
                ))}
                <div className="trackpad" />
              </div>
            </div>

            <div className="phone">
              <div className="phone-head">
                <span className="panel-icon" aria-hidden="true" />
                <strong>Session</strong>
                <span className="badge">Preview</span>
              </div>
              <div className="run-card">
                <div className="run-card-head">
                  <small>{recording ? 'Recording...' : 'Current run'}</small>
                  <small>0-100 km/h</small>
                </div>
                <div className="run-time">{recording || seconds > 0 ? seconds.toFixed(1) : '7.4'} s</div>
                <div className="run-stats">
                  <div>
                    <small>Peak g</small>
                    <strong>0.82 g</strong>
                  </div>
                  <div>
                    <small>Avg g</small>
                    <strong>0.74 g</strong>
                  </div>
                </div>
              </div>
              <div className="phone-tile">
                <small>Rolling average</small>
                <strong>0.74 g</strong>
              </div>
              <div className="phone-tile">
                <small>Best run</small>
                <strong>7.4 s</strong>
              </div>
              <div className="phone-split">
                <div className="phone-tile">
                  <small>Top speed</small>
                  <strong>182 km/h</strong>
                </div>
                <div className="phone-tile">
                  <small>Distance</small>
                  <strong>420 m</strong>
                </div>
              </div>
              <button id="startSession" type="button" className="btn btn-primary btn-block" onClick={handleStartSession}>
                {recording ? 'Stop session' : 'Start session'}
              </button>
            </div>
          </div>
          <p className="preview-caption">Illustrative app preview &middot; Sample data</p>
        </section>
      </main>
    </div>
  )
}

export default Landing
