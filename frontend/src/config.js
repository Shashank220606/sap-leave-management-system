// ---------------------------------------------------------------------------
// Central application configuration.
//
// When the SAP BTP ABAP Cloud OData service is ready:
//   1. Set `baseURL` to the OData service root (no credentials here -
//      authentication will be handled by the BTP app router / XSUAA).
//   2. Flip `useMockData` to false.
//   3. Implement the fetch calls in src/services/api.js (function by function).
// No component or page needs to change.
// ---------------------------------------------------------------------------

export const API_CONFIG = {
  useMockData: false,

  baseURL:
    "https://a4796127-12c7-4a21-ae82-e3ced4ab9c3d.abap-web.us10.hana.ondemand.com/sap/opu/odata4/sap/zui_lm_leave_o4/srvd/sap/zui_lm_leave/0001/",

  mockDelayMs: 300,
};

// OData entity set names matching the future ABAP Cloud service (ZLM_* tables)
export const ODATA_ENDPOINTS = {
  employees: '/Employees',        // ZLM_EMPLOYEE
  leaveTypes: '/LeaveTypes',      // ZLM_LEAVE_TYPE
  leaveBalances: '/LeaveBalances',// ZLM_LEAVE_BAL
  leaveRequests: '/LeaveRequests',// ZLM_LEAVE_REQ
};

