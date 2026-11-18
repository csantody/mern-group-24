import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.tsx'
import { clearUser, getUser } from '../api.ts'
import './Home.css'

type BodyStyle = 'hatch' | 'roadster'

type Vehicle = {
  id: string
  name: string
  withDriver: number
  withoutDriver: number
  body: BodyStyle
}

type Session = {
  id: string
  vehicleId: string
  date: string
  zeroTo100: number
  hp: number
}

type VehicleForm = {
  name: string
  withDriver: string
  withoutDriver: string
}

const sampleVehicles: Vehicle[] = [
  { id: 'gti', name: 'Daily GTI', withDriver: 1450, withoutDriver: 1375, body: 'hatch' },
  { id: 'mx5', name: 'Weekend MX-5', withDriver: 1135, withoutDriver: 1060, body: 'roadster' },
]

const sampleSessions: Session[] = [
  { id: 's1', vehicleId: 'gti', date: '26 Oct · 16:42', zeroTo100: 7.4, hp: 420 },
  { id: 's2', vehicleId: 'gti', date: '24 Oct · 09:18', zeroTo100: 7.6, hp: 410 },
  { id: 's3', vehicleId: 'gti', date: '19 Oct · 18:05', zeroTo100: 7.9, hp: 398 },
  { id: 's4', vehicleId: 'mx5', date: '22 Oct · 11:30', zeroTo100: 6.9, hp: 181 },
]

const tabs = [
  { id: 'tabHome', label: 'Home', href: '#top' },
  { id: 'tabGarage', label: 'Garage', href: '#garage' },
  { id: 'tabSessions', label: 'Sessions', href: '#sessions' },
]

const emptyForm: VehicleForm = { name: '', withDriver: '', withoutDriver: '' }

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11m-14 0h14m-14 0a2 2 0 0 0-2 2v3h18v-3a2 2 0 0 0-2-2M6 16v2m12-2v2M7 13.5h1m8 0h1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CarArt({ body }: { body: BodyStyle }) {
  const shell =
    body === 'hatch'
      ? 'M18,70 C18,60 24,55 36,53 L70,48 L98,26 C102,23 107,22 112,22 L168,22 C176,22 181,25 184,32 L194,52 C200,54 204,58 204,64 L204,74 C204,77 202,79 199,79 L22,79 C19,79 18,77 18,74 Z'
      : 'M14,68 C14,61 20,57 30,56 L88,52 L108,40 L128,40 L136,52 L188,54 C198,55 206,59 206,66 L206,73 C206,76 204,78 201,78 L19,78 C16,78 14,76 14,73 Z'
  const glass =
    body === 'hatch'
      ? 'M84,48 L103,30 C106,28 109,27 112,27 L138,27 L138,48 Z M144,27 L166,27 C171,27 175,29 177,33 L184,48 L144,48 Z'
      : 'M100,51 L112,43 L126,43 L131,51 Z'
  return (
    <svg className="car-art" viewBox="0 0 224 100" aria-hidden="true">
      <ellipse cx="112" cy="90" rx="96" ry="6" fill="rgba(0,0,0,0.28)" />
      <path d={shell} fill="#d7dde6" />
      <path d={shell} fill="url(#carShade)" />
      <path d={glass} fill="#33475f" />
      <path d="M24,66 L200,66" stroke="#aab4c2" strokeWidth="1.5" />
      <rect x="192" y="58" width="10" height="5" rx="2" fill="#f5f7fa" />
      <rect x="18" y="58" width="8" height="5" rx="2" fill="#c0392b" />
      {[58, 166].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="78" r="15" fill="#1d232c" />
          <circle cx={cx} cy="78" r="9" fill="#8a96a6" />
          <circle cx={cx} cy="78" r="3" fill="#1d232c" />
        </g>
      ))}
      <defs>
        <linearGradient id="carShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#5c6b80" stopOpacity="0.35" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function formatKg(value: number) {
  return `${value.toLocaleString('en-US')} kg`
}

function Home() {
  const navigate = useNavigate()
  const user = getUser()
  const [vehicles, setVehicles] = useState<Vehicle[]>(sampleVehicles)
  const [selectedId, setSelectedId] = useState(sampleVehicles[0].id)
  const [formMode, setFormMode] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState<VehicleForm>(emptyForm)
  const [formError, setFormError] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [showAllSessions, setShowAllSessions] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const selected = vehicles.find((v) => v.id === selectedId) ?? vehicles[0]
  const vehicleSessions = selected ? sampleSessions.filter((s) => s.vehicleId === selected.id) : []
  const visibleSessions = showAllSessions ? vehicleSessions : vehicleSessions.slice(0, 2)
  const bestSession = vehicleSessions.reduce<Session | null>(
    (best, s) => (!best || s.zeroTo100 < best.zeroTo100 ? s : best),
    null,
  )
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()

  const handleLogout = () => {
    clearUser()
    navigate('/')
  }

  const openAddForm = () => {
    setForm(emptyForm)
    setFormError('')
    setFormMode('add')
  }

  const openEditForm = () => {
    if (!selected) return
    setForm({
      name: selected.name,
      withDriver: String(selected.withDriver),
      withoutDriver: String(selected.withoutDriver),
    })
    setFormError('')
    setFormMode('edit')
  }

  const closeForm = () => {
    setFormMode(null)
    setFormError('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const name = form.name.trim()
    const withDriver = Number(form.withDriver)
    const withoutDriver = Number(form.withoutDriver)
    if (!name) {
      setFormError('Give your vehicle a name.')
      return
    }
    if (!(withDriver > 0) || !(withoutDriver > 0)) {
      setFormError('Enter both weights in kg.')
      return
    }
    if (withDriver < withoutDriver) {
      setFormError('Weight with driver should be at least the weight without driver.')
      return
    }
    if (formMode === 'edit' && selected) {
      setVehicles((list) =>
        list.map((v) => (v.id === selected.id ? { ...v, name, withDriver, withoutDriver } : v)),
      )
    } else {
      const id = `v${Date.now()}`
      setVehicles((list) => [...list, { id, name, withDriver, withoutDriver, body: 'hatch' }])
      setSelectedId(id)
    }
    closeForm()
  }

  const selectVehicle = (id: string) => {
    setSelectedId(id)
    setShowDetails(false)
    setShowAllSessions(false)
  }

  return (
    <div className="home" id="top">
      <header className="home-nav">
        <a className="home-brand" href="/" aria-label="Accelly landing page">
          <Logo size="sm" />
        </a>
        <nav className="home-tabs" aria-label="Main">
          {tabs.map((tab, index) => (
            <a
              key={tab.id}
              id={tab.id}
              href={tab.href}
              className={index === 0 ? 'home-tab home-tab-active' : 'home-tab'}
              aria-current={index === 0 ? 'page' : undefined}
            >
              {tab.label}
            </a>
          ))}
        </nav>
        <div className="home-actions">
          <button id="helpButton" type="button" className="icon-button" aria-label="Help">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.1-2.4 3.6M12 16.8v.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="avatar-wrap">
            <button
              id="avatarButton"
              type="button"
              className="avatar"
              aria-label="Account menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {initials || '?'}
            </button>
            {menuOpen && (
              <div className="avatar-menu" role="menu">
                <div className="avatar-menu-user">
                  <strong>
                    {user.firstName} {user.lastName}
                  </strong>
                  <small>{user.email}</small>
                </div>
                <button id="logout" type="button" role="menuitem" className="avatar-menu-item" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="home-main">
        <div className="home-heading">
          <div>
            <h1>Welcome back, {user.firstName}</h1>
            <p>Your garage, your setup, your next run.</p>
          </div>
          <span className="home-pill">Example garage</span>
        </div>

        <div className="home-grid">
          <section className="garage" id="garage" aria-labelledby="garageTitle">
            <div className="section-head">
              <h2 id="garageTitle">Your garage</h2>
              <small>
                {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'}
              </small>
            </div>
            <p className="section-sub">Select a vehicle to see its setup and runs.</p>

            <ul className="vehicle-list">
              {vehicles.map((vehicle) => {
                const active = vehicle.id === selected?.id
                return (
                  <li key={vehicle.id}>
                    <button
                      type="button"
                      className={active ? 'vehicle-item vehicle-item-active' : 'vehicle-item'}
                      aria-pressed={active}
                      onClick={() => selectVehicle(vehicle.id)}
                    >
                      <span className="vehicle-icon">
                        <CarIcon />
                      </span>
                      <span className="vehicle-name">{vehicle.name}</span>
                      <span className="vehicle-radio" aria-hidden="true" />
                    </button>
                  </li>
                )
              })}
            </ul>

            {formMode ? (
              <form className="vehicle-form" onSubmit={handleSubmit}>
                <strong>{formMode === 'edit' ? 'Edit vehicle' : 'Add vehicle'}</strong>
                {formError && (
                  <p className="vehicle-form-error" role="alert">
                    {formError}
                  </p>
                )}
                <label htmlFor="vehicleName">Name</label>
                <input
                  id="vehicleName"
                  type="text"
                  placeholder="e.g. Track Civic"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <div className="vehicle-form-row">
                  <div>
                    <label htmlFor="vehicleWithDriver">With driver (kg)</label>
                    <input
                      id="vehicleWithDriver"
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={form.withDriver}
                      onChange={(e) => setForm({ ...form, withDriver: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="vehicleWithoutDriver">Without driver (kg)</label>
                    <input
                      id="vehicleWithoutDriver"
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={form.withoutDriver}
                      onChange={(e) => setForm({ ...form, withoutDriver: e.target.value })}
                    />
                  </div>
                </div>
                <div className="vehicle-form-actions">
                  <button type="button" className="home-btn home-btn-ghost" onClick={closeForm}>
                    Cancel
                  </button>
                  <button id="saveVehicle" type="submit" className="home-btn home-btn-primary">
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <button id="addVehicle" type="button" className="add-vehicle" onClick={openAddForm}>
                <span aria-hidden="true">+</span> Add vehicle
              </button>
            )}
          </section>

          {selected && (
            <section className="vehicle-panel" aria-label="Selected vehicle">
              <div className="selected-card">
                <small className="selected-label">Selected vehicle</small>
                <div className="selected-main">
                  <h2>{selected.name}</h2>
                  <CarArt body={selected.body} />
                </div>
                <div className="weight-row">
                  <div className="weight-tile">
                    <strong>{formatKg(selected.withDriver)}</strong>
                    <small>With driver</small>
                  </div>
                  <div className="weight-tile">
                    <strong>{formatKg(selected.withoutDriver)}</strong>
                    <small>Without driver</small>
                  </div>
                </div>
                {showDetails && (
                  <dl className="vehicle-details">
                    <div>
                      <dt>Driver weight</dt>
                      <dd>{formatKg(selected.withDriver - selected.withoutDriver)}</dd>
                    </div>
                    <div>
                      <dt>Best 0-100</dt>
                      <dd>{bestSession ? `${bestSession.zeroTo100.toFixed(1)} s` : '—'}</dd>
                    </div>
                    <div>
                      <dt>Power to weight</dt>
                      <dd>
                        {bestSession
                          ? `${Math.round((bestSession.hp / selected.withDriver) * 1000)} hp/t`
                          : '—'}
                      </dd>
                    </div>
                  </dl>
                )}
              </div>

              <div className="vehicle-actions">
                <button
                  id="viewVehicle"
                  type="button"
                  className="home-btn home-btn-primary home-btn-wide"
                  aria-expanded={showDetails}
                  onClick={() => setShowDetails((open) => !open)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M4 7h16M4 12h16M4 17h16" />
                      <circle cx="15" cy="7" r="1.8" fill="currentColor" />
                      <circle cx="9" cy="12" r="1.8" fill="currentColor" />
                      <circle cx="13" cy="17" r="1.8" fill="currentColor" />
                    </g>
                  </svg>
                  {showDetails ? 'Hide details' : 'View vehicle'}
                </button>
                <button id="editVehicle" type="button" className="home-btn home-btn-ghost" onClick={openEditForm}>
                  Edit vehicle
                </button>
              </div>
              <p className="panel-note">Record sessions on your phone. Review your garage and results here.</p>

              <div className="sessions" id="sessions">
                <div className="section-head">
                  <h2>Recent sessions</h2>
                  {vehicleSessions.length > 2 && (
                    <button
                      id="viewAllSessions"
                      type="button"
                      className="link-button"
                      onClick={() => setShowAllSessions((all) => !all)}
                    >
                      {showAllSessions ? 'Show less' : 'View all →'}
                    </button>
                  )}
                </div>
                {visibleSessions.length === 0 ? (
                  <p className="sessions-empty">No sessions yet. Record your first run from the mobile app.</p>
                ) : (
                  <ul className="session-list">
                    {visibleSessions.map((session) => (
                      <li key={session.id} className="session-item">
                        <div>
                          <strong>{selected.name}</strong>
                          <small>{session.date}</small>
                        </div>
                        <div className="session-stats">
                          <div>
                            <strong>{session.zeroTo100.toFixed(1)} s</strong>
                            <small>0-100 km/h</small>
                          </div>
                          <div>
                            <strong>{session.hp} hp</strong>
                            <small>Est. wheel</small>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="panel-note">Illustrative sessions · Sample results, not dyno measurements.</p>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="home-footer">
        <span>Illustrative preview · Sample vehicles and sessions</span>
        <span>
          Units: metric / hp <span aria-hidden="true">·</span> Settings
        </span>
      </footer>
    </div>
  )
}

export default Home
