import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_CONFIG } from '../config';
import { formatDateLong, getInitials, todayISO } from '../utils/helpers';

const TITLES = {
  '/employee/dashboard': 'Dashboard',
  '/employee/apply': 'Apply Leave',
  '/employee/requests': 'My Requests',
  '/employee/balance': 'Leave Balance',
  '/employee/reports': 'Reports',
  '/manager/dashboard': 'Dashboard',
  '/manager/pending': 'Pending Requests',
  '/manager/requests': 'All Requests',
  '/manager/reports': 'Reports',
};

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn header-menu" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <h1 className="header-title">{TITLES[pathname] || 'Dashboard'}</h1>
      </div>
      <div className="header-right">
        {API_CONFIG.useMockData && <span className="soft-pill">Mock Data Mode</span>}
        <span className="header-date">{formatDateLong(todayISO())}</span>
        <div className="header-user">
          <span className="avatar sm">{getInitials(user?.name || '')}</span>
          <div className="header-user-meta">
            <span className="header-user-name">{user?.name}</span>
            <span className="header-user-role">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
