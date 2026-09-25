import { useEffect } from 'react';
import { X } from 'lucide-react';

// Tracks how many modals are open so stacked modals (details + confirm)
// don't unlock page scroll prematurely.
let openModals = 0;

export default function Modal({ open, onClose, title, children, footer, width = 640, dismissable = true }) {
  useEffect(() => {
    if (!open) return undefined;
    openModals += 1;
    document.body.style.overflow = 'hidden';
    return () => {
      openModals -= 1;
      if (openModals === 0) document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open || !dismissable) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, dismissable, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onMouseDown={dismissable ? (e) => { if (e.target === e.currentTarget) onClose?.(); } : undefined}
    >
      <div className="modal" style={{ maxWidth: width }} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h3>{title}</h3>
          {dismissable && (
            <button className="icon-btn" onClick={onClose} aria-label="Close dialog">
              <X size={18} />
            </button>
          )}
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
