import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Card, Select } from 'impact-ui';
import { useAuth } from '../context/AuthContext';
import { ROUTES, UserRole } from '../types';
import { ASSETS, APP_CONFIG } from '../constants/app';
import './Login.css'; // Reusing Login styles for consistency

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Using login for auto-login after signup simulation

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'SM' as UserRole,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { label: 'Store Manager (SM)', value: 'SM' },
    { label: 'District Manager (DM)', value: 'DM' },
    { label: 'HQ Merchandising (HQ)', value: 'HQ' },
    { label: 'Administrator', value: 'ADMIN' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isOpen, setIsOpen] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<any[]>(roleOptions);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const handleRoleChange = (options: any) => {
    const opts = Array.isArray(options) ? options : options ? [options] : [];
    setSelectedOptions(opts);
    if (opts.length > 0) {
      setFormData(prev => ({ ...prev, role: opts[0].value as UserRole }));
    }
  };

  const handleCurrentOptionsChange = (options: any) => {
    setCurrentOptions(Array.isArray(options) ? options : []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, we just log them in
      login(formData.email, formData.password);
      navigate(ROUTES.HOME);
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
            <h1 className="login-title">Create Account</h1>
            <p className="login-subtitle">Join {APP_CONFIG.name} to manage your stores</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-field">
                <Input
                  id="name"
                  name="name"
                  label="Full Name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  size="large"
                />
              </div>

              <div className="form-field">
                <Input
                  id="email"
                  name="email"
                  label="Email Address"
                  placeholder="john@example.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  size="large"
                />
              </div>

              <div className="form-field">
                <Select
                  label="Role"
                  initialOptions={roleOptions}
                  currentOptions={currentOptions}
                  setCurrentOptions={handleCurrentOptionsChange}
                  selectedOptions={selectedOptions}
                  setSelectedOptions={handleRoleChange}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  placeholder="Select your role"
                  setIsSelectAll={() => {}}
                  width="100%"
                />
              </div>

              <div className="form-field">
                <Input
                  id="password"
                  name="password"
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  size="large"
                />
              </div>

              <div className="form-field">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="••••••••"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                Create Account
              </Button>

              <div className="signup-link">
                Already have an account? <Link to={ROUTES.LOGIN}>Sign In</Link>
              </div>
            </form>
          </div>
        </Card>

        <div className="login-footer">
          <p>{APP_CONFIG.fullName} v{APP_CONFIG.version}</p>
        </div>
      </div>
    </div>
  );
};
