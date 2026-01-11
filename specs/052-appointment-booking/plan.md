# Implementation Plan: Appointment Booking System

**Branch**: `052-appointment-booking` | **Date**: 2026-01-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/052-appointment-booking/spec.md`

## Summary

Complete appointment booking system enabling website visitors to book sessions with a practitioner. The admin configures activities (types of sessions), sets weekly availability with exceptions, manages bookings, and receives email notifications. Uses FullCalendar for calendar views and extends existing email/rich text infrastructure.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19  
**Primary Dependencies**: Chakra UI v3, FullCalendar (@fullcalendar/react, @fullcalendar/daygrid, @fullcalendar/timegrid, @fullcalendar/interaction), Tiptap, tsyringe (DI), node-cron  
**Storage**: MongoDB via Mongoose (Activity, Availability, Appointment collections)  
**Testing**: Jest for unit tests and integration tests  
**Target Platform**: Web (Next.js server + client)  
**Project Type**: Web application (Next.js monolith)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code), configuration portability (sync export/import on config changes), French localization (all visible text in French)  
**Scale/Scope**: Single practitioner, typical 10-50 appointments per week

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                    |
| ------------------------------------ | ------ | ------------------------------------------------------------------------ |
| I. Architecture-First Development    | PASS   | DDD with Hexagonal architecture, proper layer separation                 |
| II. Focused Testing Approach         | PASS   | Unit + integration tests only, no e2e                                    |
| III. Simplicity-First Implementation | PASS   | No performance monitoring in final code                                  |
| IV. Security by Default              | PASS   | Admin routes protected by BetterAuth, public booking endpoints validated |
| V. Clean Architecture Compliance     | PASS   | Domain/Application/Infrastructure/Presentation layers                    |
| VI. Accessibility-First Design       | PASS   | Theme-aware styling, contrast compliance                                 |
| VII. YAGNI                           | PASS   | Only features in spec, no speculative additions                          |
| VIII. DRY                            | PASS   | Reuses existing email, settings, menu patterns                           |
| IX. KISS                             | PASS   | Standard CRUD operations, established patterns                           |
| X. Configuration Portability         | PASS   | New settings synced with export/import                                   |
| XI. French Localization              | PASS   | All UI text in French                                                    |

## Project Structure

### Documentation (this feature)

```text
specs/052-appointment-booking/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 research findings
├── data-model.md        # Entity definitions
├── quickstart.md        # Development quickstart
├── contracts/           # API contracts
│   └── api.md           # REST API specification
├── checklists/          # Quality checklists
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── domain/appointment/
│   ├── entities/
│   │   ├── Activity.ts
│   │   ├── Availability.ts
│   │   └── Appointment.ts
│   ├── value-objects/
│   │   ├── AppointmentStatus.ts
│   │   ├── ClientInfo.ts
│   │   ├── WeeklySlot.ts
│   │   └── AvailabilityException.ts
│   └── repositories/
│       ├── IActivityRepository.ts
│       ├── IAvailabilityRepository.ts
│       └── IAppointmentRepository.ts
├── application/appointment/
│   ├── CreateActivity.ts
│   ├── UpdateActivity.ts
│   ├── DeleteActivity.ts
│   ├── GetActivities.ts
│   ├── UpdateAvailability.ts
│   ├── GetAvailability.ts
│   ├── GetAvailableSlots.ts
│   ├── CreateAppointment.ts
│   ├── UpdateAppointmentStatus.ts
│   ├── DeleteAppointment.ts
│   ├── GetAppointments.ts
│   └── SendAppointmentEmails.ts
├── infrastructure/appointment/
│   ├── models/
│   │   ├── ActivityModel.ts
│   │   ├── AvailabilityModel.ts
│   │   └── AppointmentModel.ts
│   ├── repositories/
│   │   ├── MongooseActivityRepository.ts
│   │   ├── MongooseAvailabilityRepository.ts
│   │   └── MongooseAppointmentRepository.ts
│   └── jobs/
│       └── AppointmentReminderJob.ts
├── presentation/
│   ├── admin/components/appointment/
│   │   ├── ActivityForm.tsx
│   │   ├── ActivityList.tsx
│   │   ├── AvailabilityEditor.tsx
│   │   ├── AppointmentCalendar.tsx
│   │   ├── AppointmentList.tsx
│   │   └── AppointmentDetail.tsx
│   ├── public/components/appointment/
│   │   ├── AppointmentBookingWidget.tsx
│   │   ├── ActivitySelector.tsx
│   │   ├── SlotPicker.tsx
│   │   └── BookingForm.tsx
│   ├── admin/components/PageContentEditor/extensions/
│   │   └── AppointmentBooking.ts
│   └── shared/contexts/
│       └── AppointmentModuleContext.tsx
└── app/
    ├── admin/appointments/
    │   ├── page.tsx
    │   ├── activities/page.tsx
    │   └── availability/page.tsx
    └── api/appointments/
        ├── route.ts
        ├── activities/route.ts
        ├── activities/[id]/route.ts
        ├── availability/route.ts
        ├── availability/slots/route.ts
        ├── [id]/route.ts
        ├── [id]/status/route.ts
        └── calendar/route.ts

test/
├── unit/
│   ├── domain/appointment/
│   ├── application/appointment/
│   └── presentation/appointment/
└── integration/
    ├── api/appointments/
    └── infrastructure/appointment/
```

**Structure Decision**: Next.js monolith following existing DDD/Hexagonal patterns. New `appointment` subdirectories mirror existing `settings`, `menu`, `email` structure.

## Complexity Tracking

No violations requiring justification. All patterns follow existing codebase conventions.

## Dependencies

### New NPM Packages

| Package                   | Version | Purpose                   |
| ------------------------- | ------- | ------------------------- |
| @fullcalendar/react       | ^6.x    | React calendar component  |
| @fullcalendar/daygrid     | ^6.x    | Month view plugin         |
| @fullcalendar/timegrid    | ^6.x    | Day/Week time grid views  |
| @fullcalendar/interaction | ^6.x    | Click/select interactions |

### Existing Infrastructure Reused

- Email service from 046-order-email-notifications
- Rich text editor extensions pattern from ProductList
- Module activation pattern from SellingEnabled
- Admin menu conditional display from AdminSidebar
- Settings storage via WebsiteSetting entity

## Testing Requirements

### Unit Tests

- Domain entities: validation, state transitions
- Application use cases: business logic with mocked repos
- React components: rendering, user interactions

### Integration Tests

- API routes: request/response with test database
- Repository operations: MongoDB operations
- Concurrent booking: race condition handling

## Related Documents

- [spec.md](./spec.md) - Feature specification
- [research.md](./research.md) - Technical research findings
- [data-model.md](./data-model.md) - Entity definitions
- [quickstart.md](./quickstart.md) - Development quickstart
- [contracts/api.md](./contracts/api.md) - API contracts
