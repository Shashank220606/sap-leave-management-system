const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// '2026-09-25' -> '25-09-2026'
export function formatDate(iso) {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

// '2026-09-25' -> '25 Sep 2026' (manual formatting avoids timezone shifts)
export function formatDateLong(iso) {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-');
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}

// Inclusive day count between two ISO dates; 0 when the range is invalid.
export function calcDaysBetween(fromDate, toDate) {
  if (!fromDate || !toDate) return 0;
  const diff = Math.floor((new Date(toDate) - new Date(fromDate)) / 86400000) + 1;
  return diff > 0 ? diff : 0;
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

export function getInitials(name = '') {
  return name.split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function getStats(requests = []) {
  const stats = { total: requests.length, pending: 0, approved: 0, rejected: 0 };
  requests.forEach((r) => {
    if (r.status === 'PENDING') stats.pending += 1;
    else if (r.status === 'APPROVED') stats.approved += 1;
    else if (r.status === 'REJECTED') stats.rejected += 1;
  });
  return stats;
}

// Shared client-side filter logic for request tables
export function matchesRequestFilters(request, filters) {
  const q = (filters.search || '').trim().toLowerCase();
  if (q) {
    const haystack = [request.id, request.employeeId, request.employeeName, request.department, request.reason, request.leaveType, request.leaveTypeName, request.status]
      .map((v) => String(v || '').toLowerCase());
    if (!haystack.some((v) => v.includes(q))) return false;
  }
  if (filters.leaveType && filters.leaveType !== 'ALL' && request.leaveType !== filters.leaveType) return false;
  if (filters.status && filters.status !== 'ALL' && request.status !== filters.status) return false;
  if (filters.from && request.fromDate < filters.from) return false;
  if (filters.to && request.fromDate > filters.to) return false;
  return true;
}
