import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { MainLayout } from './components/layout/MainLayout/MainLayout';
import { MasterPOGManagement } from './pages/MasterPOGManagement';
import { POGRuleManagement } from './pages/POGRuleManagement';
import { POGLocalizationEngine } from './pages/POGLocalizationEngine';
import { StoreExecution } from './pages/StoreExecution';
import { ROUTES } from './types';
import './App.css';

/**
 * Main App Component
 * Sets up routing and authentication context
 * 
 * Route Structure:
 * - / → Redirects to /login
 * - /login → Public route (Login page)
 * - /signup → Public route (Signup page)
 * - /forgot-password → Public route (Forgot Password page)
 * - /home → Protected route with MainLayout
 * - /planogram/master-pog → Protected route (Master POG Management)
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
          <Route path={ROUTES.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />
          <Route path={ROUTES.SIGNUP} element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          
          {/* Protected routes with MainLayout */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path={ROUTES.HOME} element={<div className="home-welcome"><h2>Welcome to IA StoreHub</h2><p>Select a module from the sidebar to get started.</p></div>} />
            <Route path={ROUTES.MASTER_POG} element={<MasterPOGManagement />} />
            <Route path="/planogram/rule-management" element={<POGRuleManagement />} />
            <Route path="/planogram/localization-engine" element={<POGLocalizationEngine />} />
            <Route path="/planogram/store-execution" element={<StoreExecution />} />
          </Route>
          
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
