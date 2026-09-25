import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ApplyLeave from './pages/ApplyLeave';
import MyRequests from './pages/MyRequests';
import LeaveBalance from './pages/LeaveBalance';
import ManagerDashboard from './pages/ManagerDashboard';
import PendingRequests from './pages/PendingRequests';
import AllRequests from './pages/AllRequests';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';

const dashboardFor = (user) => (user.role === 'Manager' ? '/manager/dashboard' : '/employee/dashboard');

function ProtectedRoute({ role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={dashboardFor(user)} replace />;
  return <Layout><Outlet /></Layout>;
}

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={dashboardFor(user)} replace />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute role="Employee" />}>
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/apply" element={<ApplyLeave />} />
              <Route path="/employee/requests" element={<MyRequests />} />
              <Route path="/employee/balance" element={<LeaveBalance />} />
              <Route path="/employee/reports" element={<Reports />} />
            </Route>

            <Route element={<ProtectedRoute role="Manager" />}>
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/manager/pending" element={<PendingRequests />} />
              <Route path="/manager/requests" element={<AllRequests />} />
              <Route path="/manager/reports" element={<Reports />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
