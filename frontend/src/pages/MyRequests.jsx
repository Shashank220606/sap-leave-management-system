import { useEffect, useMemo, useState } from 'react';
import { getLeaveBalances, getLeaveRequests, getLeaveTypes } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RequestDetails from '../components/RequestDetails';
import RequestFilters from '../components/RequestFilters';
import RequestTable from '../components/RequestTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { matchesRequestFilters } from '../utils/helpers';

const DEFAULT_FILTERS = { search: '', leaveType: 'ALL', status: 'ALL', from: '', to: '' };

export default function MyRequests() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [balances, setBalances] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [detailsRequest, setDetailsRequest] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [reqs, bals, types] = await Promise.all([
          getLeaveRequests(user.id),
          getLeaveBalances(user.id),
          getLeaveTypes(),
        ]);
        if (!active) return;
        setRequests(reqs);
        setBalances(bals);
        setLeaveTypes(types);
      } catch (err) {
        if (active) showToast('error', err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user.id, showToast]);

  const filtered = useMemo(
    () => requests.filter((r) => matchesRequestFilters(r, filters)),
    [requests, filters]
  );

  if (loading) return <LoadingSpinner label="Loading your requests..." />;

  const balanceMap = Object.fromEntries(balances.map((b) => [b.leaveType, b.availableDays]));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>My Requests</h2>
          <p>Complete history of your leave requests.</p>
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
          <h3>Leave History</h3>
          <span className="results-inline">Showing {filtered.length} of {requests.length} requests</span>
        </div>
        <RequestTable
          requests={filtered}
          onView={setDetailsRequest}
          showEmployeeId
          showReason
          showManager
          showBalanceUpdated
          emptyTitle="No matching requests"
          emptyMessage="No leave requests match the current filters. Try resetting them."
        />
      </section>

      <RequestDetails
        request={detailsRequest}
        availableBalance={detailsRequest ? balanceMap[detailsRequest.leaveType] : undefined}
        onClose={() => setDetailsRequest(null)}
      />
    </div>
  );
}
