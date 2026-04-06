import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Card } from 'impact-ui/dist/components';
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
      navigate(ROUTES.HOME);
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
          <img src={ASSETS.iaLogo} alt="Impact Analytics" />
        </div>

        {/* Login Card */}
        <Card size="medium">
          <div className="login-card">
            <h1 className="login-title">{APP_CONFIG.name}</h1>
            <p className="login-subtitle">Sign in to continue</p>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Input */}
              <div className="form-field">
                <Input
                  id="email"
                  name="email"
                  label="Email / User ID"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  isError={!!error}
                  size="large"
                />
              </div>

              {/* Password Input */}
              <div className="form-field">
                <Input
                  id="password"
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  isError={!!error}
                  rightIcon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  rightIconClick={togglePasswordVisibility}
                  size="large"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {/* Forgot Password Link */}
              <div className="forgot-password-link">
                <Link to={ROUTES.FORGOT_PASSWORD}>
                  Forgot Password?
                </Link>
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
                Don't have an account? <Link to={ROUTES.SIGNUP}>Sign Up</Link>
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
