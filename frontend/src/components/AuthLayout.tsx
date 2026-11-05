import type { ReactNode } from 'react'
import Logo from './Logo.tsx'
import heroImage from '../assets/hero.jpg'
import './AuthLayout.css'

type AuthLayoutProps = {
  heading: string
  subheading: string
  children: ReactNode
}

// Shared two-panel layout for the Login and Register pages:
// left = logo, heading and hero image; right = the form card.
// Panels stack on narrow screens.
function AuthLayout({ heading, subheading, children }: AuthLayoutProps) {
  return (
    <div className="entry-page">
      <section className="entry-intro">
        <div className="entry-intro-text">
          <Logo />
          <h1 className="entry-title">{heading}</h1>
          <p className="entry-lead">{subheading}</p>
        </div>
        <div className="entry-visual">
          <img src={heroImage} alt="" />
        </div>
      </section>

      <section className="entry-panel">
        <div className="entry-card">{children}</div>
      </section>
    </div>
  )
}

export default AuthLayout
