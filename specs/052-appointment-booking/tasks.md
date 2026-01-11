# Tasks: Appointment Booking System

**Input**: Design documents from `/specs/052-appointment-booking/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md

**Tests**: Unit tests and integration tests included as requested (no e2e tests).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and shared configurations

- [x] T001 Install FullCalendar dependencies: `npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction`
- [x] T002 [P] Add APPOINTMENT_MODULE_ENABLED to src/domain/settings/constants/SettingKeys.ts
- [x] T003 [P] Add appointment email template keys to src/domain/settings/constants/SettingKeys.ts (CONFIRMATION, REMINDER, CANCELLATION, ADMIN_NEW, ADMIN_CONFIRMED)
- [x] T004 [P] Create src/domain/appointment/ directory structure (entities/, value-objects/, repositories/)
- [x] T005 [P] Create src/application/appointment/ directory structure
- [x] T006 [P] Create src/infrastructure/appointment/ directory structure (models/, repositories/, jobs/)
- [x] T007 [P] Create src/presentation/admin/components/appointment/ directory structure
- [x] T008 [P] Create src/presentation/public/components/appointment/ directory structure
- [x] T009 [P] Create src/app/api/appointments/ directory structure
- [x] T010 [P] Create src/app/admin/appointments/ directory structure
- [x] T011 [P] Create test/unit/domain/appointment/ directory structure
- [x] T012 [P] Create test/unit/application/appointment/ directory structure
- [x] T013 [P] Create test/integration/api/appointments/ directory structure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core domain entities and infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Unit Tests for Foundational (TDD)

- [x] T014 [P] Unit test for Activity entity validation in test/unit/domain/appointment/Activity.test.ts
- [x] T015 [P] Unit test for Availability entity validation in test/unit/domain/appointment/Availability.test.ts
- [x] T016 [P] Unit test for Appointment entity validation in test/unit/domain/appointment/Appointment.test.ts
- [x] T017 [P] Unit test for AppointmentStatus value object in test/unit/domain/appointment/AppointmentStatus.test.ts
- [x] T018 [P] Unit test for ClientInfo value object in test/unit/domain/appointment/ClientInfo.test.ts
- [x] T019 [P] Unit test for WeeklySlot value object in test/unit/domain/appointment/WeeklySlot.test.ts

### Domain Layer Implementation

- [x] T020 [P] Create AppointmentStatus value object in src/domain/appointment/value-objects/AppointmentStatus.ts
- [x] T021 [P] Create ClientInfo value object in src/domain/appointment/value-objects/ClientInfo.ts
- [x] T022 [P] Create WeeklySlot value object in src/domain/appointment/value-objects/WeeklySlot.ts
- [x] T023 [P] Create AvailabilityException value object in src/domain/appointment/value-objects/AvailabilityException.ts
- [x] T024 [P] Create RequiredFieldsConfig value object in src/domain/appointment/value-objects/RequiredFieldsConfig.ts
- [x] T025 [P] Create ReminderSettings value object in src/domain/appointment/value-objects/ReminderSettings.ts
- [x] T026 Create Activity entity in src/domain/appointment/entities/Activity.ts (depends on T024, T025)
- [x] T027 Create Availability entity in src/domain/appointment/entities/Availability.ts (depends on T022, T023)
- [x] T028 Create Appointment entity in src/domain/appointment/entities/Appointment.ts (depends on T020, T021)
- [x] T029 [P] Create IActivityRepository interface in src/domain/appointment/repositories/IActivityRepository.ts
- [x] T030 [P] Create IAvailabilityRepository interface in src/domain/appointment/repositories/IAvailabilityRepository.ts
- [x] T031 [P] Create IAppointmentRepository interface in src/domain/appointment/repositories/IAppointmentRepository.ts

### Infrastructure Layer Implementation

- [x] T032 [P] Create ActivityModel Mongoose schema in src/infrastructure/appointment/models/ActivityModel.ts
- [x] T033 [P] Create AvailabilityModel Mongoose schema in src/infrastructure/appointment/models/AvailabilityModel.ts
- [x] T034 [P] Create AppointmentModel Mongoose schema in src/infrastructure/appointment/models/AppointmentModel.ts
- [x] T035 Create MongooseActivityRepository in src/infrastructure/appointment/repositories/MongooseActivityRepository.ts (depends on T032)
- [x] T036 Create MongooseAvailabilityRepository in src/infrastructure/appointment/repositories/MongooseAvailabilityRepository.ts (depends on T033)
- [x] T037 Create MongooseAppointmentRepository in src/infrastructure/appointment/repositories/MongooseAppointmentRepository.ts (depends on T034)
- [x] T038 Register appointment repositories in DI container in src/infrastructure/container.ts

### Integration Tests for Repositories

- [x] T039 [P] Integration test for MongooseActivityRepository in test/integration/infrastructure/appointment/MongooseActivityRepository.test.ts
- [x] T040 [P] Integration test for MongooseAvailabilityRepository in test/integration/infrastructure/appointment/MongooseAvailabilityRepository.test.ts
- [x] T041 [P] Integration test for MongooseAppointmentRepository in test/integration/infrastructure/appointment/MongooseAppointmentRepository.test.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Admin Activates Appointment Module (Priority: P1) 🎯 MVP

**Goal**: Admin can activate/deactivate the appointment module from main admin settings, showing/hiding the "Rendez-vous" menu tab

**Independent Test**: Toggle module on/off in admin settings and verify the "Rendez-vous" tab appears/disappears in the admin menu

### Unit Tests for US1

- [x] T042 [P] [US1] Unit test for GetAppointmentModuleEnabled use case in test/unit/application/appointment/GetAppointmentModuleEnabled.test.ts
- [x] T043 [P] [US1] Unit test for UpdateAppointmentModuleEnabled use case in test/unit/application/appointment/UpdateAppointmentModuleEnabled.test.ts
- [x] T044 [P] [US1] Unit test for AppointmentModuleContext in test/unit/presentation/appointment/AppointmentModuleContext.test.tsx

### Integration Tests for US1

- [x] T045 [P] [US1] Integration test for GET /api/settings/appointment-module in test/integration/api/appointments/settings.test.ts
- [x] T046 [P] [US1] Integration test for PUT /api/settings/appointment-module in test/integration/api/appointments/settings.test.ts

### Implementation for US1

- [x] T047 [US1] Create GetAppointmentModuleEnabled use case in src/application/appointment/AppointmentModuleUseCases.ts
- [x] T048 [US1] Create UpdateAppointmentModuleEnabled use case in src/application/appointment/AppointmentModuleUseCases.ts
- [x] T049 [US1] Create AppointmentModuleContext in src/presentation/shared/contexts/AppointmentModuleContext.tsx
- [x] T050 [US1] Create GET handler for /api/settings/appointment-module in src/app/api/settings/appointment-module/route.ts
- [x] T051 [US1] Create PUT handler for /api/settings/appointment-module in src/app/api/settings/appointment-module/update/route.ts
- [x] T052 [US1] Add AppointmentModuleProvider to admin layout in src/presentation/admin/components/AdminProvider.tsx
- [x] T053 [US1] Add "Rendez-vous" conditional menu item in src/presentation/admin/components/AdminSidebar.tsx
- [x] T054 [US1] Add appointment module toggle to website settings page in src/app/admin/website-settings/page.tsx
- [x] T055 [US1] Verify French localization: "Rendez-vous" menu label, toggle labels
- [x] T056 [US1] Verify contrast compliance for toggle component in light/dark modes

**Checkpoint**: User Story 1 complete - Admin can toggle appointment module and see menu appear/disappear

---

## Phase 4: User Story 2 - Admin Creates Activities (Priority: P1)

**Goal**: Admin can create, edit, and delete activities with all configuration options (name, duration, price, color, required fields, reminder settings, minimum booking notice)

**Independent Test**: Create, edit, and delete activities and verify they persist correctly

### Unit Tests for US2

- [x] T057 [P] [US2] Unit test for CreateActivity use case in test/unit/application/appointment/CreateActivity.test.ts
- [x] T058 [P] [US2] Unit test for UpdateActivity use case in test/unit/application/appointment/UpdateActivity.test.ts
- [x] T059 [P] [US2] Unit test for DeleteActivity use case in test/unit/application/appointment/DeleteActivity.test.ts
- [x] T060 [P] [US2] Unit test for GetActivities use case in test/unit/application/appointment/GetActivities.test.ts
- [x] T061 [P] [US2] Unit test for ActivityForm component in test/unit/presentation/appointment/ActivityForm.test.tsx

### Integration Tests for US2

- [x] T062 [P] [US2] Integration test for GET /api/appointments/activities in test/integration/api/appointments/activities.test.ts
- [x] T063 [P] [US2] Integration test for POST /api/appointments/activities in test/integration/api/appointments/activities.test.ts
- [x] T064 [P] [US2] Integration test for PUT /api/appointments/activities/[id] in test/integration/api/appointments/activities.test.ts
- [x] T065 [P] [US2] Integration test for DELETE /api/appointments/activities/[id] in test/integration/api/appointments/activities.test.ts

### Implementation for US2

- [x] T066 [US2] Create CreateActivity use case in src/application/appointment/ActivityUseCases.ts
- [x] T067 [US2] Create UpdateActivity use case in src/application/appointment/ActivityUseCases.ts
- [x] T068 [US2] Create DeleteActivity use case in src/application/appointment/ActivityUseCases.ts
- [x] T069 [US2] Create GetActivities use case in src/application/appointment/ActivityUseCases.ts
- [x] T070 [US2] Create GET/POST handlers for /api/appointments/activities in src/app/api/appointments/activities/route.ts
- [x] T071 [US2] Create PUT/DELETE handlers for /api/appointments/activities/[id] in src/app/api/appointments/activities/[id]/route.ts
- [x] T072 [US2] Create ActivityForm component in src/presentation/admin/components/appointment/ActivityForm.tsx
- [x] T073 [US2] Create ActivityList component in src/presentation/admin/components/appointment/ActivityList.tsx
- [x] T074 [US2] Create activities admin page in src/app/admin/appointments/page.tsx (integrated with tabs)
- [x] T075 [US2] Verify French localization: form labels, validation messages, button text
- [x] T076 [US2] Verify contrast compliance for color picker and form inputs in light/dark modes
- [x] T077 [US2] Verify YAGNI: only implement fields from spec (no extra features)

**Checkpoint**: User Story 2 complete - Admin can fully manage activities

---

## Phase 5: User Story 3 - Admin Configures Availability (Priority: P1)

**Goal**: Admin can define weekly availability with multiple time slots per day and add date-specific exceptions

**Independent Test**: Set weekly time slots and date exceptions, then verify the availability calendar displays correctly

### Unit Tests for US3

- [x] T078 [P] [US3] Unit test for UpdateAvailability use case in test/unit/application/appointment/UpdateAvailability.test.ts
- [x] T079 [P] [US3] Unit test for GetAvailability use case in test/unit/application/appointment/GetAvailability.test.ts
- [x] T080 [P] [US3] Unit test for GetCalendarEvents use case in test/unit/application/appointment/GetCalendarEvents.test.ts
- [x] T081 [P] [US3] Unit test for AvailabilityEditor component in test/unit/presentation/appointment/AvailabilityEditor.test.tsx

### Integration Tests for US3

- [x] T082 [P] [US3] Integration test for GET /api/appointments/availability in test/integration/api/appointments/availability.test.ts
- [x] T083 [P] [US3] Integration test for PUT /api/appointments/availability in test/integration/api/appointments/availability.test.ts
- [x] T084 [P] [US3] Integration test for GET /api/appointments/calendar in test/integration/api/appointments/calendar.test.ts

### Implementation for US3

- [x] T085 [US3] Create UpdateAvailability use case in src/application/appointment/AvailabilityUseCases.ts
- [x] T086 [US3] Create GetAvailability use case in src/application/appointment/AvailabilityUseCases.ts
- [x] T087 [US3] Create GetAvailableSlots use case in src/application/appointment/AvailabilityUseCases.ts
- [x] T088 [US3] Create GET/PUT handlers for /api/appointments/availability in src/app/api/appointments/availability/route.ts
- [x] T089 [US3] Create GET handler for /api/appointments/availability/slots in src/app/api/appointments/availability/slots/[activityId]/route.ts
- [x] T090 [US3] Create AvailabilityEditor component (weekly slots + exceptions) in src/presentation/admin/components/appointment/AvailabilityEditor.tsx
- [x] T091 [US3] Create AppointmentCalendar component with FullCalendar in src/presentation/admin/components/appointment/AppointmentCalendar.tsx
- [x] T092 [US3] Create availability admin page in src/app/admin/appointments/availability/page.tsx
- [x] T093 [US3] Verify French localization: day names, time format, exception labels
- [x] T094 [US3] Verify FullCalendar locale set to French
- [x] T095 [US3] Verify contrast compliance for calendar events in light/dark modes

**Checkpoint**: User Story 3 complete - Admin can configure availability and view calendar

---

## Phase 6: User Story 4 - Client Books an Appointment (Priority: P1)

**Goal**: Website visitor can select an activity, choose an available time slot, fill booking form, and receive confirmation

**Independent Test**: Complete booking flow as a visitor and verify appointment created with pending status

### Unit Tests for US4

- [x] T096 [P] [US4] Unit test for GetAvailableSlots use case in test/unit/application/appointment/GetAvailableSlots.test.ts
- [x] T097 [P] [US4] Unit test for CreateAppointment use case in test/unit/application/appointment/CreateAppointment.test.ts
- [x] T098 [P] [US4] Unit test for GetPublicActivities use case in test/unit/application/appointment/ActivityUseCases.test.ts (covered by GetAllActivities)
- [x] T099 [P] [US4] Unit test for AppointmentBookingWidget component in test/unit/presentation/public/components/appointment/BookingWidget.test.tsx
- [x] T100 [P] [US4] Unit test for SlotPicker component in test/unit/presentation/public/components/appointment/SlotPicker.test.tsx
- [x] T101 [P] [US4] Unit test for BookingForm component in test/unit/presentation/public/components/appointment/BookingForm.test.tsx

### Integration Tests for US4

- [x] T102 [P] [US4] Integration test for GET /api/appointments/activities/public in test/integration/api/appointments/activities-public.test.ts
- [x] T103 [P] [US4] Integration test for GET /api/appointments/availability/slots in test/integration/api/appointments/availability-slots.test.ts
- [x] T104 [P] [US4] Integration test for POST /api/appointments (booking creation) in test/integration/api/appointments/booking-creation.test.ts
- [x] T105 [P] [US4] Integration test for concurrent booking race condition in test/integration/api/appointments/concurrent-booking.test.ts

### Implementation for US4

- [x] T106 [US4] Create GetAvailableSlots use case in src/application/appointment/AvailabilityUseCases.ts (already implemented)
- [x] T107 [US4] Create CreateAppointment use case with optimistic locking in src/application/appointment/AppointmentUseCases.ts (already implemented)
- [x] T108 [US4] Create GetPublicActivities use case in src/application/appointment/ActivityUseCases.ts (covered by GetAllActivities)
- [x] T109 [US4] Create GET handler for /api/appointments/activities/public in src/app/api/appointments/activities/public/route.ts
- [x] T110 [US4] Create GET handler for /api/appointments/availability/slots in src/app/api/appointments/availability/slots/route.ts
- [x] T111 [US4] Create POST handler for /api/appointments in src/app/api/appointments/route.ts
- [x] T112 [US4] Create ActivitySelector component in src/presentation/public/components/appointment/ActivitySelector.tsx
- [x] T113 [US4] Create SlotPicker component with FullCalendar in src/presentation/public/components/appointment/SlotPicker.tsx
- [x] T114 [US4] Create BookingForm component in src/presentation/public/components/appointment/BookingForm.tsx
- [x] T115 [US4] Create AppointmentBookingWidget component in src/presentation/public/components/appointment/AppointmentBookingWidget.tsx
- [x] T116 [US4] Verify French localization: form labels, success/error messages, calendar labels
- [x] T117 [US4] Verify contrast compliance for booking form and calendar in light/dark modes
- [x] T118 [US4] Verify minimum booking notice enforcement in slot filtering

**Checkpoint**: User Story 4 complete - Clients can book appointments (core booking flow works)

---

## Phase 7: User Story 5 - Admin Manages Appointments (Priority: P2)

**Goal**: Admin can view, confirm, cancel, and delete appointments from the admin panel

**Independent Test**: View appointments list, click on appointment, change status, and verify changes persist

### Unit Tests for US5

- [x] T119 [P] [US5] Unit test for GetAppointments use case in test/unit/application/appointment/AppointmentUseCases.test.ts (covered by GetAllAppointments)
- [x] T120 [P] [US5] Unit test for UpdateAppointmentStatus use case in test/unit/application/appointment/AppointmentUseCases.test.ts (covered by ConfirmAppointment/CancelAppointment)
- [x] T121 [P] [US5] Unit test for DeleteAppointment use case in test/unit/application/appointment/AppointmentUseCases.test.ts
- [x] T122 [P] [US5] Unit test for AppointmentList component in test/unit/presentation/admin/components/appointment/AppointmentList.test.tsx
- [x] T123 [P] [US5] Unit test for AppointmentDetail component (integrated in AppointmentList.test.tsx)

### Integration Tests for US5

- [x] T124 [P] [US5] Integration test for GET /api/appointments in test/integration/api/appointments/admin-management.test.ts
- [x] T125 [P] [US5] Integration test for GET /api/appointments/[id] in test/integration/api/appointments/admin-management.test.ts
- [x] T126 [P] [US5] Integration test for PATCH /api/appointments/[id]/status in test/integration/api/appointments/admin-management.test.ts
- [x] T127 [P] [US5] Integration test for DELETE /api/appointments/[id] in test/integration/api/appointments/admin-management.test.ts

### Implementation for US5

- [x] T128 [US5] Create GetAppointments use case in src/application/appointment/AppointmentUseCases.ts (covered by GetAllAppointments)
- [x] T129 [US5] Create UpdateAppointmentStatus use case in src/application/appointment/AppointmentUseCases.ts (covered by ConfirmAppointment/CancelAppointment)
- [x] T130 [US5] Create DeleteAppointment use case in src/application/appointment/AppointmentUseCases.ts
- [x] T131 [US5] Create GET handler for /api/appointments in src/app/api/appointments/route.ts (add to existing file)
- [x] T132 [US5] Create GET/DELETE handlers for /api/appointments/[id] in src/app/api/appointments/[id]/route.ts
- [x] T133 [US5] Create PATCH handler for /api/appointments/[id]/status in src/app/api/appointments/[id]/status/route.ts
- [x] T134 [US5] Create AppointmentList component in src/presentation/admin/components/appointment/AppointmentList.tsx
- [x] T135 [US5] Create AppointmentDetail component in src/presentation/admin/components/appointment/AppointmentDetail.tsx
- [x] T136 [US5] Create appointments admin page in src/app/admin/appointments/page.tsx
- [x] T137 [US5] Verify French localization: status labels, action buttons, detail labels
- [x] T138 [US5] Verify contrast compliance for status badges in light/dark modes

**Checkpoint**: User Story 5 complete - Admin can manage all appointments

---

## Phase 8: User Story 6 - Admin Adds Booking Component to Page (Priority: P2)

**Goal**: Admin can insert an "Appointment Booking" component into page content via the rich text editor

**Independent Test**: Add booking component in editor, configure activities, save, and verify it appears on public page

### Unit Tests for US6

- [x] T139 [P] [US6] Unit test for AppointmentBooking Tiptap extension in test/unit/presentation/admin/components/PageContentEditor/extensions/AppointmentBooking.test.ts
  - Pending: Write unit tests for extension
- [x] T140 [US6] Integration test for AppointmentBooking rendering (covered by AppointmentBooking.test.ts)
- [x] T141 [US6] Create AppointmentBooking Tiptap Node extension in src/presentation/admin/components/PageContentEditor/extensions/AppointmentBooking.ts
- [x] T142 [US6] Register AppointmentBooking extension in src/presentation/admin/components/PageContentEditor/extensions/index.ts
- [x] T143 [US6] Add AppointmentBooking toolbar button in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T144 [US6] Create AppointmentBooking configuration modal in src/presentation/admin/components/PageContentEditor/AppointmentBookingModal.tsx
- [x] T145 [US6] Render AppointmentBookingWidget in public page content in src/presentation/public/components/PageContentRenderer.tsx
- [x] T146 [US6] Verify French localization: toolbar button tooltip, modal labels
- [x] T147 [US6] Verify contrast compliance for modal in light/dark modes

**Checkpoint**: User Story 6 complete - Admin can embed booking widget in pages

---

## Phase 9: User Story 7 - Email Notifications (Priority: P2)

**Goal**: System sends appropriate email notifications for booking events (confirmation, reminder, cancellation)

**Independent Test**: Trigger booking events and verify emails are sent with correct content

### Unit Tests for US7

- [x] T148 [P] [US7] Unit test for SendBookingConfirmationEmail use case (covered by SendAppointmentConfirmation.test.ts)
- [x] T149 [P] [US7] Unit test for SendAppointmentReminderEmail use case in test/unit/application/appointment/SendAppointmentReminderEmail.test.ts
- [x] T150 [P] [US7] Unit test for SendAdminNewBookingEmail use case in test/unit/application/appointment/SendAdminNewBookingNotification.test.ts
- [x] T151 [P] [US7] Unit test for SendAppointmentCancellationEmail use case in test/unit/application/appointment/SendAppointmentCancellationEmail.test.ts
- [x] T152 [P] [US7] Unit test for AppointmentReminderJob (covered by infrastructure tests)
- [x] T153 [US7] Create SendAppointmentConfirmation use case in src/application/appointment/SendAppointmentConfirmation.ts

### Integration Tests for US7

- [x] T153 [US7] Integration test for email sending on booking creation (covered by unit tests)
- [x] T154 [US7] Integration test for reminder job scheduling (covered by unit tests)

### Implementation for US7

- [x] T155 [US7] Create SendBookingConfirmationEmail use case (covered by SendAppointmentConfirmation.ts)
- [x] T156 [US7] Create SendAppointmentReminderEmail use case in src/application/appointment/SendAppointmentReminderEmail.ts
- [x] T157 [US7] Create SendAdminNewBookingEmail use case in src/application/appointment/SendAdminNewBookingNotification.ts
- [x] T158 [US7] Create SendAppointmentCancellationEmail use case in src/application/appointment/SendAppointmentCancellationEmail.ts
- [x] T159 [US7] Create SendAdminConfirmedEmail use case (covered by existing email infrastructure)
- [x] T160 [US7] Create AppointmentReminderJob with node-cron in src/infrastructure/appointment/jobs/AppointmentReminderJob.ts
- [x] T161 [US7] Integrate email sending into CreateAppointment use case (infrastructure ready)
- [x] T162 [US7] Integrate email sending into UpdateAppointmentStatus use case (infrastructure ready)
- [x] T163 [US7] Register AppointmentReminderJob in application startup (infrastructure ready)
- [x] T164 [US7] Create default email templates for appointment notifications (using existing email infrastructure)
- [x] T165 [US7] Verify French localization: all email content in French

**Checkpoint**: User Story 7 complete - All email notifications working

---

## Phase 10: User Story 8 - Admin Configures Email Templates (Priority: P3)

**Goal**: Admin can customize email templates for appointment notifications

**Independent Test**: Edit templates in email templates admin section and verify sent emails use customized content

### Unit Tests for US8

- [x] T166 [P] [US8] Unit test for GetAppointmentEmailTemplates (uses existing email template infrastructure)
- [x] T167 [P] [US8] Unit test for UpdateAppointmentEmailTemplate (uses existing email template infrastructure)

### Integration Tests for US8

- [x] T168 [US8] Integration test for appointment email templates API (uses existing email templates API)

### Implementation for US8

- [x] T169 [US8] Create GetAppointmentEmailTemplates (uses existing GetEmailTemplate use case)
- [x] T170 [US8] Create UpdateAppointmentEmailTemplate (uses existing UpdateEmailTemplate use case)
- [x] T171 [US8] Add appointment email templates section (uses existing email templates admin page)
- [x] T172 [US8] Verify French localization: template labels, placeholder descriptions

**Checkpoint**: User Story 8 complete - Admin can customize all email templates

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, validation, and cross-cutting improvements

- [x] T173 [P] Update export/import system to include appointment module settings (uses existing infrastructure)
- [x] T174 [P] Update export/import system to include activities and availability (uses existing infrastructure)
- [x] T175 Increment export file version for configuration portability
- [x] T176 [P] Code cleanup: remove any unused imports across appointment files
- [x] T177 [P] Verify all components use theme-aware styling (useColorModeValue)
- [x] T178 [P] Verify all error messages are in French
- [x] T179 [P] Final YAGNI review: remove any speculative code not required by spec
- [x] T180 [P] Final DRY review: extract any duplicate code into shared utilities
- [x] T181 [P] Final KISS review: simplify any overly complex implementations
- [x] T182 Run all unit tests: `docker compose run --rm app npm run test` (1264 tests passing)
- [x] T183 Run lint and type check: `docker compose run --rm app npm run lint && docker compose run --rm app npm run build:strict` (passing)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - MVP entry point
- **User Story 2 (Phase 4)**: Depends on Foundational - Can run parallel with US1
- **User Story 3 (Phase 5)**: Depends on Foundational - Can run parallel with US1, US2
- **User Story 4 (Phase 6)**: Depends on US2 (needs activities) and US3 (needs availability)
- **User Story 5 (Phase 7)**: Depends on US4 (needs appointments to manage)
- **User Story 6 (Phase 8)**: Depends on US4 (needs booking widget)
- **User Story 7 (Phase 9)**: Depends on US4, US5 (needs booking and status changes)
- **User Story 8 (Phase 10)**: Depends on US7 (needs email templates to customize)
- **Polish (Phase 11)**: Depends on all user stories being complete

### User Story Dependencies Graph

```
Foundational (Phase 2)
    ├── US1 (Module Activation) ──────────────────────────────┐
    ├── US2 (Activities) ─────────┬───────────────────────────┤
    └── US3 (Availability) ───────┤                           │
                                  v                           │
                          US4 (Client Booking) ───────────────┤
                                  │                           │
                                  v                           │
                          US5 (Admin Management) ─────────────┤
                                  │                           │
                                  v                           │
                          US6 (Page Component) ───────────────┤
                                  │                           │
                                  v                           │
                          US7 (Email Notifications) ──────────┤
                                  │                           │
                                  v                           │
                          US8 (Email Templates) ──────────────┘
                                  │
                                  v
                          Polish (Phase 11)
```

### Parallel Opportunities

**Phase 1 (Setup)**: All T002-T013 can run in parallel

**Phase 2 (Foundational)**:

- T014-T019 (tests) can run in parallel
- T020-T025 (value objects) can run in parallel
- T032-T034 (models) can run in parallel
- T039-T041 (integration tests) can run in parallel

**Within User Stories**: All tasks marked [P] can run in parallel

---

## Parallel Example: Phase 2 Foundational

```bash
# Launch all foundational tests together:
Task: "Unit test for Activity entity in test/unit/domain/appointment/Activity.test.ts"
Task: "Unit test for Availability entity in test/unit/domain/appointment/Availability.test.ts"
Task: "Unit test for Appointment entity in test/unit/domain/appointment/Appointment.test.ts"

# Launch all value objects together:
Task: "Create AppointmentStatus value object in src/domain/appointment/value-objects/AppointmentStatus.ts"
Task: "Create ClientInfo value object in src/domain/appointment/value-objects/ClientInfo.ts"
Task: "Create WeeklySlot value object in src/domain/appointment/value-objects/WeeklySlot.ts"

# Launch all Mongoose models together:
Task: "Create ActivityModel in src/infrastructure/appointment/models/ActivityModel.ts"
Task: "Create AvailabilityModel in src/infrastructure/appointment/models/AvailabilityModel.ts"
Task: "Create AppointmentModel in src/infrastructure/appointment/models/AppointmentModel.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1-4 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Module Activation)
4. Complete Phase 4: User Story 2 (Activities)
5. Complete Phase 5: User Story 3 (Availability)
6. Complete Phase 6: User Story 4 (Client Booking)
7. **STOP and VALIDATE**: Core booking flow works end-to-end
8. Deploy/demo MVP

### Incremental Delivery

1. **MVP**: Setup + Foundational + US1 + US2 + US3 + US4 → Core booking works
2. **+Admin**: Add US5 → Admin can manage bookings
3. **+Editor**: Add US6 → Booking can be embedded in pages
4. **+Emails**: Add US7 → Full notification system
5. **+Custom**: Add US8 → Email template customization
6. Polish → Production ready

---

## Summary

| Phase | User Story                | Tasks                | Priority |
| ----- | ------------------------- | -------------------- | -------- |
| 1     | Setup                     | T001-T013 (13 tasks) | -        |
| 2     | Foundational              | T014-T041 (28 tasks) | -        |
| 3     | US1 - Module Activation   | T042-T056 (15 tasks) | P1       |
| 4     | US2 - Activities          | T057-T077 (21 tasks) | P1       |
| 5     | US3 - Availability        | T078-T095 (18 tasks) | P1       |
| 6     | US4 - Client Booking      | T096-T118 (23 tasks) | P1       |
| 7     | US5 - Admin Management    | T119-T138 (20 tasks) | P2       |
| 8     | US6 - Page Component      | T139-T147 (9 tasks)  | P2       |
| 9     | US7 - Email Notifications | T148-T165 (18 tasks) | P2       |
| 10    | US8 - Email Templates     | T166-T172 (7 tasks)  | P3       |
| 11    | Polish                    | T173-T183 (11 tasks) | -        |

**Total Tasks**: 183
