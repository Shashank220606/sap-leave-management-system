import { useEffect, useState } from 'react';
import {
  BadgeCheck, Briefcase, Building2, Check, CheckCircle2, Clock, Eye, FileText, Users, X, XCircle,
} from 'lucide-react';
import { getAllLeaveBalances, getAllLeaveRequests, getEmployees } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RequestTable from '../components/RequestTable';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import useRequestActions from '../hooks/useRequestActions';
import { getGreeting, getInitials, getStats } from '../utils/helpers';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [balancesMap, setBalancesMap] = useState({});
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [reqs, balances, employees] = await Promise.all([
        getAllLeaveRequests(),
        getAllLeaveBalances(),
        getEmployees(),
      ]);
      setRequests(reqs);
      setBalancesMap(Object.fromEntries(balances.map((b) => [`${b.employeeId}-${b.leaveType}`, b.availableDays])));
      setTeam(employees.filter((e) => e.role === 'Employee'));
    } catch (err) {
      showToast('error', err.message);
    }
  };

  useEffect(() => {
    (async () => {
      await load();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actions = useRequestActions({ balancesMap, onChanged: load });

  if (loading) return <LoadingSpinner label="Loading manager dashboard..." />;

  const stats = getStats(requests);
  const pending = requests.filter((r) => r.status === 'PENDING');

  return (
    <div className="page">
      <section className="card welcome-card">
        <div>
          <h2>Good {getGreeting()}, {user.name.split(' ')[0]}</h2>
          <p>Review pending leave requests and keep your team's balances up to date.</p>
          <div className="info-chips">
            <span className="info-chip"><BadgeCheck size={14} /> {user.id}</span>
            <span className="info-chip"><Building2 size={14} /> {user.department}</span>
            <span className="info-chip"><Briefcase size={14} /> {user.designation}</span>
          </div>
        </div>
        <div className="welcome-actions">
          <span className="team-count"><Users size={16} /> {team.length} team members</span>
        </div>
      </section>

      <section className="card">
        <div className="card-head"><h3>Team Overview</h3></div>
        <div className="card-body">
          <div className="team-grid">
            {team.map((member) => {
              const count = pending.filter((r) => r.employeeId === member.id).length;
              return (
                <div key={member.id} className="team-member">
                  <span className="avatar">{getInitials(member.name)}</span>
                  <div>
                    <span className="team-member-name">{member.name}</span>
                    <span className="team-member-sub">{member.id} - {member.department}</span>
                  </div>
                  <span className={`team-pending ${count === 0 ? 'zero' : ''}`}>{count} pending</span>
                </div>
              );
            })}
          </div>
        </div>
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
          <h3>Pending Leave Requests</h3>
          <span className="results-inline">{pending.length} awaiting review</span>
        </div>
        <RequestTable
          requests={pending}
          onView={actions.openDetails}
          showEmployee
          showReason
          emptyTitle="No pending requests"
          emptyMessage="All leave requests have been reviewed. New requests will appear here."
          renderActions={(row) => (
            <div className="table-actions">
              <button className="btn btn-ghost btn-xs" onClick={() => actions.openDetails(row)}>
                <Eye size={13} /> View
              </button>
              <button className="btn btn-success btn-xs" onClick={() => actions.requestAction('approve', row)}>
                <Check size={13} /> Approve
              </button>
              <button className="btn btn-danger btn-xs" onClick={() => actions.requestAction('reject', row)}>
                <X size={13} /> Reject
              </button>
            </div>
          )}
        />
      </section>

      {actions.dialog}
    </div>
  );
}
