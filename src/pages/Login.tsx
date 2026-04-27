import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'impact-ui/dist/components';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../types';
import { AUTH_ERRORS } from '../constants/auth';
import { ASSETS, APP_CONFIG } from '../constants/app';
import './Login.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setError('');

    // Validate fields
    if (!email || !password) {
      setError(AUTH_ERRORS.REQUIRED_FIELD);
      return;
    }

    // Attempt login
    const success = login(email, password);

    if (success) {
      // Redirect to home on success
      navigate(ROUTES.STORE_OPS_HOME);
    } else {
      // Show error on failure
      setError(AUTH_ERRORS.INVALID_CREDENTIALS);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-panel">
            <img src={ASSETS.iaLogo} alt="Impact Analytics" />
          </div>
          <p className="login-tagline">Intelligent retail decisioning & execution cloud</p>
        </div>

        {/* Login Card */}
        <Card size="medium">
          <div className="login-card">
            <h1 className="login-title">{APP_CONFIG.name}</h1>
            <p className="login-subtitle">Sign in to continue</p>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Input */}
              <div className="form-field email-field">
                <label className="email-label">Email / User ID</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className={`email-input ${error ? 'input-error' : ''}`}
                />
              </div>

              {/* Password Input */}
              <div className="form-field password-field">
                <label className="password-label">Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    className={`password-input ${error ? 'input-error' : ''}`}
                  />
                  <button 
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {/* Forgot Password Link */}
              <div className="forgot-password-link">
                <span className="forgot-password-disabled" title="Contact your administrator to reset your password">
                  Forgot Password?
                </span>
              </div>

              {/* Submit Button */}
              <Button
                variant="primary"
                size="large"
                className="login-button"
                onClick={handleSubmit}
              >
                Sign In
              </Button>

              {/* Sign Up Link */}
              <div className="signup-link">
                Need access? Contact your administrator
              </div>
            </form>
          </div>
        </Card>

        {/* Footer */}
        <div className="login-footer">
          <p>{APP_CONFIG.fullName} v{APP_CONFIG.version}</p>
        </div>
      </div>
    </div>
  );
};
