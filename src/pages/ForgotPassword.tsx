import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Card } from 'impact-ui/dist/components';
import { ROUTES } from '../types';
import { ASSETS, APP_CONFIG } from '../constants/app';
import './Login.css';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-logo">
          <img src={ASSETS.iaLogo} alt="Impact Analytics" />
        </div>

        <Card size="medium">
          <div className="login-card">
            {!isSubmitted ? (
              <>
                <h1 className="login-title">Reset Password</h1>
                <p className="login-subtitle">Enter your email to receive a reset link</p>

                <form onSubmit={handleSubmit} className="login-form">
                  <div className="form-field">
                    <Input
                      id="email"
                      name="email"
                      label="Email Address"
                      placeholder="john@example.com"
                      type="email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      size="large"
                    />
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    className="login-button"
                    isLoading={isLoading}
                  >
                    Send Reset Link
                  </Button>

                  <div className="signup-link">
                    Remember your password? <Link to={ROUTES.LOGIN}>Sign In</Link>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <h2 className="login-title">Check Your Email</h2>
                <p className="login-subtitle">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <div style={{ marginTop: '30px' }}>
                  <Button
                    variant="secondary"
                    size="large"
                    onClick={() => navigate(ROUTES.LOGIN)}
                  >
                    Return to Login
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="login-footer">
          <p>{APP_CONFIG.fullName} v{APP_CONFIG.version}</p>
        </div>
      </div>
    </div>
  );
};
