\# SAP Leave Management System



A backend-focused employee leave management system developed using SAP ABAP Cloud.



\## Project Overview



The system automates the employee leave process including leave application, validation, manager approval/rejection, leave balance management and leave history reporting.



\## Architecture



React Frontend Prototype

&#x20;       |

&#x20;       | Separate Component

&#x20;       |

SAP ABAP Cloud Backend

&#x20;       |

Custom Database Tables

&#x20;       |

ABAP Business Logic

&#x20;       |

OData V4 Service



\## Features



\- Employee Master Management

\- Leave Type Management

\- Leave Balance Management

\- Leave Application

\- Leave Validation

\- Manager Approval

\- Manager Rejection

\- Automatic Leave Balance Deduction

\- Duplicate Balance Update Protection

\- Leave History Report

\- OData V4 Service



\## Leave Types



| Code | Leave Type |

|------|------------|

| CL | Casual Leave |

| SL | Sick Leave |

| EL | Earned Leave |



\## Project Structure



```text

sap-leave-management-system/

│

├── backend/

│   ├── tables/

│   ├── classes/

│   ├── cds/

│   ├── services/

│   └── README.md

│

├── frontend/

│   └── React frontend prototype

│

├── docs/

│   └── Project documentation

│

└── README.md

