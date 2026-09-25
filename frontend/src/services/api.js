// ---------------------------------------------------------------------------
// SAP Leave Management - API Service
//
// React Component
//      ↓
// services/api.js
//      ↓
// SAP BTP ABAP Cloud OData
//      ↓
// ZLM_* tables
//
// When useMockData = true:
//     Uses local mock data.
//
// When useMockData = false:
//     Reads Leave Requests from SAP OData.
//
// IMPORTANT:
// SAP write operations (Create / Approve / Reject) will be connected after
// the corresponding RAP/OData actions are created in the SAP backend.
// ---------------------------------------------------------------------------

import { API_CONFIG } from '../config';

import {
  employees as seedEmployees,
  leaveTypes as seedLeaveTypes,
  leaveBalances as seedBalances,
  leaveRequests as seedRequests,
  demoCredentials,
} from '../data/mockData';

import { calcDaysBetween, todayISO } from '../utils/helpers';


// ---------------------------------------------------------------------------
// Error class
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ApiError';
  }
}


// ---------------------------------------------------------------------------
// Mock delay
// ---------------------------------------------------------------------------

const delay = (ms = API_CONFIG.mockDelayMs) =>
  new Promise((resolve) => setTimeout(resolve, ms));


// ---------------------------------------------------------------------------
// OData configuration
// ---------------------------------------------------------------------------

const ODATA_ENDPOINTS = {
  leaveRequests: 'LeaveRequests',
};


// ---------------------------------------------------------------------------
// SAP OData fetch helper
// ---------------------------------------------------------------------------

const fetchOData = async (endpoint) => {
  try {
    const url = `${API_CONFIG.baseURL}${endpoint}?sap-client=100`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new ApiError(
        `SAP OData request failed: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      `Unable to connect to SAP OData service: ${error.message}`
    );
  }
};


// ---------------------------------------------------------------------------
// Mock database
// ---------------------------------------------------------------------------

function createMockDb() {
  return {
    employees: seedEmployees.map((e) => ({ ...e })),

    leaveTypes: seedLeaveTypes.map((t) => ({ ...t })),

    leaveBalances: seedBalances.map((b) => ({ ...b })),

    leaveRequests: seedRequests.map((r) => ({ ...r })),
  };
}

let db = createMockDb();


// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

const findLeaveType = (code) =>
  db.leaveTypes.find((type) => type.code === code);


// Join request data with employee, manager and leave-type information.
function enrichRequest(request) {
  const employee = db.employees.find(
    (employee) => employee.id === request.employeeId
  );

  const manager = db.employees.find(
    (employee) => employee.id === request.managerId
  );

  const type = findLeaveType(request.leaveType);

  return {
    ...request,

    employeeName: employee ? employee.name : 'Unknown',

    department: employee ? employee.department : '-',

    designation: employee ? employee.designation : '-',

    managerName: manager ? manager.name : '-',

    leaveTypeName: type ? type.name : request.leaveType,

    typeColor: type ? type.color : '#2563eb',

    typeSoft: type ? type.soft : '#e8effd',
  };
}


// Sort newest request first.
const sortNewestFirst = (list) =>
  [...list].sort(
    (a, b) =>
      Number(String(b.id).replace('REQ', '')) -
      Number(String(a.id).replace('REQ', ''))
  );


// Convert mock balance to UI format.
function toBalanceView(balance) {
  const type = findLeaveType(balance.leaveType);

  return {
    employeeId: balance.employeeId,

    leaveType: balance.leaveType,

    leaveTypeName: type ? type.name : balance.leaveType,

    color: type ? type.color : '#2563eb',

    soft: type ? type.soft : '#e8effd',

    totalDays: balance.totalDays,

    usedDays: balance.usedDays,

    availableDays: balance.totalDays - balance.usedDays,
  };
}


// ---------------------------------------------------------------------------
// Convert SAP OData request → React request format
// ---------------------------------------------------------------------------

function mapODataRequest(item) {
  const employee = seedEmployees.find(
    (employee) => employee.id === item.EmpId
  );

  const manager = seedEmployees.find(
    (employee) => employee.id === item.ManagerId
  );

  const type = seedLeaveTypes.find(
    (leaveType) => leaveType.code === item.LeaveType
  );

  return {
    id: item.RequestId,

    employeeId: item.EmpId,

    employeeName: employee ? employee.name : 'Unknown',

    department: employee ? employee.department : '-',

    designation: employee ? employee.designation : '-',

    leaveType: item.LeaveType,

    leaveTypeName: type ? type.name : item.LeaveType,

    typeColor: type ? type.color : '#2563eb',

    typeSoft: type ? type.soft : '#e8effd',

    fromDate: item.FromDate,

    toDate: item.ToDate,

    days: item.NoOfDays,

    reason: item.Reason,

    status: item.Status,

    managerId: item.ManagerId,

    managerName: manager ? manager.name : '-',

    balanceUpdated: item.BalanceUpdated === 'X',

    appliedOn: null,

    decidedOn: null,
  };
}


// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------
//
// Authentication is still MOCK for now.
// Later this can be replaced by SAP IAS / XSUAA authentication.
// ---------------------------------------------------------------------------

export async function authenticate(employeeId, password, role) {
  await delay(300);

  const credential = demoCredentials.find(
    (item) =>
      item.employeeId === employeeId &&
      item.password === password
  );

  if (!credential) {
    throw new ApiError('Invalid Employee ID or password.');
  }

  if (credential.role !== role) {
    throw new ApiError(
      `This account is registered as "${credential.role}". Please select the matching role.`
    );
  }

  const employee = db.employees.find(
    (item) => item.id === employeeId
  );

  if (!employee) {
    throw new ApiError('Employee record not found.');
  }

  return {
    id: employee.id,

    name: employee.name,

    role: credential.role,

    department: employee.department,

    designation: employee.designation,
  };
}


export async function getDemoCredentials() {
  await delay(150);

  return demoCredentials.map((credential) => ({
    ...credential,
  }));
}


// ---------------------------------------------------------------------------
// Employees - ZLM_EMPLOYEE
// ---------------------------------------------------------------------------

export async function getEmployees() {
  await delay();

  return db.employees.map((employee) => ({
    ...employee,
  }));
}


export async function getEmployee(employeeId) {
  await delay();

  const employee = db.employees.find(
    (item) => item.id === employeeId
  );

  if (!employee) {
    throw new ApiError(`Employee ${employeeId} not found.`);
  }

  return {
    ...employee,
  };
}


// ---------------------------------------------------------------------------
// Leave Types - ZLM_LEAVE_TYPE
// ---------------------------------------------------------------------------

export async function getLeaveTypes() {
  await delay();

  return db.leaveTypes.map((type) => ({
    ...type,
  }));
}


// ---------------------------------------------------------------------------
// Leave Balances - ZLM_LEAVE_BAL
//
// Still using mock data for now.
// We will connect this to SAP after creating the corresponding CDS/OData
// entity for leave balances.
// ---------------------------------------------------------------------------

export async function getLeaveBalances(employeeId) {
  await delay();

  return db.leaveBalances
    .filter((balance) => balance.employeeId === employeeId)
    .map(toBalanceView);
}


export async function getAllLeaveBalances() {
  await delay();

  return db.leaveBalances.map(toBalanceView);
}


// ---------------------------------------------------------------------------
// Leave Requests - ZLM_LEAVE_REQ
// ---------------------------------------------------------------------------


// Get all leave requests.
//
// IMPORTANT:
// When useMockData = false, this reads REAL DATA from SAP OData.

export async function getAllLeaveRequests() {
  // ---------------------------------------------------------
  // SAP OData
  // ---------------------------------------------------------

  if (!API_CONFIG.useMockData) {
    const payload = await fetchOData(
      ODATA_ENDPOINTS.leaveRequests
    );

    if (!payload || !Array.isArray(payload.value)) {
      throw new ApiError(
        'SAP returned an unexpected OData response.'
      );
    }

    return payload.value.map(mapODataRequest);
  }

  // ---------------------------------------------------------
  // Mock data
  // ---------------------------------------------------------

  await delay();

  return sortNewestFirst(db.leaveRequests).map(enrichRequest);
}


// Get leave requests for a specific employee.

export async function getLeaveRequests(employeeId) {
  // ---------------------------------------------------------
  // SAP OData
  // ---------------------------------------------------------

  if (!API_CONFIG.useMockData) {
    const requests = await getAllLeaveRequests();

    return requests.filter(
      (request) => request.employeeId === employeeId
    );
  }

  // ---------------------------------------------------------
  // Mock data
  // ---------------------------------------------------------

  await delay();

  return sortNewestFirst(
    db.leaveRequests.filter(
      (request) => request.employeeId === employeeId
    )
  ).map(enrichRequest);
}


// Get one specific leave request.

export async function getLeaveRequest(requestId) {
  // ---------------------------------------------------------
  // SAP OData
  // ---------------------------------------------------------

  if (!API_CONFIG.useMockData) {
    const requests = await getAllLeaveRequests();

    const request = requests.find(
      (item) => item.id === requestId
    );

    if (!request) {
      throw new ApiError(
        `Request ${requestId} not found.`
      );
    }

    return request;
  }

  // ---------------------------------------------------------
  // Mock data
  // ---------------------------------------------------------

  await delay();

  const request = db.leaveRequests.find(
    (item) => item.id === requestId
  );

  if (!request) {
    throw new ApiError(
      `Request ${requestId} not found.`
    );
  }

  return enrichRequest(request);
}


// ---------------------------------------------------------------------------
// Create Leave Request
//
// CURRENTLY MOCK ONLY.
//
// SAP create operation will be connected after we create a writable RAP
// business object / OData operation in the ABAP backend.
// ---------------------------------------------------------------------------

export async function createLeaveRequest(data) {
  await delay();

  const employee = db.employees.find(
    (item) => item.id === data.employeeId
  );

  if (!employee) {
    throw new ApiError('Employee record not found.');
  }

  if (!findLeaveType(data.leaveType)) {
    throw new ApiError('Please select a valid leave type.');
  }

  if (!data.fromDate || !data.toDate) {
    throw new ApiError(
      'From date and to date are required.'
    );
  }

  if (!data.reason || !data.reason.trim()) {
    throw new ApiError('A reason is required.');
  }

  const days = calcDaysBetween(
    data.fromDate,
    data.toDate
  );

  if (days <= 0) {
    throw new ApiError(
      'The to date cannot be before the from date.'
    );
  }

  const balance = db.leaveBalances.find(
    (item) =>
      item.employeeId === data.employeeId &&
      item.leaveType === data.leaveType
  );

  const available = balance
    ? balance.totalDays - balance.usedDays
    : 0;

  if (days > available) {
    throw new ApiError(
      `Insufficient balance: ${available} day(s) available, ${days} requested.`
    );
  }

  const nextNumber =
    db.leaveRequests.reduce(
      (max, request) =>
        Math.max(
          max,
          Number(
            String(request.id).replace('REQ', '')
          ) || 0
        ),
      0
    ) + 1;

  const request = {
    id: `REQ${String(nextNumber).padStart(3, '0')}`,

    employeeId: data.employeeId,

    leaveType: data.leaveType,

    fromDate: data.fromDate,

    toDate: data.toDate,

    days,

    reason: data.reason.trim(),

    status: 'PENDING',

    managerId: employee.managerId || 'MGR001',

    balanceUpdated: false,

    appliedOn: todayISO(),

    decidedOn: null,
  };

  db.leaveRequests.push(request);

  return enrichRequest(request);
}


// ---------------------------------------------------------------------------
// Approve Leave Request
//
// CURRENTLY MOCK ONLY.
//
// Later this will call the SAP ABAP approval action.
// ---------------------------------------------------------------------------

export async function approveLeaveRequest(
  requestId,
  managerId = 'MGR001'
) {
  await delay();

  const request = db.leaveRequests.find(
    (item) => item.id === requestId
  );

  if (!request) {
    throw new ApiError(
      `Request ${requestId} not found.`
    );
  }

  if (request.status !== 'PENDING') {
    throw new ApiError(
      'Only pending requests can be approved.'
    );
  }

  request.status = 'APPROVED';

  request.managerId = managerId;

  request.decidedOn = todayISO();

  request.balanceUpdated = true;

  const balance = db.leaveBalances.find(
    (item) =>
      item.employeeId === request.employeeId &&
      item.leaveType === request.leaveType
  );

  if (balance) {
    balance.usedDays += request.days;
  }

  return enrichRequest(request);
}


// ---------------------------------------------------------------------------
// Reject Leave Request
//
// CURRENTLY MOCK ONLY.
//
// Later this will call the SAP ABAP rejection action.
// ---------------------------------------------------------------------------

export async function rejectLeaveRequest(
  requestId,
  managerId = 'MGR001'
) {
  await delay();

  const request = db.leaveRequests.find(
    (item) => item.id === requestId
  );

  if (!request) {
    throw new ApiError(
      `Request ${requestId} not found.`
    );
  }

  if (request.status !== 'PENDING') {
    throw new ApiError(
      'Only pending requests can be rejected.'
    );
  }

  request.status = 'REJECTED';

  request.managerId = managerId;

  request.decidedOn = todayISO();

  request.balanceUpdated = false;

  return enrichRequest(request);
}


// ---------------------------------------------------------------------------
// END OF API SERVICE
// ---------------------------------------------------------------------------