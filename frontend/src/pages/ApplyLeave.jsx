import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays, CheckCircle2, ClipboardList, Info, RotateCcw, Send, ShieldCheck, Wallet,
} from 'lucide-react';
import { createLeaveRequest, getLeaveBalances, getLeaveTypes } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { calcDaysBetween, formatDate } from '../utils/helpers';

const EMPTY_FORM = { leaveType: '', fromDate: '', toDate: '', reason: '' };

export default function ApplyLeave() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [types, bals] = await Promise.all([getLeaveTypes(), getLeaveBalances(user.id)]);
        if (!active) return;
        setLeaveTypes(types);
        setBalances(bals);
      } catch (err) {
        if (active) showToast('error', err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user.id, showToast]);

  const selectedBalance = balances.find((b) => b.leaveType === form.leaveType) || null;
  const days = useMemo(() => calcDaysBetween(form.fromDate, form.toDate), [form.fromDate, form.toDate]);

  const setField = (field, value) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      // Keep the range consistent when the from date moves past the to date
      if (field === 'fromDate' && next.toDate && next.toDate < value) next.toDate = '';
      return next;
    });
    setErrors((e) => ({ ...e, [field]: undefined, days: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.leaveType) next.leaveType = 'Please select a leave type.';
    if (!form.fromDate) next.fromDate = 'From date is required.';
    if (!form.toDate) next.toDate = 'To date is required.';
    if (form.fromDate && form.toDate && form.toDate < form.fromDate) {
      next.toDate = 'To date cannot be before the from date.';
    }
    const calculated = calcDaysBetween(form.fromDate, form.toDate);
    if (form.fromDate && form.toDate && form.toDate >= form.fromDate && calculated <= 0) {
      next.days = 'Number of days must be greater than 0.';
    }
    if (selectedBalance && calculated > selectedBalance.availableDays) {
      next.days = `Requested ${calculated} days exceeds the available balance of ${selectedBalance.availableDays} days.`;
    }
    if (!form.reason.trim()) next.reason = 'Please provide a reason for your leave.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const created = await createLeaveRequest({
        employeeId: user.id,
        leaveType: form.leaveType,
        fromDate: form.fromDate,
        toDate: form.toDate,
        reason: form.reason,
      });
      setSuccess(created);
      setForm(EMPTY_FORM);
      setErrors({});
      setBalances(await getLeaveBalances(user.id)); // refresh balances
      showToast('success', 'Leave request submitted successfully.');
    } catch (err) {
      showToast('error', err.message);
      setErrors((prev) => ({ ...prev, days: err.message }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
  };

  if (loading) return <LoadingSpinner label="Loading form..." />;

  return (
    <div className="page">
      {success ? (
        <div className="card success-card">
          <span className="success-icon"><CheckCircle2 size={30} /></span>
          <h2>Leave request submitted successfully.</h2>
          <p>Your request has been sent to your manager for approval.</p>
          <div className="success-summary">
            <div><span>Request ID</span><strong>{success.id}</strong></div>
            <div><span>Status</span><strong><StatusBadge status={success.status} /></strong></div>
            <div><span>Leave Type</span><strong>{success.leaveTypeName} ({success.leaveType})</strong></div>
            <div>
              <span>Duration</span>
              <strong>{success.days} day{success.days === 1 ? '' : 's'} - {formatDate(success.fromDate)} to {formatDate(success.toDate)}</strong>
            </div>
          </div>
          <div className="success-actions">
            <button className="btn btn-secondary" onClick={() => setSuccess(null)}>
              <RotateCcw size={16} /> Apply Another
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/employee/requests')}>
              <ClipboardList size={16} /> View My Requests
            </button>
          </div>
        </div>
      ) : (
        <div className="apply-layout">
          <div className="card form-card">
            <h2>Apply for Leave</h2>
            <p>Fill in the details below - your manager will review this request.</p>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="employeeId">Employee ID</label>
                <input id="employeeId" type="text" value={user.id} readOnly />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="leaveType">Leave Type</label>
                  <select
                    id="leaveType"
                    value={form.leaveType}
                    onChange={(e) => setField('leaveType', e.target.value)}
                    className={errors.leaveType ? 'invalid' : ''}
                  >
                    <option value="">Select leave type</option>
                    {leaveTypes.map((t) => (
                      <option key={t.code} value={t.code}>{t.name} ({t.code})</option>
                    ))}
                  </select>
                  {errors.leaveType && <p className="field-error">{errors.leaveType}</p>}
                </div>
                <div className="form-group">
                  <label>Number of Days</label>
                  <div className="days-display">
                    <CalendarDays size={16} />
                    {days > 0
                      ? `${days} day${days === 1 ? '' : 's'} (both dates inclusive)`
                      : 'Select from and to dates'}
                  </div>
                  {errors.days && <p className="field-error">{errors.days}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fromDate">From Date</label>
                  <input
                    id="fromDate"
                    type="date"
                    value={form.fromDate}
                    onChange={(e) => setField('fromDate', e.target.value)}
                    className={errors.fromDate ? 'invalid' : ''}
                  />
                  {errors.fromDate && <p className="field-error">{errors.fromDate}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="toDate">To Date</label>
                  <input
                    id="toDate"
                    type="date"
                    value={form.toDate}
                    min={form.fromDate || undefined}
                    onChange={(e) => setField('toDate', e.target.value)}
                    className={errors.toDate ? 'invalid' : ''}
                  />
                  {errors.toDate && <p className="field-error">{errors.toDate}</p>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reason">Reason</label>
                <textarea
                  id="reason"
                  placeholder="Briefly describe the reason for your leave..."
                  value={form.reason}
                  onChange={(e) => setField('reason', e.target.value)}
                  className={errors.reason ? 'invalid' : ''}
                />
                {errors.reason && <p className="field-error">{errors.reason}</p>}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <span className="spinner spinner-sm light" /> : <Send size={16} />}
                  {submitting ? 'Submitting...' : 'Submit Leave Request'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={submitting}>
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <aside className="apply-side">
            <div className="card side-card">
              <h3><Wallet size={16} /> Current Balance</h3>
              {leaveTypes.map((type) => {
                const balance = balances.find((b) => b.leaveType === type.code);
                const active = form.leaveType === type.code;
                return (
                  <div key={type.code} className={`side-balance ${active ? 'active' : ''}`}>
                    <div>
                      <span className="leave-chip sm" style={{ background: type.soft, color: type.color }}>
                        {type.code}
                      </span>
                      <span>{type.name}</span>
                    </div>
                    <strong>{balance ? `${balance.availableDays} days` : '-'}</strong>
                  </div>
                );
              })}
              {selectedBalance && (
                <div className="balance-note">
                  <Info size={14} />
                  <span>
                    {selectedBalance.leaveTypeName} balance: <strong>{selectedBalance.availableDays} days available</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="card side-card">
              <h3><ShieldCheck size={16} /> Guidelines</h3>
              <ul className="guidelines">
                <li>Dates are inclusive - the number of days is calculated automatically.</li>
                <li>To Date cannot be earlier than From Date.</li>
                <li>Requested days cannot exceed your available balance.</li>
                <li>Your manager will review and approve or reject the request.</li>
              </ul>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
