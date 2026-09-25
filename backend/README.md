\# SAP Leave Management System - Backend



\## Overview



This folder contains the backend implementation of the SAP Leave Management System developed using SAP ABAP Cloud.



\## Technology



\- SAP ABAP Cloud

\- ABAP

\- CDS

\- OData V4

\- Eclipse with ABAP Development Tools



\## Database Tables



\- ZLM\_EMPLOYEE

\- ZLM\_LEAVE\_TYPE

\- ZLM\_LEAVE\_BAL

\- ZLM\_LEAVE\_REQ



\## ABAP Classes



\- ZCL\_LEAVE\_SAMPLE\_DATA

\- ZCL\_LEAVE\_VALIDATION

\- ZCL\_LEAVE\_APPROVAL

\- ZCL\_LEAVE\_REJECTION

\- ZCL\_LEAVE\_BALANCE\_UPDATE

\- ZCL\_LEAVE\_REPORT



\## Business Flow



Employee

→ Apply Leave

→ Validate Request

→ PENDING

→ Manager Approval/Rejection

→ APPROVED / REJECTED

→ Balance Update for Approved Requests

→ Leave History



\## Business Rules



1\. Employee must exist.

2\. From Date cannot be after To Date.

3\. Available leave balance is validated.

4\. Valid requests are created with PENDING status.

5\. Only PENDING requests can be approved or rejected.

6\. Rejected requests do not reduce leave balance.

7\. Only APPROVED requests can update balance.

8\. Duplicate balance deduction is prevented using BALANCE\_UPDATED.



\## OData



Service Definition:

ZUI\_LM\_LEAVE



Service Binding:

ZUI\_LM\_LEAVE\_O4



Entity Set:

LeaveRequests

