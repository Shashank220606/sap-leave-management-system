import { ClipboardList } from 'lucide-react';
import EmptyState from './EmptyState';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/helpers';

export default function RequestTable({
  requests,
  onView,
  showEmployee = false,
  showEmployeeId = false,
  showReason = false,
  showManager = false,
  showBalanceUpdated = false,
  renderActions = null,
  emptyTitle = 'No requests found',
  emptyMessage = 'Try adjusting the filters to find what you are looking for.',
}) {
  if (!requests.length) {
    return <EmptyState icon={ClipboardList} title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Request ID</th>
            {showEmployee && <th>Employee</th>}
            {showEmployeeId && <th>Employee ID</th>}
            <th>Leave Type</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Days</th>
            {showReason && <th>Reason</th>}
            <th>Status</th>
            {showManager && <th>Manager</th>}
            {showBalanceUpdated && <th>Balance Updated</th>}
            {renderActions && <th className="th-actions">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map((row) => (
            <tr
              key={row.id}
              className={onView ? 'row-clickable' : ''}
              onClick={onView ? () => onView(row) : undefined}
            >
              <td><span className="req-id">{row.id}</span></td>
              {showEmployee && (
                <td>
                  <span className="cell-employee-name">{row.employeeName}</span>
                  <span className="cell-employee-sub">{row.employeeId} - {row.department}</span>
                </td>
              )}
              {showEmployeeId && <td><span className="muted-id">{row.employeeId}</span></td>}
              <td>
                <span className="leave-chip sm" style={{ background: row.typeSoft, color: row.typeColor }} title={row.leaveTypeName}>
                  {row.leaveType}
                </span>
              </td>
              <td>{formatDate(row.fromDate)}</td>
              <td>{formatDate(row.toDate)}</td>
              <td>{row.days}</td>
              {showReason && <td className="td-reason" title={row.reason}>{row.reason}</td>}
              <td><StatusBadge status={row.status} /></td>
              {showManager && <td>{row.managerId}</td>}
              {showBalanceUpdated && (
                <td>
                  <span className={`pill ${row.balanceUpdated ? 'pill-yes' : 'pill-no'}`}>
                    {row.balanceUpdated ? 'YES' : 'NO'}
                  </span>
                </td>
              )}
              {renderActions && (
                <td className="td-actions" onClick={(e) => e.stopPropagation()}>
                  {renderActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
