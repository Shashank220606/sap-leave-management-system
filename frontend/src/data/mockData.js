// ---------------------------------------------------------------------------
// Mock data - mirrors the SAP tables that will back the real OData service:
//   ZLM_EMPLOYEE, ZLM_LEAVE_TYPE, ZLM_LEAVE_BAL, ZLM_LEAVE_REQ
// ---------------------------------------------------------------------------

export const employees = [
  { id: 'EMP001', name: 'Rahul Kumar', department: 'IT', designation: 'Software Engineer', role: 'Employee', email: 'rahul.kumar@company.com', joinDate: '2023-03-15', managerId: 'MGR001' },
  { id: 'EMP002', name: 'Priya Sharma', department: 'HR', designation: 'HR Executive', role: 'Employee', email: 'priya.sharma@company.com', joinDate: '2022-11-01', managerId: 'MGR001' },
  { id: 'MGR001', name: 'Arjun Rao', department: 'IT', designation: 'IT Manager', role: 'Manager', email: 'arjun.rao@company.com', joinDate: '2018-06-20', managerId: null },
];

export const leaveTypes = [
  { code: 'CL', name: 'Casual Leave', totalDays: 12, color: '#2563eb', soft: '#e8effd' },
  { code: 'SL', name: 'Sick Leave', totalDays: 10, color: '#0d9488', soft: '#e0f4f1' },
  { code: 'EL', name: 'Earned Leave', totalDays: 15, color: '#7c3aed', soft: '#f1eafd' },
];

export const leaveBalances = [
  // EMP001: REQ003 (CL, 2 days) already approved -> 2 days used
  { employeeId: 'EMP001', leaveType: 'CL', totalDays: 12, usedDays: 2 },
  { employeeId: 'EMP001', leaveType: 'SL', totalDays: 10, usedDays: 0 },
  { employeeId: 'EMP001', leaveType: 'EL', totalDays: 15, usedDays: 0 },
  // EMP002: REQ001 (SL, 1 day) approved; REQ002 (CL) rejected -> no usage
  { employeeId: 'EMP002', leaveType: 'CL', totalDays: 12, usedDays: 0 },
  { employeeId: 'EMP002', leaveType: 'SL', totalDays: 10, usedDays: 1 },
  { employeeId: 'EMP002', leaveType: 'EL', totalDays: 15, usedDays: 0 },
];

export const leaveRequests = [
  { id: 'REQ001', employeeId: 'EMP002', leaveType: 'SL', fromDate: '2026-08-10', toDate: '2026-08-11', days: 1, reason: 'Fever and cold', status: 'APPROVED', managerId: 'MGR001', balanceUpdated: true, appliedOn: '2026-08-05', decidedOn: '2026-08-06' },
  { id: 'REQ002', employeeId: 'EMP002', leaveType: 'CL', fromDate: '2026-09-05', toDate: '2026-09-06', days: 2, reason: 'Family function at hometown', status: 'REJECTED', managerId: 'MGR001', balanceUpdated: false, appliedOn: '2026-09-01', decidedOn: '2026-09-02' },
  { id: 'REQ003', employeeId: 'EMP001', leaveType: 'CL', fromDate: '2026-09-25', toDate: '2026-09-26', days: 2, reason: 'Personal work', status: 'APPROVED', managerId: 'MGR001', balanceUpdated: true, appliedOn: '2026-09-18', decidedOn: '2026-09-19' },
  { id: 'REQ004', employeeId: 'EMP001', leaveType: 'SL', fromDate: '2026-09-27', toDate: '2026-09-28', days: 2, reason: 'Food poisoning, advised rest', status: 'REJECTED', managerId: 'MGR001', balanceUpdated: false, appliedOn: '2026-09-22', decidedOn: '2026-09-23' },
  { id: 'REQ005', employeeId: 'EMP001', leaveType: 'EL', fromDate: '2026-10-01', toDate: '2026-10-03', days: 3, reason: 'Vacation with family', status: 'PENDING', managerId: 'MGR001', balanceUpdated: false, appliedOn: '2026-09-24', decidedOn: null },
];

// Mock authentication accounts - replaced by SAP IAS / XSUAA later.
export const demoCredentials = [
  { employeeId: 'EMP001', password: 'employee123', role: 'Employee', label: 'Employee' },
  { employeeId: 'MGR001', password: 'manager123', role: 'Manager', label: 'Manager' },
];
