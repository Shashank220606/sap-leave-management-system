// Shared approve/reject workflow (details modal + confirmation dialog) so the
// three manager pages don't duplicate the same logic.
import { useState } from 'react';
import { approveLeaveRequest, rejectLeaveRequest } from '../services/api';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';
import RequestDetails from '../components/RequestDetails';

export default function useRequestActions({ balancesMap = {}, onChanged }) {
  const [detailsRequest, setDetailsRequest] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  const openDetails = (request) => setDetailsRequest(request);
  const requestAction = (type, request) => setConfirmAction({ type, request });

  const executeConfirm = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      const updated =
        confirmAction.type === 'approve'
          ? await approveLeaveRequest(confirmAction.request.id)
          : await rejectLeaveRequest(confirmAction.request.id);
      showToast('success', `${updated.id} has been ${updated.status.toLowerCase()} successfully.`);
      setDetailsRequest((prev) => (prev && prev.id === updated.id ? { ...prev, ...updated } : prev));
      setConfirmAction(null);
      onChanged?.();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const isApprove = confirmAction?.type === 'approve';

  const dialog = (
    <>
      <RequestDetails
        request={detailsRequest}
        availableBalance={detailsRequest ? balancesMap[`${detailsRequest.employeeId}-${detailsRequest.leaveType}`] : undefined}
        onClose={() => setDetailsRequest(null)}
        showActions
        onApprove={(request) => requestAction('approve', request)}
        onReject={(request) => requestAction('reject', request)}
      />
      <ConfirmDialog
        open={!!confirmAction}
        tone={isApprove ? 'success' : 'danger'}
        title={isApprove ? 'Approve Leave Request' : 'Reject Leave Request'}
        message={
          isApprove
            ? "Are you sure you want to approve this leave request? The requested days will be deducted from the employee's balance."
            : "Are you sure you want to reject this leave request? No balance changes will be made."
        }
        confirmLabel={isApprove ? 'Approve' : 'Reject'}
        loading={actionLoading}
        onConfirm={executeConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );

  return { openDetails, requestAction, dialog };
}
