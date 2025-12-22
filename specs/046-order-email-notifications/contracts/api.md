# API Contracts: Order Email Notifications

**Feature**: 046-order-email-notifications  
**Created**: 2025-12-22  
**API Style**: REST

## Base Path

All endpoints are under `/api/settings/email/`

---

## SMTP Configuration

### GET /api/settings/email/smtp

Get current SMTP configuration (password masked).

**Response 200**:

```json
{
  "host": "smtp.gmail.com",
  "port": 587,
  "username": "notifications@example.com",
  "password": "********",
  "encryptionType": "tls",
  "isConfigured": true
}
```

**Response 401**: Unauthorized (not authenticated as admin)

---

### PUT /api/settings/email/smtp

Update SMTP configuration.

**Request Body**:

```json
{
  "host": "smtp.gmail.com",
  "port": 587,
  "username": "notifications@example.com",
  "password": "app-specific-password",
  "encryptionType": "tls"
}
```

**Response 200**:

```json
{
  "success": true,
  "message": "Configuration SMTP enregistrée"
}
```

**Response 400**: Validation error

```json
{
  "success": false,
  "message": "Port invalide"
}
```

**Response 401**: Unauthorized

---

### POST /api/settings/email/smtp/test

Test SMTP connection by sending a test email.

**Request Body**:

```json
{
  "recipientEmail": "admin@example.com"
}
```

**Response 200**:

```json
{
  "success": true,
  "message": "Email de test envoyé avec succès"
}
```

**Response 400**: SMTP not configured or test failed

```json
{
  "success": false,
  "message": "Échec de connexion SMTP: Connection refused"
}
```

---

## Email Addresses

### GET /api/settings/email/addresses

Get configured email addresses.

**Response 200**:

```json
{
  "senderEmail": "noreply@example.com",
  "administratorEmail": "admin@example.com"
}
```

---

### PUT /api/settings/email/addresses

Update email addresses.

**Request Body**:

```json
{
  "senderEmail": "noreply@example.com",
  "administratorEmail": "admin@example.com"
}
```

**Response 200**:

```json
{
  "success": true,
  "message": "Adresses email enregistrées"
}
```

**Response 400**: Invalid email format

```json
{
  "success": false,
  "message": "Format d'email invalide pour l'adresse d'expédition"
}
```

---

## Email Templates

### GET /api/settings/email/templates

Get all email templates.

**Response 200**:

```json
{
  "admin": {
    "subject": "Nouvelle commande {{order_id}}",
    "body": "Nouvelle commande reçue!\n\nNuméro: {{order_id}}...",
    "enabled": true
  },
  "purchaser": {
    "subject": "Confirmation de votre commande {{order_id}}",
    "body": "Bonjour {{customer_firstname}}...",
    "enabled": true
  }
}
```

---

### PUT /api/settings/email/templates/:type

Update a specific template (type: 'admin' | 'purchaser').

**Request Body**:

```json
{
  "subject": "Nouvelle commande {{order_id}}",
  "body": "Contenu du template...",
  "enabled": true
}
```

**Response 200**:

```json
{
  "success": true,
  "message": "Template enregistré"
}
```

**Response 400**: Validation error (subject too long, body empty, etc.)

---

## Placeholders

### GET /api/settings/email/placeholders

Get list of available placeholders with descriptions.

**Response 200**:

```json
{
  "placeholders": [
    {
      "syntax": "{{order_id}}",
      "description": "Identifiant unique de la commande"
    },
    {
      "syntax": "{{order_date}}",
      "description": "Date et heure de la commande"
    },
    {
      "syntax": "{{order_total}}",
      "description": "Montant total de la commande"
    },
    {
      "syntax": "{{customer_firstname}}",
      "description": "Prénom du client"
    },
    {
      "syntax": "{{customer_lastname}}",
      "description": "Nom du client"
    },
    {
      "syntax": "{{customer_email}}",
      "description": "Adresse email du client"
    },
    {
      "syntax": "{{customer_phone}}",
      "description": "Numéro de téléphone du client"
    },
    {
      "syntax": "{{products_list}}",
      "description": "Liste formatée des produits commandés"
    }
  ]
}
```

---

## Email Logs

### GET /api/settings/email/logs

Get email sending logs (paginated).

**Query Parameters**:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `status`: Filter by status ('sent' | 'failed' | 'all', default: 'all')
- `orderId`: Filter by specific order ID

**Response 200**:

```json
{
  "logs": [
    {
      "id": "log-uuid-123",
      "orderId": "order-uuid-456",
      "type": "admin",
      "recipient": "admin@example.com",
      "subject": "Nouvelle commande ORD-001",
      "status": "sent",
      "errorMessage": null,
      "sentAt": "2025-12-22T10:30:00Z"
    },
    {
      "id": "log-uuid-124",
      "orderId": "order-uuid-456",
      "type": "purchaser",
      "recipient": "customer@example.com",
      "subject": "Confirmation de votre commande ORD-001",
      "status": "failed",
      "errorMessage": "Invalid recipient address",
      "sentAt": "2025-12-22T10:30:01Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

## Configuration Status

### GET /api/settings/email/status

Get overall email configuration status.

**Response 200**:

```json
{
  "smtpConfigured": true,
  "senderConfigured": true,
  "adminAddressConfigured": true,
  "adminNotificationEnabled": true,
  "purchaserNotificationEnabled": false,
  "ready": true
}
```

Note: `ready` is true only if SMTP and sender are configured.

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Description de l'erreur en français",
  "field": "fieldName" // Optional: specific field with error
}
```

---

## Authentication

All endpoints require admin authentication via BetterAuth session.

**Response 401**:

```json
{
  "success": false,
  "message": "Non autorisé"
}
```
