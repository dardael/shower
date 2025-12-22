# Implementation Plan: Order Email Notifications

**Branch**: `046-order-email-notifications` | **Date**: 2025-12-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/046-order-email-notifications/spec.md`

## Summary

Implement email notification system for order confirmations with configurable SMTP settings, email templates with placeholder support, and independent toggles for administrator and purchaser notifications. When a customer places an order, the system sends customized emails using configured templates with placeholders replaced by actual order data.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19  
**Primary Dependencies**: Chakra UI v3, tsyringe (DI), Nodemailer (SMTP), existing Order entity from 045-order-management  
**Storage**: MongoDB via Mongoose (email settings, SMTP config, templates)  
**Testing**: Jest for unit tests (placeholder replacement, email sending logic)  
**Target Platform**: Web application (Node.js server for SMTP, browser for admin UI)  
**Project Type**: Web application with existing DDD/Hexagonal architecture  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code), configuration portability (sync export/import on config changes)  
**Scale/Scope**: Single-admin website builder, low email volume (tens of orders per day max)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status  | Notes                                                              |
| ------------------------------------ | ------- | ------------------------------------------------------------------ |
| I. Architecture-First Development    | ✅ PASS | Following existing DDD/Hexagonal patterns                          |
| II. Focused Testing Approach         | ✅ PASS | User requested tests for placeholder replacement and email sending |
| III. Simplicity-First Implementation | ✅ PASS | No performance monitoring, plain text emails                       |
| IV. Security by Default              | ✅ PASS | SMTP password encrypted, admin-only config access                  |
| V. Clean Architecture Compliance     | ✅ PASS | Proper layer separation maintained                                 |
| VI. Accessibility-First Design       | ✅ PASS | Theme-aware UI components, contrast compliance                     |
| VII. YAGNI                           | ✅ PASS | Minimal implementation, plain text only                            |
| VIII. DRY                            | ✅ PASS | Reusing existing settings patterns                                 |
| IX. KISS                             | ✅ PASS | Simple placeholder syntax, straightforward SMTP                    |
| X. Configuration Portability         | ✅ PASS | Email settings included in export/import                           |

## Project Structure

### Documentation (this feature)

```text
specs/046-order-email-notifications/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── domain/
│   └── email/
│       ├── entities/
│       │   ├── SmtpSettings.ts
│       │   ├── EmailSettings.ts
│       │   └── EmailTemplate.ts
│       ├── value-objects/
│       │   └── EncryptionType.ts
│       ├── repositories/
│       │   └── IEmailSettingsRepository.ts
│       └── services/
│           └── IEmailService.ts
├── application/
│   └── email/
│       ├── GetSmtpSettings.ts
│       ├── UpdateSmtpSettings.ts
│       ├── GetEmailSettings.ts
│       ├── UpdateEmailSettings.ts
│       ├── GetEmailTemplate.ts
│       ├── UpdateEmailTemplate.ts
│       ├── SendOrderNotification.ts
│       └── TestSmtpConnection.ts
├── infrastructure/
│   └── email/
│       ├── models/
│       │   ├── SmtpSettingsModel.ts
│       │   ├── EmailSettingsModel.ts
│       │   └── EmailTemplateModel.ts
│       ├── repositories/
│       │   └── MongooseEmailSettingsRepository.ts
│       └── services/
│           ├── NodemailerEmailService.ts
│           └── PlaceholderReplacer.ts
├── presentation/
│   └── admin/
│       └── components/
│           ├── SmtpSettingsForm.tsx
│           ├── EmailSettingsForm.tsx
│           ├── EmailTemplateForm.tsx
│           └── PlaceholderList.tsx
└── app/
    └── api/
        └── admin/
            └── email/
                ├── smtp/
                │   ├── route.ts
                │   └── test/route.ts
                ├── settings/route.ts
                └── templates/
                    └── [type]/route.ts

test/
├── unit/
│   ├── infrastructure/
│   │   └── email/
│   │       └── services/
│   │           └── PlaceholderReplacer.test.ts
│   └── application/
│       └── email/
│           └── SendOrderNotification.test.ts
└── integration/
    └── email-notification.integration.test.tsx
```

**Structure Decision**: Following existing DDD/Hexagonal architecture patterns. New `email` subdomain created under domain/application/infrastructure layers. Admin UI components in presentation/admin/components. API routes under app/api/admin/email/.

## Complexity Tracking

> No violations requiring justification. All principles pass gate check.
