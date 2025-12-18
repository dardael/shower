# API Contract: Scheduled Restart Configuration

**Feature**: 001-scheduled-restart-config  
**Date**: 2025-12-17  
**Base Path**: `/api/admin/scheduled-restart`

## Endpoints

### GET /api/admin/scheduled-restart

Retrieve the current scheduled restart configuration.

**Authentication**: Required (Admin only)

**Response**:

```json
// 200 OK
{
  "enabled": true,
  "restartHour": 3
}

// 401 Unauthorized
{
  "error": "Authentication required"
}
```

**Headers**:

- `ETag`: Hash of configuration for caching

---

### POST /api/admin/scheduled-restart

Update the scheduled restart configuration.

**Authentication**: Required (Admin only)

**Request Body**:

```json
{
  "enabled": true,
  "restartHour": 3
}
```

| Field       | Type    | Required | Constraints  |
| ----------- | ------- | -------- | ------------ |
| enabled     | boolean | Yes      | -            |
| restartHour | number  | Yes      | Integer 0-23 |

**Response**:

```json
// 200 OK
{
  "enabled": true,
  "restartHour": 3
}

// 400 Bad Request
{
  "error": "Invalid restart hour. Must be between 0 and 23."
}

// 401 Unauthorized
{
  "error": "Authentication required"
}
```

**Headers**:

- `Cache-Control: no-cache, no-store, must-revalidate`

---

## Error Codes

| HTTP Status | Error                   | Description                   |
| ----------- | ----------------------- | ----------------------------- |
| 400         | Invalid restart hour    | restartHour not in 0-23 range |
| 400         | Invalid configuration   | Missing or invalid fields     |
| 401         | Authentication required | User not authenticated        |
| 403         | Forbidden               | User not authorized as admin  |
| 500         | Internal server error   | Server-side error             |

## Validation Rules

1. `enabled` must be a boolean
2. `restartHour` must be an integer between 0 and 23 (inclusive)
3. Both fields are required for POST requests

## Side Effects

When configuration is updated via POST:

1. The scheduler service reschedules the cron job with the new hour
2. If disabled, the existing scheduled job is stopped
3. If enabled, a new scheduled job is created for the configured hour
