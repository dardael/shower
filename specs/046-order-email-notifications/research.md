# Research: Order Email Notifications

**Feature**: 046-order-email-notifications  
**Date**: 2025-12-22

## Research Summary

This document captures technical decisions and best practices research for implementing email notifications in the shower project.

---

## Decision 1: SMTP Library Selection

**Decision**: Use Nodemailer for SMTP email sending

**Rationale**:

- Nodemailer is the de-facto standard for Node.js email sending
- Supports all encryption types (SSL/TLS/STARTTLS/none)
- Well-documented, mature library with active maintenance
- Simple API that aligns with KISS principle
- Works with any SMTP provider

**Alternatives Considered**:

- SendGrid/Mailgun APIs: Require external service subscription, over-engineered for simple SMTP needs
- AWS SES SDK: Vendor lock-in, requires AWS account
- Custom SMTP implementation: Unnecessary complexity, reinventing the wheel

---

## Decision 2: Password Encryption Strategy

**Decision**: Use AES-256-GCM encryption with a server-side environment variable key

**Rationale**:

- SMTP password must be stored encrypted at rest (security requirement)
- AES-256-GCM provides authenticated encryption (confidentiality + integrity)
- Environment variable for encryption key follows existing project patterns
- Node.js crypto module is built-in, no additional dependencies

**Alternatives Considered**:

- Plain text storage: Unacceptable security risk
- Hashing: Passwords need to be reversible for SMTP auth
- External secrets manager: Over-engineered for single-admin use case

---

## Decision 3: Placeholder Replacement Implementation

**Decision**: Use simple regex-based string replacement with {{placeholder}} syntax

**Rationale**:

- Simple to implement and understand (KISS)
- Matches user expectation from the spec
- Easy to test with unit tests
- No template engine dependencies needed
- Unrecognized placeholders left as-is (graceful handling per FR-032)

**Implementation Pattern**:

```typescript
function replacePlaceholders(
  template: string,
  data: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] ?? match; // Leave unrecognized placeholders as-is
  });
}
```

**Alternatives Considered**:

- Handlebars/Mustache: Over-engineered for simple placeholder replacement
- EJS templates: HTML-focused, not needed for plain text
- Custom parser: Unnecessary complexity

---

## Decision 4: Email Sending Error Handling

**Decision**: Fire-and-forget with logging and dashboard visibility

**Rationale**:

- Email failures must not block order placement (FR-029)
- Errors logged for administrator review (FR-030)
- Failed emails visible in admin dashboard (FR-031)
- Simple implementation without retry queues (YAGNI)

**Implementation Pattern**:

- SendOrderNotification use case catches all SMTP errors
- On failure: log error with order ID, update order with email failure status
- Order model extended with optional `emailStatus` field

**Alternatives Considered**:

- Retry queue with exponential backoff: Over-engineered, adds complexity
- Synchronous with timeout: Blocks order placement, poor UX
- Background job system: Unnecessary infrastructure for low volume

---

## Decision 5: Settings Storage Pattern

**Decision**: Follow existing WebsiteSettings pattern with dedicated collections

**Rationale**:

- Consistency with existing codebase (DRY)
- Mongoose models for SmtpSettings, EmailSettings, EmailTemplate
- Single document per collection (website has one SMTP config)
- Reuses existing repository patterns

**Alternatives Considered**:

- Key-value in WebsiteSettings: Pollutes existing settings, harder to manage
- Environment variables for SMTP: Not configurable through UI
- Separate settings service: Creates unnecessary abstraction

---

## Decision 6: Test Strategy

**Decision**: Unit tests for placeholder replacement, integration tests for email sending flow

**Rationale**:

- User explicitly requested tests for:
  1. Placeholder replacements
  2. Email sending when order is confirmed (if notifications enabled)
- Unit tests for PlaceholderReplacer service (pure function, easy to test)
- Integration test for SendOrderNotification use case with mocked SMTP
- Follow existing Jest test patterns

**Test Files**:

- `test/unit/infrastructure/email/services/PlaceholderReplacer.test.ts`
- `test/unit/application/email/SendOrderNotification.test.ts`
- `test/integration/email-notification.integration.test.tsx`

---

## Decision 7: Products List Placeholder Format

**Decision**: Simple text format with one product per line

**Rationale**:

- Plain text emails require readable product listing
- Format: "- {quantity}x {product_name} - {price}€"
- No HTML formatting (per clarification: plain text only)
- Easy to generate from OrderItem array

**Example Output**:

```
- 2x T-shirt Bleu - 29.99€
- 1x Pantalon Noir - 59.99€
- 3x Chaussettes - 9.99€
```

---

## Decision 8: Default Email Templates

**Decision**: Provide sensible French default templates on initial setup

**Rationale**:

- Admin interface is in French (per assumptions)
- Administrators can modify templates but have working defaults
- Reduces initial configuration burden

**Default Admin Template**:

- Subject: `Nouvelle commande #{{order_id}}`
- Body: Standard order summary with all placeholders

**Default Purchaser Template**:

- Subject: `Confirmation de votre commande #{{order_id}}`
- Body: Customer-friendly order confirmation with key details

---

## Integration Points

### With Order Management (045-order-management)

- SendOrderNotification called after order creation succeeds
- Order entity provides all data for placeholder replacement
- Order extended with optional email status tracking

### With Export/Import System (033-config-export-import)

- SmtpSettings included in export (password excluded for security)
- EmailSettings included in export
- EmailTemplates included in export
- Import handles missing email config gracefully

---

## Open Questions Resolved

All technical unknowns have been resolved through this research phase. No remaining NEEDS CLARIFICATION items.
