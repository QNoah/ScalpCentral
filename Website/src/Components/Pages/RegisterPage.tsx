import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import logoImage from '../../assets/hero.png';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
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
      confirmPassword: '',
    };

    if (!formData.email) {
      newErrors.email = 'Email required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Registration successful!', formData);
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
            <span className="retro-box-title">// USER REGISTRATION</span>
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

            <div>
              <label htmlFor="confirmPassword" className="retro-label">
                &gt; CONFIRM PASSWORD
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="retro-input"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <div className="retro-error">{errors.confirmPassword}</div>
              )}
            </div>

            <button type="submit" className="retro-button w-full">
              [ REGISTER ]
            </button>

            <div className="text-center mt-4">
              <span className="retro-link-text">
                ALREADY HAVE AN ACCOUNT?{' '}
                <Link to="/login" className="retro-link">
                  LOGIN HERE
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