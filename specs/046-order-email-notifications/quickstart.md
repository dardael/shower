# Quickstart: Order Email Notifications

**Feature**: 046-order-email-notifications  
**Branch**: `046-order-email-notifications`

## Prerequisites

- Docker and Docker Compose installed
- Access to an SMTP server for testing (Gmail, Mailtrap, etc.)
- Feature 045-order-management completed (Order entity exists)

## Getting Started

### 1. Install Dependencies

```bash
docker compose run --rm app npm install nodemailer
docker compose run --rm app npm install -D @types/nodemailer
```

### 2. Environment Variables

No new environment variables required. All email configuration is stored in MongoDB via the settings system.

### 3. Run Tests

```bash
# Run all tests
docker compose run --rm app npm run test

# Run email notification tests only
docker compose run --rm app npm run test -- --testPathPattern="email"
```

### 4. Key Files to Create

**Domain Layer** (`src/domain/email/`):

- `entities/SmtpSettings.ts` - SMTP configuration entity
- `entities/EmailTemplate.ts` - Template entity
- `entities/EmailLog.ts` - Email log entity
- `value-objects/EmailAddress.ts` - Email validation
- `services/IEmailService.ts` - Email service interface
- `services/PlaceholderResolver.ts` - Placeholder replacement logic
- `repositories/IEmailLogRepository.ts` - Log repository interface

**Application Layer** (`src/application/email/`):

- `GetSmtpSettings.ts` / `IGetSmtpSettings.ts`
- `UpdateSmtpSettings.ts` / `IUpdateSmtpSettings.ts`
- `TestSmtpConnection.ts` / `ITestSmtpConnection.ts`
- `GetEmailAddresses.ts` / `IGetEmailAddresses.ts`
- `UpdateEmailAddresses.ts` / `IUpdateEmailAddresses.ts`
- `GetEmailTemplates.ts` / `IGetEmailTemplates.ts`
- `UpdateEmailTemplate.ts` / `IUpdateEmailTemplate.ts`
- `SendOrderNotifications.ts` / `ISendOrderNotifications.ts`
- `GetEmailLogs.ts` / `IGetEmailLogs.ts`
- `GetAvailablePlaceholders.ts` / `IGetAvailablePlaceholders.ts`

**Infrastructure Layer** (`src/infrastructure/email/`):

- `repositories/MongooseEmailLogRepository.ts`
- `models/EmailLogModel.ts`
- `services/NodemailerEmailService.ts`
- `services/PasswordEncryptionService.ts`

**API Routes** (`src/app/api/settings/email/`):

- `smtp/route.ts` - GET/PUT SMTP config
- `smtp/test/route.ts` - POST test connection
- `addresses/route.ts` - GET/PUT email addresses
- `templates/route.ts` - GET all templates
- `templates/[type]/route.ts` - PUT specific template
- `placeholders/route.ts` - GET available placeholders
- `logs/route.ts` - GET email logs
- `status/route.ts` - GET configuration status

**Presentation Layer** (`src/presentation/admin/`):

- `components/EmailSettingsForm.tsx` - SMTP & addresses form
- `components/EmailTemplateEditor.tsx` - Template editing with placeholder display
- `components/EmailLogsTable.tsx` - Failed/sent emails dashboard
- `hooks/useEmailSettings.ts` - Data fetching hook
- `hooks/useEmailTemplates.ts` - Template management hook

**Tests** (`test/unit/`):

- `domain/email/PlaceholderResolver.test.ts` - Placeholder replacement tests
- `application/email/SendOrderNotifications.test.ts` - Email sending tests

### 5. Setting Keys to Add

Add to `src/domain/settings/constants/SettingKeys.ts`:

```typescript
// Email SMTP Configuration
EMAIL_SMTP_HOST: 'email-smtp-host',
EMAIL_SMTP_PORT: 'email-smtp-port',
EMAIL_SMTP_USERNAME: 'email-smtp-username',
EMAIL_SMTP_PASSWORD: 'email-smtp-password',
EMAIL_SMTP_ENCRYPTION: 'email-smtp-encryption',

// Email Addresses
EMAIL_SENDER_ADDRESS: 'email-sender-address',
EMAIL_ADMIN_ADDRESS: 'email-admin-address',

// Admin Template
EMAIL_TEMPLATE_ADMIN_SUBJECT: 'email-template-admin-subject',
EMAIL_TEMPLATE_ADMIN_BODY: 'email-template-admin-body',
EMAIL_TEMPLATE_ADMIN_ENABLED: 'email-template-admin-enabled',

// Purchaser Template
EMAIL_TEMPLATE_PURCHASER_SUBJECT: 'email-template-purchaser-subject',
EMAIL_TEMPLATE_PURCHASER_BODY: 'email-template-purchaser-body',
EMAIL_TEMPLATE_PURCHASER_ENABLED: 'email-template-purchaser-enabled',
```

### 6. Integration Point

Modify order creation flow to trigger email notifications:

In the order creation use case or API route, after successful order creation:

```typescript
// After order is created successfully
const sendNotifications = container.resolve<ISendOrderNotifications>(
  'ISendOrderNotifications'
);
await sendNotifications.execute(order);
// Note: This should not throw - failures are logged, not blocking
```

### 7. Testing SMTP Locally

Use Mailtrap or similar for local development:

1. Create a free Mailtrap account
2. Get SMTP credentials from Mailtrap inbox
3. Configure in admin settings:
   - Host: sandbox.smtp.mailtrap.io
   - Port: 587
   - Encryption: TLS
   - Username/Password from Mailtrap

## Validation Checklist

- [ ] SMTP settings can be saved and retrieved
- [ ] Test connection sends email successfully
- [ ] Email addresses validate correctly
- [ ] Templates save with placeholders intact
- [ ] Enable/disable toggles work independently
- [ ] Order placement triggers emails when enabled
- [ ] Placeholders are replaced correctly in sent emails
- [ ] Failed emails are logged and visible in dashboard
- [ ] Email failures don't block order placement

## User Testing Notes

The user specifically requested tests for:

1. **Placeholder replacements** - Verify all placeholders are correctly replaced with order data
2. **Email sending on order confirmation** - Verify emails are sent when notification is enabled

Ensure these test cases are covered in unit tests:

- `PlaceholderResolver.test.ts` for placeholder replacement logic
- `SendOrderNotifications.test.ts` for email sending when enabled/disabled
