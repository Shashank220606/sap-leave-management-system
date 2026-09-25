import { useEffect, useState } from 'react';
import { Check, Eye, X } from 'lucide-react';
import { getAllLeaveBalances, getAllLeaveRequests, getLeaveTypes } from '../services/api';
import { useToast } from '../context/ToastContext';
import RequestFilters from '../components/RequestFilters';
import RequestTable from '../components/RequestTable';
import LoadingSpinner from '../components/LoadingSpinner';
import useRequestActions from '../hooks/useRequestActions';
import { matchesRequestFilters } from '../utils/helpers';

const DEFAULT_FILTERS = { search: '', leaveType: 'ALL', status: 'ALL', from: '', to: '' };

export default function PendingRequests() {
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

  if (loading) return <LoadingSpinner label="Loading pending requests..." />;

  const pending = requests.filter((r) => r.status === 'PENDING' && matchesRequestFilters(r, filters));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Pending Requests</h2>
          <p>Leave requests waiting for your decision.</p>
        </div>
      </div>

      <RequestFilters
        filters={filters}
        onChange={setFilters}
        leaveTypes={leaveTypes}
        showStatus={false}
        showDates={false}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

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
          emptyTitle="No pending requests found"
          emptyMessage="Adjust the filters or check back later - new requests will appear here."
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
