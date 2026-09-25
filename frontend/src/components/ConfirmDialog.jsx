import Modal from './Modal';
import { AlertTriangle, Check } from 'lucide-react';

export default function ConfirmDialog({
  open,
  tone = 'success',
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}) {
  const Icon = tone === 'danger' ? AlertTriangle : Check;

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      width={440}
      dismissable={false}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button className={`btn ${tone === 'danger' ? 'btn-danger' : 'btn-success'}`} onClick={onConfirm} disabled={loading}>
            {loading ? <span className="spinner spinner-sm light" /> : <Icon size={16} />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="confirm-body">
        <div className={`confirm-icon tone-${tone === 'danger' ? 'danger' : 'success'}`}>
          <Icon size={22} />
        </div>
        <p className="confirm-message">{message}</p>
      </div>
    </Modal>
  );
}
