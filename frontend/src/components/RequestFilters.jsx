import { RotateCcw, Search } from 'lucide-react';

export default function RequestFilters({ filters, onChange, leaveTypes, showStatus = true, showDates = true, onReset }) {
  const set = (field, value) => onChange({ ...filters, [field]: value });

  return (
    <div className="card filters-card">
      <div className="filters-row">
        <div className="filter-field grow">
          <label htmlFor="filter-search">Search</label>
          <div className="input-wrap">
            <Search size={15} className="input-icon" />
            <input
              id="filter-search"
              type="text"
              placeholder="Search by ID, reason, employee or status..."
              value={filters.search}
              onChange={(e) => set('search', e.target.value)}
            />
          </div>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-type">Leave Type</label>
          <select id="filter-type" value={filters.leaveType} onChange={(e) => set('leaveType', e.target.value)}>
            <option value="ALL">All Types</option>
            {leaveTypes.map((t) => (
              <option key={t.code} value={t.code}>{t.name}</option>
            ))}
          </select>
        </div>
        {showStatus && (
          <div className="filter-field">
            <label htmlFor="filter-status">Status</label>
            <select id="filter-status" value={filters.status} onChange={(e) => set('status', e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        )}
        {showDates && (
          <>
            <div className="filter-field">
              <label htmlFor="filter-from">Date From</label>
              <input id="filter-from" type="date" value={filters.from} onChange={(e) => set('from', e.target.value)} />
            </div>
            <div className="filter-field">
              <label htmlFor="filter-to">Date To</label>
              <input id="filter-to" type="date" value={filters.to} onChange={(e) => set('to', e.target.value)} />
            </div>
          </>
        )}
        <button className="btn btn-secondary filter-reset" onClick={onReset}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>
    </div>
  );
}
