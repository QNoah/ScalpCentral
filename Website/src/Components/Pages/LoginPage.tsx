import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import logoImage from '../../assets/hero.png';
import '../Styling/RetroStyles.css';

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      newErrors.email = 'Email required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Login successful!', formData);
    }
  };

  return (
    <div className="retro-container">
      <div className="scanlines"></div>
      <div className="retro-grid"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontFamily: 'Orbitron, sans-serif', fontSize: '0.875rem', color: 'var(--retro-accent)', textDecoration: 'none' }}>
          <ArrowLeft size={20} />
          BACK TO HOME
        </Link>

        <div className="text-center mb-8">
          <img src={logoImage} alt="ScalpCentral" style={{ height: '80px', margin: '0 auto 1rem' }} />
          <div className="retro-version">BETA v1.0</div>
        </div>

        <div className="retro-box">
          <div className="retro-box-header">
            <span className="retro-box-title">// USER LOGIN</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div>
              <label htmlFor="email" className="retro-label">
                &gt; EMAIL
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="retro-input"
                placeholder="USER@DOMAIN.COM"
              />
              {errors.email && (
                <div className="retro-error">{errors.email}</div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="retro-label">
                &gt; PASSWORD
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="retro-input"
                placeholder="••••••••"
              />
              {errors.password && (
                <div className="retro-error">{errors.password}</div>
              )}
            </div>

            <div className="text-right">
              <Link to="/reset-password" className="retro-link" style={{ fontSize: '0.75rem' }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="retro-button w-full">
              [ LOGIN ]
            </button>

            <div className="text-center mt-4">
              <span className="retro-link-text">
                DON'T HAVE AN ACCOUNT?{' '}
                <Link to="/register" className="retro-link">
                  REGISTER HERE
                </Link>
              </span>
            </div>
          </form>
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