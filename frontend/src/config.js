// Central frontend configuration.
// Keep credentials out of the browser. SAP authentication belongs in the
// backend/app-router layer, not in React components.

const env = import.meta.env;

export const API_CONFIG = {
  // Demo mode is the safe default for a fresh clone.
  useMockData: env.VITE_USE_MOCK_DATA !== 'false',
  baseURL: env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  mockDelayMs: Number(env.VITE_MOCK_DELAY_MS || 300),
};

export const ODATA_ENDPOINTS = {
  employees: '/Employees',
  leaveTypes: '/LeaveTypes',
  leaveBalances: '/LeaveBalances',
  leaveRequests: '/LeaveRequests',
};
