# API Contracts: Mobile Appointment Booking UX Improvements

**Feature**: 053-mobile-appointment-ux  
**Date**: 2025-06-26

## Overview

This feature introduces **no API changes**. All modifications are purely presentation layer (CSS and responsive layout).

## Existing API Endpoints (Unchanged)

The following endpoints are used by the booking widget and remain unchanged:

| Method | Endpoint                               | Purpose                     |
| ------ | -------------------------------------- | --------------------------- |
| GET    | `/api/appointments/activities`         | List available activities   |
| GET    | `/api/appointments/availability/slots` | Get slots for activity/date |
| POST   | `/api/appointments`                    | Create new appointment      |

## Request/Response Schemas

No changes to existing schemas. See existing API documentation.

## Testing Notes

- All API contracts tested by existing integration tests
- No new API tests required for this feature
- Focus visual/E2E testing on responsive behavior
