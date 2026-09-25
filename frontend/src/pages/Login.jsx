import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  AlertCircle, BadgeCheck, BarChart3, CalendarCheck, ClipboardList, Eye, EyeOff, Lock, LogIn, ShieldCheck, User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getDemoCredentials } from '../services/api';

export default function Login() {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ employeeId: '', password: '', role: 'Employee' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState([]);

  useEffect(() => {
    getDemoCredentials().then(setDemoAccounts).catch(() => {});
  }, []);

  // Already signed in -> straight to the dashboard
  if (user) {
    return <Navigate to={user.role === 'Manager' ? '/manager/dashboard' : '/employee/dashboard'} replace />;
  }

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setFormError('');
  };

  const validate = () => {
    const next = {};
    if (!form.employeeId.trim()) next.employeeId = 'Employee ID is required.';
    if (!form.password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setFormError('');
    try {
      const authenticated = await login(form.employeeId.trim(), form.password, form.role);
      showToast('success', `Welcome back, ${authenticated.name}!`);
      navigate(authenticated.role === 'Manager' ? '/manager/dashboard' : '/employee/dashboard', { replace: true });
    } catch (err) {
      setFormError(err.message);
      showToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (account) => {
    setForm({ employeeId: account.employeeId, password: account.password, role: account.role });
    setErrors({});
    setFormError('');
  };

  return (
    <div className="login-page">
      <div className="login-brand">
        <div className="login-brand-inner">
          <div className="brand-row">
            <span className="brand-mark lg"><CalendarCheck size={22} /></span>
            <span className="brand-name light">LeaveFlow</span>
          </div>
          <h2>Manage leave requests with clarity and control.</h2>
          <p>
            A modern leave management experience for employees and managers,
            architected to plug directly into SAP BTP ABAP Cloud.
          </p>
          <ul className="brand-features">
            <li><CalendarCheck size={18} /> Real-time leave balances</li>
            <li><ClipboardList size={18} /> Streamlined approval workflow</li>
            <li><BarChart3 size={18} /> Reports and insights</li>
          </ul>
        </div>
        <p className="brand-foot">Frontend demo - Currently running on mock data</p>
      </div>

      <div className="login-panel">
        <div className="login-card">
          <div className="login-head">
            <span className="brand-mark lg"><CalendarCheck size={22} /></span>
            <h1>Welcome back</h1>
            <p>Sign in to your leave management portal</p>
          </div>

          {formError && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="employeeId">Employee ID</label>
              <div className="input-wrap">
                <BadgeCheck size={16} className="input-icon" />
                <input
                  id="employeeId"
                  type="text"
                  placeholder="e.g. EMP001"
                  value={form.employeeId}
                  onChange={(e) => setField('employeeId', e.target.value)}
                  className={errors.employeeId ? 'invalid' : ''}
                  autoComplete="username"
                />
              </div>
              {errors.employeeId && <p className="field-error">{errors.employeeId}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  className={errors.password ? 'invalid has-toggle' : 'has-toggle'}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label>Login as</label>
              <div className="role-toggle">
                <button
                  type="button"
                  className={`role-option ${form.role === 'Employee' ? 'active' : ''}`}
                  onClick={() => setField('role', 'Employee')}
                >
                  <User size={18} />
                  <span>Employee</span>
                </button>
                <button
                  type="button"
                  className={`role-option ${form.role === 'Manager' ? 'active' : ''}`}
                  onClick={() => setField('role', 'Manager')}
                >
                  <ShieldCheck size={18} />
                  <span>Manager</span>
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <span className="spinner spinner-sm light" /> : <LogIn size={16} />}
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="demo-creds">
            <p className="demo-title">Demo Credentials</p>
            {demoAccounts.map((account) => (
              <div key={account.employeeId} className="demo-row">
                <div>
                  <span className="demo-id">{account.employeeId}</span>
                  <span className="demo-meta">{account.role} - {account.password}</span>
                </div>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => fillDemo(account)}>
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
