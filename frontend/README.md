# LeaveFlow - SAP Leave Management System (Frontend)

Modern React frontend for a Leave Management System, designed to plug into
**SAP BTP ABAP Cloud OData** later. Currently runs entirely on mock data.

## Quick Start
```bash
npm install
npm run dev
```

## Demo Credentials
| Role     | Employee ID | Password    |
|----------|-------------|-------------|
| Employee | EMP001      | employee123 |
| Manager  | MGR001      | manager123  |

## Architecture
```
Component  ->  services/api.js  ->  Mock data (today)
                                ->  SAP OData Service -> ABAP Cloud -> ZLM_* (later)
```
To connect the real backend: set `baseURL` + `useMockData: false` in
`src/config.js` and implement the OData calls in `src/services/api.js`.
No UI code changes needed.
