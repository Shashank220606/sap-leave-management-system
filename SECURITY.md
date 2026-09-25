# Security Policy

## Overview

This repository contains a SAP ABAP Cloud backend and a separate React UI prototype. The project is intended for learning, portfolio demonstration, and technical documentation. It is not a production deployment environment.

## Required security rules

The following must never be committed to this repository:
- SAP client IDs
- SAP client secrets
- OAuth tokens
- service keys
- connection strings
- environment-specific credentials
- private tenant URLs containing sensitive runtime data

## Secret handling guidance

Use secure configuration channels instead of committing values directly to source control:
- SAP BTP destination configuration
- environment variables managed by the local environment or CI system
- `.env.example` placeholders for configuration structure
- secure secret stores in deployment environments

## Repository expectations

Before committing changes, confirm that:
- no credentials are hardcoded in source files
- no real secrets appear in `.env` files
- no service key content appears in documentation or sample config files
- no API tokens or client credentials are left in screenshots or notes

## Incident response

If credentials are accidentally exposed:
1. Remove them immediately from the repository.
2. Rotate or invalidate the exposed secret.
3. Update the repo to use placeholders only.
4. Review git history and any related deployment setup if necessary.

## Important note

This repository previously contained real SAP credential values in `frontend/.env`. Those values were removed and replaced with placeholders to prevent accidental exposure.

The project must remain credential-free in source control.
