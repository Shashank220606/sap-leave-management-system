import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, Briefcase, Building2, CalendarPlus, CheckCircle2, ClipboardList, Clock, FileText, XCircle,
} from 'lucide-react';
import { getEmployee, getLeaveBalances, getLeaveRequests } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LeaveBalanceCard from '../components/LeaveBalanceCard';
import RequestDetails from '../components/RequestDetails';
import RequestTable from '../components/RequestTable';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getGreeting, getStats } from '../utils/helpers';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [balances, setBalances] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsRequest, setDetailsRequest] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [emp, bal, reqs] = await Promise.all([
          getEmployee(user.id),
          getLeaveBalances(user.id),
          getLeaveRequests(user.id),
        ]);
        if (!active) return;
        setEmployee(emp);
        setBalances(bal);
        setRequests(reqs);
      } catch (err) {
        if (active) showToast('error', err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user.id, showToast]);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;

  const stats = getStats(requests);
  const balanceMap = Object.fromEntries(balances.map((b) => [b.leaveType, b.availableDays]));

  return (
    <div className="page">
      <section className="card welcome-card">
        <div>
          <h2>Good {getGreeting()}, {employee.name.split(' ')[0]}</h2>
          <p>Here's an overview of your leave activity and balances.</p>
          <div className="info-chips">
            <span className="info-chip"><BadgeCheck size={14} /> {employee.id}</span>
            <span className="info-chip"><Building2 size={14} /> {employee.department}</span>
            <span className="info-chip"><Briefcase size={14} /> {employee.designation}</span>
          </div>
        </div>
        <div className="welcome-actions">
          <button className="btn btn-primary" onClick={() => navigate('/employee/apply')}>
            <CalendarPlus size={16} /> Apply Leave
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/employee/requests')}>
            <ClipboardList size={16} /> View Requests
          </button>
        </div>
      </section>

      <section className="grid grid-3">
        {balances.map((balance) => (
          <LeaveBalanceCard key={balance.leaveType} balance={balance} />
        ))}
      </section>

      <section>
        <div className="section-head"><h3>Leave Overview</h3></div>
        <div className="grid grid-4">
          <StatCard icon={FileText} label="Total Requests" value={stats.total} tone="blue" />
          <StatCard icon={Clock} label="Pending Requests" value={stats.pending} tone="amber" />
          <StatCard icon={CheckCircle2} label="Approved Requests" value={stats.approved} tone="green" />
          <StatCard icon={XCircle} label="Rejected Requests" value={stats.rejected} tone="red" />
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>Recent Leave Requests</h3>
          <Link className="link-btn" to="/employee/requests">View all <ArrowRight size={14} /></Link>
        </div>
        <RequestTable requests={requests.slice(0, 5)} onView={setDetailsRequest} showReason />
      </section>

      <RequestDetails
        request={detailsRequest}
        availableBalance={detailsRequest ? balanceMap[detailsRequest.leaveType] : undefined}
        onClose={() => setDetailsRequest(null)}
      />
    </div>
  );
}
