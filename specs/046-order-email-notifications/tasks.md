# Tasks: Order Email Notifications

**Input**: Design documents from `/specs/046-order-email-notifications/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are requested for placeholder replacement and email sending on order confirmation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency installation, and shared constants

- [x] T001 Install nodemailer dependency via `docker compose run --rm app npm install nodemailer @types/nodemailer`
- [x] T002 Add email setting keys to src/domain/settings/constants/SettingKeys.ts (EMAIL*SMTP*_, EMAIL*SENDER*_, EMAIL*TEMPLATE*\*)
- [x] T003 [P] Create EncryptionType value object in src/domain/email/value-objects/EncryptionType.ts
- [x] T004 [P] Create EmailAddress value object in src/domain/email/value-objects/EmailAddress.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core domain entities and infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create SmtpSettings entity in src/domain/email/entities/SmtpSettings.ts
- [x] T006 [P] Create EmailSettings entity in src/domain/email/entities/EmailSettings.ts
- [x] T007 [P] Create EmailTemplate entity in src/domain/email/entities/EmailTemplate.ts
- [x] T008 [P] Create EmailLog entity in src/domain/email/entities/EmailLog.ts
- [x] T009 Create IEmailSettingsRepository interface in src/domain/email/repositories/IEmailSettingsRepository.ts
- [x] T010 [P] Create IEmailService interface in src/domain/email/services/IEmailService.ts
- [x] T011 Create MongooseEmailSettingsRepository in src/infrastructure/email/repositories/MongooseEmailSettingsRepository.ts
- [x] T012 [P] Create EmailLogModel in src/infrastructure/email/models/EmailLogModel.ts
- [x] T013 Register email services in dependency injection container src/infrastructure/container.ts
- [x] T014 Create PlaceholderReplacer service in src/infrastructure/email/services/PlaceholderReplacer.ts
- [x] T015 Create NodemailerEmailService in src/infrastructure/email/services/NodemailerEmailService.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Configure SMTP Server (Priority: P1) 🎯 MVP

**Goal**: Administrators can configure SMTP server settings to enable email sending

**Independent Test**: Navigate to admin settings, configure SMTP host/port/username/password/encryption, save, verify persistence, test connection

### Implementation for User Story 1

- [x] T016 [US1] Create GetSmtpSettings use case in src/application/email/GetSmtpSettings.ts
- [x] T017 [US1] Create UpdateSmtpSettings use case in src/application/email/UpdateSmtpSettings.ts
- [x] T018 [US1] Create TestSmtpConnection use case in src/application/email/TestSmtpConnection.ts
- [x] T019 [US1] Create GET /api/settings/email/smtp route in src/app/api/admin/email/smtp/route.ts
- [x] T020 [US1] Create PUT /api/settings/email/smtp route in src/app/api/admin/email/smtp/route.ts
- [x] T021 [US1] Create POST /api/settings/email/smtp/test route in src/app/api/admin/email/smtp/test/route.ts
- [x] T022 [US1] Create SmtpSettingsForm component in src/presentation/admin/components/SmtpSettingsForm.tsx
- [x] T023 [US1] Integrate SmtpSettingsForm into admin settings page
- [x] T024 [US1] Verify contrast compliance for light and dark modes in SmtpSettingsForm
- [x] T025 [US1] Verify YAGNI, DRY, KISS compliance for User Story 1

**Checkpoint**: SMTP configuration is fully functional and testable independently

---

## Phase 4: User Story 2 - Configure Email Addresses (Priority: P1)

**Goal**: Administrators can configure sender and administrator email addresses

**Independent Test**: Navigate to admin settings, configure sender and admin email addresses, save, verify persistence

### Implementation for User Story 2

- [x] T026 [US2] Create GetEmailSettings use case in src/application/email/GetEmailSettings.ts
- [x] T027 [US2] Create UpdateEmailSettings use case in src/application/email/UpdateEmailSettings.ts
- [x] T028 [US2] Create GET /api/settings/email/addresses route in src/app/api/settings/email/addresses/route.ts
- [x] T029 [US2] Create PUT /api/settings/email/addresses route in src/app/api/settings/email/addresses/route.ts
- [x] T030 [US2] Create EmailSettingsForm component in src/presentation/admin/components/EmailSettingsForm.tsx
- [x] T031 [US2] Integrate EmailSettingsForm into admin settings page
- [x] T032 [US2] Verify contrast compliance for light and dark modes in EmailSettingsForm
- [x] T033 [US2] Verify YAGNI, DRY, KISS compliance for User Story 2

**Checkpoint**: Email address configuration is fully functional and testable independently

---

## Phase 5: User Story 3 - Configure Administrator Notification Template (Priority: P1)

**Goal**: Administrators can configure the email template for admin notifications with placeholders

**Independent Test**: Configure admin email template with subject/body/placeholders, enable toggle, verify persistence

### Implementation for User Story 3

- [x] T034 [US3] Create GetEmailTemplate use case in src/application/email/GetEmailTemplate.ts
- [x] T035 [US3] Create UpdateEmailTemplate use case in src/application/email/UpdateEmailTemplate.ts
- [x] T036 [US3] Create GET /api/settings/email/templates route in src/app/api/settings/email/templates/route.ts
- [x] T037 [US3] Create PUT /api/settings/email/templates/[type] route in src/app/api/settings/email/templates/[type]/route.ts
- [x] T038 [US3] Create PlaceholderList component in src/presentation/admin/components/PlaceholderList.tsx
- [x] T039 [US3] Create EmailTemplateForm component in src/presentation/admin/components/EmailTemplateForm.tsx
- [x] T040 [US3] Create admin notification template configuration UI (using EmailTemplateForm with type='admin')
- [x] T041 [US3] Integrate admin template form into admin settings page
- [x] T042 [US3] Verify contrast compliance for light and dark modes in template forms
- [x] T043 [US3] Verify YAGNI, DRY, KISS compliance for User Story 3

**Checkpoint**: Admin notification template configuration is fully functional

---

## Phase 6: User Story 4 - Configure Purchaser Notification Template (Priority: P1)

**Goal**: Administrators can configure the email template for customer notifications with placeholders

**Independent Test**: Configure purchaser email template with subject/body/placeholders, enable toggle, verify persistence

### Implementation for User Story 4

- [x] T044 [US4] Create purchaser notification template configuration UI (using EmailTemplateForm with type='purchaser')
- [x] T045 [US4] Integrate purchaser template form into admin settings page
- [x] T046 [US4] Verify contrast compliance for light and dark modes
- [x] T047 [US4] Verify YAGNI, DRY, KISS compliance for User Story 4

**Checkpoint**: Purchaser notification template configuration is fully functional

---

## Phase 7: User Story 5 - Send Emails on Order Placement (Priority: P2)

**Goal**: System automatically sends configured notification emails when orders are placed

**Independent Test**: Configure all email settings, place an order, verify both emails sent with correct placeholder replacements

### Tests for User Story 5 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T048 [P] [US5] Unit test for PlaceholderReplacer in test/unit/infrastructure/email/services/PlaceholderReplacer.test.ts
- [x] T049 [P] [US5] Unit test for SendOrderNotification use case in test/unit/application/email/SendOrderNotification.test.ts
- [x] T050 [P] [US5] Integration test for email sending on order confirmation in test/integration/email-notification.integration.test.tsx

### Implementation for User Story 5

- [x] T051 [US5] Create SendOrderNotification use case in src/application/email/SendOrderNotification.ts
- [x] T052 [US5] Create EmailServiceLocator in src/infrastructure/email/EmailServiceLocator.ts
- [x] T053 [US5] Integrate email sending into order placement flow (hook into existing order creation)
- [x] T054 [US5] Create GET /api/settings/email/logs route in src/app/api/admin/email/logs/route.ts
- [x] T055 [US5] Create email logs display in admin dashboard (failed emails section or indicator on orders)
- [x] T056 [US5] Verify email sending does not block order placement on failure
- [x] T057 [US5] Verify YAGNI, DRY, KISS compliance for User Story 5
- [x] T058 [US5] Verify configuration portability (add email settings to export/import system)

**Checkpoint**: Email notifications are sent on order placement with all placeholders correctly replaced

---

## Phase 8: User Story 6 - View Available Placeholders (Priority: P2)

**Goal**: Administrators can see all available placeholders when configuring templates

**Independent Test**: Navigate to template configuration, verify placeholder list is visible with syntax and descriptions

### Implementation for User Story 6

- [x] T059 [US6] Create GET /api/settings/email/placeholders route in src/app/api/settings/email/placeholders/route.ts
- [x] T060 [US6] Ensure PlaceholderList component displays all placeholders with descriptions
- [x] T061 [US6] Verify placeholder list is visible in both admin and purchaser template editors
- [x] T062 [US6] Verify contrast compliance for placeholder list in light and dark modes
- [x] T063 [US6] Verify YAGNI, DRY, KISS compliance for User Story 6

**Checkpoint**: Placeholder list is visible and accurate in template configuration

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cross-cutting improvements

- [x] T064 Create GET /api/settings/email/status route in src/app/api/admin/email/status/route.ts
- [x] T065 Add email configuration status indicator in admin settings
- [x] T066 Run all unit tests: `docker compose run --rm app npm run test`
- [x] T067 Run linting: `docker compose run --rm app npm run lint`
- [x] T068 Run type check: `docker compose run --rm app npm run build:strict`
- [ ] T069 Run quickstart.md validation (manual verification of setup instructions)
- [ ] T070 Final accessibility review across all email configuration screens

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 (SMTP): Independent
  - US2 (Addresses): Independent
  - US3 (Admin Template): Independent (reuses PlaceholderList)
  - US4 (Purchaser Template): Depends on US3 (reuses EmailTemplateForm)
  - US5 (Send Emails): Depends on US1, US2, US3, US4 (requires all config)
  - US6 (Placeholders): Can be done with US3/US4
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

```
US1 (SMTP) ─────────────────┐
US2 (Addresses) ────────────┼──> US5 (Send Emails)
US3 (Admin Template) ───────┤
US4 (Purchaser Template) ───┘
US6 (Placeholders) ─────────> Part of US3/US4 UI
```

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Use cases before API routes
- API routes before UI components
- UI components before integration

### Parallel Opportunities

**Phase 1 (Setup)**:

- T003 and T004 can run in parallel (different value objects)

**Phase 2 (Foundational)**:

- T006, T007, T008 can run in parallel (different entities)
- T010 can run in parallel with T009 (different interfaces)
- T012 can run in parallel with T011 (different infrastructure components)

**User Stories (after Foundational)**:

- US1, US2, US3 can start in parallel (no cross-dependencies)
- US4 must wait for US3 (reuses EmailTemplateForm)
- US5 must wait for US1-US4 (requires all config to be in place)

---

## Parallel Example: Phase 2 Foundational

```bash
# Launch all entity creation tasks together:
Task: "Create EmailSettings entity in src/domain/email/entities/EmailSettings.ts"
Task: "Create EmailTemplate entity in src/domain/email/entities/EmailTemplate.ts"
Task: "Create EmailLog entity in src/domain/email/entities/EmailLog.ts"

# Launch interface and model tasks together:
Task: "Create IEmailService interface in src/domain/email/services/IEmailService.ts"
Task: "Create EmailLogModel in src/infrastructure/email/models/EmailLogModel.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1-4 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (SMTP Config)
4. Complete Phase 4: User Story 2 (Email Addresses)
5. Complete Phase 5: User Story 3 (Admin Template)
6. Complete Phase 6: User Story 4 (Purchaser Template)
7. **STOP and VALIDATE**: All configuration UI works
8. Then add User Story 5 (actual email sending)

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (SMTP) → Admin can configure SMTP
3. Add US2 (Addresses) → Admin can configure addresses
4. Add US3 + US4 (Templates) → Admin can configure templates
5. Add US5 (Sending) → Emails actually sent on orders
6. Add US6 (Placeholders) → Better UX for template editing
7. Polish → Production ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Tests requested specifically for placeholder replacement and email sending (US5)
- All admin UI labels in French per existing conventions
- Email templates use plain text only (no HTML)
- SMTP password encrypted at rest
- Email failures logged but don't block order placement
