# API Contracts: Order Management

**Feature**: 045-order-management  
**Date**: 2025-12-22  
**Base URL**: `/api`

## Public Endpoints

### POST /api/public/orders

**Description**: Create a new order from shopping cart

**Authentication**: None (public endpoint)

**Request Body**:

```json
{
  "customerFirstName": "string (required)",
  "customerLastName": "string (required)",
  "customerEmail": "string (required, valid email)",
  "customerPhone": "string (required, French format: 10 digits starting with 0)",
  "items": [
    {
      "productId": "string (required)",
      "productName": "string (required)",
      "quantity": "number (required, 1-99)",
      "unitPrice": "number (required, >= 0)"
    }
  ]
}
```

**Response 201 Created**:

```json
{
  "id": "string",
  "customerFirstName": "string",
  "customerLastName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "items": [
    {
      "productId": "string",
      "productName": "string",
      "quantity": "number",
      "unitPrice": "number"
    }
  ],
  "totalPrice": "number",
  "status": "NEW",
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime"
}
```

**Response 400 Bad Request**:

```json
{
  "error": "string (validation error message)"
}
```

**Validation Rules**:

- All fields required
- Email must match standard email format
- Phone must match `/^0[1-9][0-9]{8}$/`
- Items array must have at least 1 item
- Quantity must be between 1 and 99
- Unit price must be >= 0

---

### GET /api/public/orders/[id]

**Description**: Get order details by ID (for thank you page)

**Authentication**: None (public endpoint - order ID acts as access token)

**Path Parameters**:

- `id`: Order ID (string)

**Response 200 OK**:

```json
{
  "id": "string",
  "customerFirstName": "string",
  "customerLastName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "items": [
    {
      "productId": "string",
      "productName": "string",
      "quantity": "number",
      "unitPrice": "number"
    }
  ],
  "totalPrice": "number",
  "status": "NEW | CONFIRMED | COMPLETED",
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime"
}
```

**Response 404 Not Found**:

```json
{
  "error": "Commande non trouvée"
}
```

---

## Admin Endpoints

### GET /api/orders

**Description**: Get all orders for admin management

**Authentication**: Required (BetterAuth session + ADMIN_EMAIL)

**Response 200 OK**:

```json
{
  "orders": [
    {
      "id": "string",
      "customerFirstName": "string",
      "customerLastName": "string",
      "customerEmail": "string",
      "customerPhone": "string",
      "items": [
        {
          "productId": "string",
          "productName": "string",
          "quantity": "number",
          "unitPrice": "number"
        }
      ],
      "totalPrice": "number",
      "status": "NEW | CONFIRMED | COMPLETED",
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ]
}
```

**Response 401 Unauthorized**:

```json
{
  "error": "Non authentifié"
}
```

**Response 403 Forbidden**:

```json
{
  "error": "Accès non autorisé"
}
```

---

### GET /api/orders/[id]

**Description**: Get single order details for admin

**Authentication**: Required (BetterAuth session + ADMIN_EMAIL)

**Path Parameters**:

- `id`: Order ID (string)

**Response 200 OK**:

```json
{
  "id": "string",
  "customerFirstName": "string",
  "customerLastName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "items": [
    {
      "productId": "string",
      "productName": "string",
      "quantity": "number",
      "unitPrice": "number"
    }
  ],
  "totalPrice": "number",
  "status": "NEW | CONFIRMED | COMPLETED",
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime"
}
```

**Response 401 Unauthorized**:

```json
{
  "error": "Non authentifié"
}
```

**Response 403 Forbidden**:

```json
{
  "error": "Accès non autorisé"
}
```

**Response 404 Not Found**:

```json
{
  "error": "Commande non trouvée"
}
```

---

### PATCH /api/orders/[id]/status

**Description**: Update order status

**Authentication**: Required (BetterAuth session + ADMIN_EMAIL)

**Path Parameters**:

- `id`: Order ID (string)

**Request Body**:

```json
{
  "status": "NEW | CONFIRMED | COMPLETED"
}
```

**Response 200 OK**:

```json
{
  "id": "string",
  "customerFirstName": "string",
  "customerLastName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "items": [
    {
      "productId": "string",
      "productName": "string",
      "quantity": "number",
      "unitPrice": "number"
    }
  ],
  "totalPrice": "number",
  "status": "NEW | CONFIRMED | COMPLETED",
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime"
}
```

**Response 400 Bad Request**:

```json
{
  "error": "Statut invalide"
}
```

**Response 401 Unauthorized**:

```json
{
  "error": "Non authentifié"
}
```

**Response 403 Forbidden**:

```json
{
  "error": "Accès non autorisé"
}
```

**Response 404 Not Found**:

```json
{
  "error": "Commande non trouvée"
}
```

---

## Status Values

| API Value | French Display | Description                          |
| --------- | -------------- | ------------------------------------ |
| NEW       | Nouveau        | Initial status when order is created |
| CONFIRMED | Confirmée      | Order confirmed by administrator     |
| COMPLETED | Terminée       | Order fulfilled and completed        |
