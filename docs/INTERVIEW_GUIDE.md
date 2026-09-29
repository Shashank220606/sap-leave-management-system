# SAP Leave Management System — Interview Guide

## 30-second explanation

This is a backend-first SAP ABAP Cloud leave-management proof of concept. I modeled employees, leave types, balances, and leave requests using custom ABAP tables, implemented validation and manager approval logic in ABAP classes, and exposed leave requests through CDS and an OData V4 service definition. The React application is a separate mock-data prototype used to demonstrate the workflow.

## Business flow

1. Employee submits a leave request.
2. The system validates the employee, leave type, dates, and available balance.
3. A valid request is created with PENDING status.
4. A manager approves or rejects the request.
5. Approved requests trigger a balance deduction.
6. A balance_updated flag prevents duplicate deductions.
7. Leave history can be reported for review.

## Key technical concepts

### ABAP classes
- ZCL_LEAVE_VALIDATION — business-rule validation
- ZCL_LEAVE_APPROVAL — approval transition
- ZCL_LEAVE_REJECTION — rejection transition
- ZCL_LEAVE_BALANCE_UPDATE — balance deduction and duplicate protection
- ZCL_LEAVE_REPORT — report output
- ZCL_LEAVE_SAMPLE_DATA — demonstration data

### CDS and OData
- ZC_LM_LEAVE_REQ — CDS root view entity
- ZUI_LM_LEAVE — service definition
- ZUI_LM_LEAVE_O4 — documented OData V4 service binding

## Important project limitation

The repository contains ABAP source artifacts and service-definition/binding documentation, but it does not contain an exported SAP BTP runtime or a production deployment. The React frontend is deliberately documented as a separate prototype. Do not claim that the React UI is production-integrated with SAP unless you actually connect and verify the service.

## Interview questions to prepare

**Why ABAP Cloud?** It supports cloud-ready ABAP development with modern development tooling and a restricted, upgrade-safe programming model.

**Why CDS?** CDS provides a structured semantic data model that can be reused for service exposure and application development.

**Why OData V4?** It provides a standardized API protocol for exposing business data and operations to clients.

**How do you prevent duplicate balance deduction?** The request carries a balance_updated flag. Balance deduction is performed only for an approved request when that flag has not already been set.

**What happens when a request is rejected?** The request becomes REJECTED and the leave balance remains unchanged.

**What would you improve next?** I would move the workflow into a proper RAP business object with transactional behavior, authorization, validations/determinations, automated tests, role-based access, and a Fiori application consuming the service.

## Honest portfolio positioning

Use this project as an SAP ABAP Cloud / backend workflow proof of concept, not as a claim of a fully deployed enterprise SAP system. That distinction makes the project easier to defend technically in an interview.