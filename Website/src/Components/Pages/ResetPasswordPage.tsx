import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import logoImage from '../../assets/hero.png';
import '../Styling/RetroStyles.css';

export function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Email required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email invalid');
      return;
    }

    setError('');
    setSubmitted(true);
    console.log('Password reset requested for:', email);
  };

  return (
    <div className="retro-container">
      <div className="scanlines"></div>
      <div className="retro-grid"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontFamily: 'Orbitron, sans-serif', fontSize: '0.875rem', color: 'var(--retro-accent)', textDecoration: 'none' }}>
          <ArrowLeft size={20} />
          BACK TO LOGIN
        </Link>

        <div className="text-center mb-8">
          <img src={logoImage} alt="ScalpCentral" style={{ height: '80px', margin: '0 auto 1rem' }} />
          <div className="retro-version">BETA v1.0</div>
        </div>

        <div className="retro-box">
          <div className="retro-box-header">
            <span className="retro-box-title">// RESET PASSWORD</span>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--retro-text-muted)',
                marginBottom: '1rem',
              }}>
                Enter your email address and we'll send you a link to reset your password.
              </div>

              <div>
                <label htmlFor="email" className="retro-label">
                  &gt; EMAIL
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="retro-input"
                  placeholder="USER@DOMAIN.COM"
                />
                {error && (
                  <div className="retro-error">{error}</div>
                )}
              </div>

              <button type="submit" className="retro-button w-full">
                [ SEND RESET LINK ]
              </button>

              <div className="text-center mt-4">
                <Link to="/login" className="retro-link-text">
                  <ArrowLeft size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  <span className="retro-link">Back to login</span>
                </Link>
              </div>
            </form>
          ) : (
            <div className="p-6">
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--retro-accent)',
                marginBottom: '1.5rem',
                textAlign: 'center',
                padding: '1rem',
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '4px',
                border: '2px solid var(--retro-accent)',
              }}>
                ✓ PASSWORD RESET LINK SENT!
              </div>

              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--retro-text-muted)',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}>
                Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
              </div>

              <Link to="/login" className="retro-button w-full block text-center">
                [ RETURN TO LOGIN ]
              </Link>
            </div>
          )}
        </div>

        <div className="text-center mt-6" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.625rem', color: 'rgba(255, 255, 255, 0.4)' }}>
          <div>© 2026 ScalpCentral - Your investment, Your platform!</div>
          <div style={{ marginTop: '0.5rem' }}>
            Secure Pokemon card trading • Authenticity guaranteed
          </div>
        </div>
      </div>
    </div>
  );
}
