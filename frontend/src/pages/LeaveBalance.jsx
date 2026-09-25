import { useEffect, useState } from 'react';
import { getLeaveBalances } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LeaveBalanceCard from '../components/LeaveBalanceCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LeaveBalance() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getLeaveBalances(user.id);
        if (active) setBalances(data);
      } catch (err) {
        if (active) showToast('error', err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user.id, showToast]);

  if (loading) return <LoadingSpinner label="Loading balances..." />;

  const totals = balances.reduce(
    (acc, b) => ({
      total: acc.total + b.totalDays,
      used: acc.used + b.usedDays,
      available: acc.available + b.availableDays,
    }),
    { total: 0, used: 0, available: 0 }
  );
  const utilization = totals.total ? Math.round((totals.used / totals.total) * 100) : 0;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Leave Balance</h2>
          <p>Your current entitlement, usage and availability per leave type.</p>
        </div>
      </div>

      <section className="grid grid-3">
        {balances.map((balance) => (
          <LeaveBalanceCard key={balance.leaveType} balance={balance} />
        ))}
      </section>

      <section className="card">
        <div className="card-head">
          <h3>Leave Balance Summary</h3>
          <span className="soft-pill">Plan Year 2026</span>
        </div>
        <div className="summary-stats">
          <div className="summary-stat"><span>Total Allocation</span><strong>{totals.total} days</strong></div>
          <div className="summary-stat"><span>Days Used</span><strong>{totals.used} days</strong></div>
          <div className="summary-stat"><span>Days Available</span><strong>{totals.available} days</strong></div>
          <div className="summary-stat"><span>Utilization</span><strong>{utilization}%</strong></div>
        </div>
        <div className="summary-bar">
          <div className="summary-bar-label">
            <span>Overall Utilization</span>
            <span>{totals.used} of {totals.total} days used</span>
          </div>
          <div className="progress-track lg">
            <div className="progress-fill" style={{ width: `${utilization}%` }} />
          </div>
        </div>
      </section>
    </div>
  );
}
