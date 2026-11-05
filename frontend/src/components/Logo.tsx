import './Logo.css'

type LogoProps = {
  size?: 'sm' | 'md'
}

function Logo({ size = 'md' }: LogoProps) {
  return (
    <span className={`logo logo-${size}`}>
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="3" fill="currentColor" />
          <ellipse cx="16" cy="16" rx="9" ry="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <ellipse cx="16" cy="16" rx="9" ry="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" transform="rotate(60 16 16)" />
          <ellipse cx="16" cy="16" rx="9" ry="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" transform="rotate(120 16 16)" />
        </svg>
      </span>
      <span className="logo-word">Accelly</span>
    </span>
  )
}

export default Logo
