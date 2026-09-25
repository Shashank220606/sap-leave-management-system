import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { getAllLeaveBalances, getAllLeaveRequests, getLeaveTypes } from '../services/api';
import { useToast } from '../context/ToastContext';
import RequestFilters from '../components/RequestFilters';
import RequestTable from '../components/RequestTable';
import LoadingSpinner from '../components/LoadingSpinner';
import useRequestActions from '../hooks/useRequestActions';
import { matchesRequestFilters } from '../utils/helpers';

const DEFAULT_FILTERS = { search: '', leaveType: 'ALL', status: 'ALL', from: '', to: '' };

export default function AllRequests() {
  const { showToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [balancesMap, setBalancesMap] = useState({});
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [reqs, balances, types] = await Promise.all([
        getAllLeaveRequests(),
        getAllLeaveBalances(),
        getLeaveTypes(),
      ]);
      setRequests(reqs);
      setBalancesMap(Object.fromEntries(balances.map((b) => [`${b.employeeId}-${b.leaveType}`, b.availableDays])));
      setLeaveTypes(types);
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

  if (loading) return <LoadingSpinner label="Loading all requests..." />;

  const filtered = requests.filter((r) => matchesRequestFilters(r, filters));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>All Requests</h2>
          <p>Every leave request submitted to your team, across all employees.</p>
        </div>
      </div>

      <RequestFilters
        filters={filters}
        onChange={setFilters}
        leaveTypes={leaveTypes}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      <section className="card">
        <div className="card-head">
          <h3>Leave Requests</h3>
          <span className="results-inline">Showing {filtered.length} of {requests.length} requests</span>
        </div>
        <RequestTable
          requests={filtered}
          onView={actions.openDetails}
          showEmployee
          showReason
          showManager
          showBalanceUpdated
          emptyTitle="No matching requests"
          emptyMessage="No leave requests match the current filters. Try resetting them."
          renderActions={(row) =>
            row.status === 'PENDING' ? (
              <div className="table-actions">
                <button className="btn btn-ghost btn-xs" onClick={() => actions.openDetails(row)}>
                  <Eye size={13} /> View
                </button>
                <button className="btn btn-success btn-xs" onClick={() => actions.requestAction('approve', row)}>
                  Approve
                </button>
                <button className="btn btn-danger btn-xs" onClick={() => actions.requestAction('reject', row)}>
                  Reject
                </button>
              </div>
            ) : (
              <span className="results-inline">-</span>
            )
          }
        />
      </section>

      {actions.dialog}
    </div>
  );
}
