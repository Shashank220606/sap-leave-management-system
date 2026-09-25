import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, FileText, XCircle } from 'lucide-react';
import { getAllLeaveRequests, getLeaveRequests, getLeaveTypes } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BarChart, DonutChart } from '../components/Charts';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getStats } from '../utils/helpers';

const STATUS_COLORS = { APPROVED: '#16a34a', PENDING: '#d97706', REJECTED: '#dc2626' };

export default function Reports() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isManager = user?.role === 'Manager';

  const [requests, setRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [reqs, types] = await Promise.all([
          isManager ? getAllLeaveRequests() : getLeaveRequests(user.id),
          getLeaveTypes(),
        ]);
        if (!active) return;
        setRequests(reqs);
        setLeaveTypes(types);
      } catch (err) {
        if (active) showToast('error', err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [isManager, user?.id, showToast]);

  if (loading) return <LoadingSpinner label="Loading reports..." />;

  const stats = getStats(requests);
  const statusData = [
    { label: 'Approved', value: stats.approved, color: STATUS_COLORS.APPROVED },
    { label: 'Pending', value: stats.pending, color: STATUS_COLORS.PENDING },
    { label: 'Rejected', value: stats.rejected, color: STATUS_COLORS.REJECTED },
  ];
  const usageData = leaveTypes.map((type) => {
    const rows = requests.filter((r) => r.leaveType === type.code);
    return {
      label: type.name,
      value: rows.reduce((sum, r) => sum + r.days, 0),
      sub: `${rows.length} request${rows.length === 1 ? '' : 's'}`,
      color: type.color,
    };
  });

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Reports</h2>
          <p>{isManager ? 'Leave activity across the organization.' : 'A summary of your personal leave activity.'}</p>
        </div>
      </div>

      <div className="grid grid-4">
        <StatCard icon={FileText} label="Total Requests" value={stats.total} tone="blue" />
        <StatCard icon={CheckCircle2} label="Approved" value={stats.approved} tone="green" />
        <StatCard icon={Clock} label="Pending" value={stats.pending} tone="amber" />
        <StatCard icon={XCircle} label="Rejected" value={stats.rejected} tone="red" />
      </div>

      <div className="charts-grid">
        <section className="card">
          <div className="card-head"><h3>Requests by Status</h3></div>
          <div className="chart-body">
            <DonutChart data={statusData} centerTitle="Requests" />
          </div>
        </section>
        <section className="card">
          <div className="card-head"><h3>Leave Days by Type</h3></div>
          <div className="chart-body">
            <BarChart data={usageData} />
            <p className="chart-note">Total number of leave days requested per leave type (all statuses).</p>
          </div>
        </section>
      </div>
    </div>
  );
}
