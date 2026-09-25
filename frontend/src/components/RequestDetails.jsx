import Modal from './Modal';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/helpers';

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );
}

export default function RequestDetails({
  request,
  availableBalance,
  onClose,
  showActions = false,
  actionLoading = false,
  onApprove,
  onReject,
}) {
  if (!request) return null;
  const isPending = request.status === 'PENDING';

  return (
    <Modal
      open={!!request}
      onClose={onClose}
      title={`Request ${request.id}`}
      width={680}
      footer={
        showActions && isPending ? (
          <div className="detail-actions">
            <button className="btn btn-danger-outline" onClick={() => onReject?.(request)} disabled={actionLoading}>
              Reject
            </button>
            <button className="btn btn-success" onClick={() => onApprove?.(request)} disabled={actionLoading}>
              Approve
            </button>
          </div>
        ) : null
      }
    >
      <div className="detail-status-row">
        <StatusBadge status={request.status} />
        <span className="detail-applied">Applied on {formatDate(request.appliedOn)}</span>
      </div>

      <div className="detail-grid">
        <section className="detail-section">
          <h4>Employee Information</h4>
          <DetailRow label="Employee ID" value={request.employeeId} />
          <DetailRow label="Name" value={request.employeeName} />
          <DetailRow label="Department" value={request.department} />
          <DetailRow label="Designation" value={request.designation} />
        </section>
        <section className="detail-section">
          <h4>Leave Information</h4>
          <DetailRow label="Leave Type" value={`${request.leaveType} - ${request.leaveTypeName}`} />
          <DetailRow label="From Date" value={formatDate(request.fromDate)} />
          <DetailRow label="To Date" value={formatDate(request.toDate)} />
          <DetailRow label="Number of Days" value={`${request.days} day${request.days === 1 ? '' : 's'}`} />
          {availableBalance !== undefined && (
            <DetailRow label="Available Balance" value={`${availableBalance} day${availableBalance === 1 ? '' : 's'}`} />
          )}
          {request.decidedOn && <DetailRow label="Decision Date" value={formatDate(request.decidedOn)} />}
          <DetailRow label="Manager" value={request.managerId} />
        </section>
      </div>

      <div className="detail-reason">
        <h4>Reason</h4>
        <p>{request.reason}</p>
      </div>
    </Modal>
  );
}
