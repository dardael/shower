# Data Model: Order Email Notifications

**Feature**: 046-order-email-notifications  
**Created**: 2025-12-22  
**Status**: Design

## Entities

### SmtpSettings

SMTP server configuration for sending emails.

| Field          | Type                     | Required | Description                                     |
| -------------- | ------------------------ | -------- | ----------------------------------------------- |
| host           | string                   | Yes      | SMTP server hostname (e.g., smtp.gmail.com)     |
| port           | number                   | Yes      | SMTP server port (25, 465, 587)                 |
| username       | string                   | Yes      | SMTP authentication username                    |
| password       | string (encrypted)       | Yes      | SMTP authentication password (stored encrypted) |
| encryptionType | 'ssl' \| 'tls' \| 'none' | Yes      | Connection encryption type                      |

**Validation Rules**:

- `host`: Non-empty string, valid hostname format
- `port`: Integer between 1 and 65535
- `username`: Non-empty string
- `password`: Non-empty string (encrypted at rest using AES-256)
- `encryptionType`: Must be one of 'ssl', 'tls', 'none'

**Storage**: Stored as WebsiteSetting entries with keys:

- `email-smtp-host`
- `email-smtp-port`
- `email-smtp-username`
- `email-smtp-password` (encrypted)
- `email-smtp-encryption`

---

### EmailSettings

Email address configuration for notifications.

| Field              | Type   | Required | Description                               |
| ------------------ | ------ | -------- | ----------------------------------------- |
| senderEmail        | string | Yes      | "From" address for all outgoing emails    |
| administratorEmail | string | Yes      | Recipient address for admin notifications |

**Validation Rules**:

- `senderEmail`: Valid email format (RFC 5322)
- `administratorEmail`: Valid email format (RFC 5322)

**Storage**: Stored as WebsiteSetting entries with keys:

- `email-sender-address`
- `email-admin-address`

---

### EmailTemplate

Template configuration for notification emails.

| Field   | Type                   | Required | Description                                |
| ------- | ---------------------- | -------- | ------------------------------------------ |
| type    | 'admin' \| 'purchaser' | Yes      | Template type identifier                   |
| subject | string                 | Yes      | Email subject line (supports placeholders) |
| body    | string                 | Yes      | Email body content (supports placeholders) |
| enabled | boolean                | Yes      | Whether this notification type is enabled  |

**Validation Rules**:

- `type`: Must be 'admin' or 'purchaser'
- `subject`: Non-empty string, max 200 characters
- `body`: Non-empty string, max 10000 characters
- `enabled`: Boolean

**Storage**: Stored as WebsiteSetting entries with keys:

- `email-template-admin-subject`
- `email-template-admin-body`
- `email-template-admin-enabled`
- `email-template-purchaser-subject`
- `email-template-purchaser-body`
- `email-template-purchaser-enabled`

---

### EmailLog

Record of sent/failed email attempts for dashboard visibility.

| Field        | Type                   | Required | Description               |
| ------------ | ---------------------- | -------- | ------------------------- |
| id           | string                 | Yes      | Unique identifier (UUID)  |
| orderId      | string                 | Yes      | Reference to the order    |
| type         | 'admin' \| 'purchaser' | Yes      | Email type                |
| recipient    | string                 | Yes      | Email recipient address   |
| subject      | string                 | Yes      | Rendered email subject    |
| status       | 'sent' \| 'failed'     | Yes      | Delivery status           |
| errorMessage | string \| null         | No       | Error details if failed   |
| sentAt       | Date                   | Yes      | Timestamp of send attempt |

**Validation Rules**:

- `orderId`: Must reference existing Order
- `recipient`: Valid email format
- `status`: Must be 'sent' or 'failed'

**Storage**: New MongoDB collection `email_logs`

---

## Value Objects

### EmailAddress

Immutable value object for validated email addresses.

```typescript
interface EmailAddress {
  readonly value: string;

  static create(email: string): EmailAddress;
  static isValid(email: string): boolean;
  toString(): string;
}
```

### EncryptionType

Enumeration for SMTP encryption options.

```typescript
type EncryptionType = 'ssl' | 'tls' | 'none';

const ENCRYPTION_TYPES = {
  SSL: 'ssl',
  TLS: 'tls',
  NONE: 'none',
} as const;
```

---

## Placeholder System

### Available Placeholders

| Placeholder              | Description                            | Source                  |
| ------------------------ | -------------------------------------- | ----------------------- |
| `{{order_id}}`           | Unique order identifier                | Order.id                |
| `{{order_date}}`         | Order placement date/time              | Order.createdAt         |
| `{{order_total}}`        | Formatted total amount                 | Order.total             |
| `{{customer_firstname}}` | Customer's first name                  | Order.customerFirstname |
| `{{customer_lastname}}`  | Customer's last name                   | Order.customerLastname  |
| `{{customer_email}}`     | Customer's email address               | Order.customerEmail     |
| `{{customer_phone}}`     | Customer's phone number                | Order.customerPhone     |
| `{{products_list}}`      | Formatted product list with quantities | Order.items (formatted) |

### Placeholder Registry

```typescript
interface PlaceholderDefinition {
  syntax: string; // e.g., '{{order_id}}'
  description: string; // Human-readable description
  resolver: (order: Order) => string; // Function to get value
}
```

---

## Setting Keys Extension

New keys to add to `VALID_SETTING_KEYS`:

```typescript
// SMTP Configuration
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

---

## Relationships

```
Order (existing)
  │
  ├──< EmailLog (1:N) - one order can have multiple email attempts
  │
  └──> EmailTemplate - templates applied when order is placed

EmailSettings ──> SmtpSettings - email addresses require SMTP to send

WebsiteSetting (existing)
  │
  └──< All email configuration stored as key-value pairs
```

---

## Default Values

| Setting Key                      | Default Value                                 |
| -------------------------------- | --------------------------------------------- |
| email-smtp-host                  | '' (empty - must be configured)               |
| email-smtp-port                  | 587                                           |
| email-smtp-username              | '' (empty - must be configured)               |
| email-smtp-password              | '' (empty - must be configured)               |
| email-smtp-encryption            | 'tls'                                         |
| email-sender-address             | '' (empty - must be configured)               |
| email-admin-address              | '' (empty - must be configured)               |
| email-template-admin-subject     | 'Nouvelle commande {{order_id}}'              |
| email-template-admin-body        | (see default template below)                  |
| email-template-admin-enabled     | false                                         |
| email-template-purchaser-subject | 'Confirmation de votre commande {{order_id}}' |
| email-template-purchaser-body    | (see default template below)                  |
| email-template-purchaser-enabled | false                                         |

### Default Admin Template Body

```
Nouvelle commande reçue!

Numéro de commande: {{order_id}}
Date: {{order_date}}

Client:
{{customer_firstname}} {{customer_lastname}}
Email: {{customer_email}}
Téléphone: {{customer_phone}}

Produits commandés:
{{products_list}}

Total: {{order_total}}
```

### Default Purchaser Template Body

```
Bonjour {{customer_firstname}},

Merci pour votre commande!

Numéro de commande: {{order_id}}
Date: {{order_date}}

Récapitulatif de votre commande:
{{products_list}}

Total: {{order_total}}

Cordialement,
L'équipe
```
