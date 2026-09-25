import { NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3, CalendarCheck, CalendarPlus, ClipboardList, Clock, LayoutDashboard, LogOut, Wallet, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';

const NAV = {
  Employee: [
    { to: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/employee/apply', label: 'Apply Leave', icon: CalendarPlus },
    { to: '/employee/requests', label: 'My Requests', icon: ClipboardList },
    { to: '/employee/balance', label: 'Leave Balance', icon: Wallet },
    { to: '/employee/reports', label: 'Reports', icon: BarChart3 },
  ],
  Manager: [
    { to: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/manager/pending', label: 'Pending Requests', icon: Clock },
    { to: '/manager/requests', label: 'All Requests', icon: ClipboardList },
    { to: '/manager/reports', label: 'Reports', icon: BarChart3 },
  ],
};

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-mark"><CalendarCheck size={20} /></span>
          <div>
            <span className="brand-name">LeaveFlow</span>
            <span className="brand-sub">Leave Management</span>
          </div>
          <button className="icon-btn sidebar-close" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-heading">{user?.role === 'Manager' ? 'Manager' : 'Employee'} Menu</p>
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="sidebar-user">
            <span className="avatar">{getInitials(user?.name || '')}</span>
            <div>
              <span className="sidebar-user-name">{user?.name}</span>
              <span className="sidebar-user-role">{user?.role} - {user?.id}</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
    </>
  );
}
