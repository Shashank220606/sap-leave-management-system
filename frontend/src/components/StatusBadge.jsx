const LABELS = { PENDING: 'Pending', APPROVED: 'Approved', REJECTED: 'Rejected' };

export default function StatusBadge({ status }) {
  const key = (status || '').toUpperCase();
  return (
    <span className={`badge badge-${key.toLowerCase()}`}>
      <span className="badge-dot" />
      {LABELS[key] || status}
    </span>
  );
}
