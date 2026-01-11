# API Contracts: Appointment Booking System

**Feature**: 052-appointment-booking  
**Date**: 2026-01-10

## Base URL

All endpoints are relative to `/api/appointments`

---

## Activities

### GET /api/appointments/activities

Get all activities.

**Authentication**: Admin only

**Response 200**:

```json
{
  "activities": [
    {
      "id": "string",
      "name": "string",
      "description": "string | null",
      "durationMinutes": "number",
      "color": "string",
      "price": "number",
      "requiredFields": {
        "phone": "boolean",
        "address": "boolean",
        "customField": "boolean",
        "customFieldLabel": "string | null"
      },
      "reminderSettings": {
        "enabled": "boolean",
        "hoursBefore": "number | null"
      },
      "minimumBookingNoticeHours": "number"
    }
  ]
}
```

### GET /api/appointments/activities/public

Get activities available for public booking.

**Authentication**: None (public)

**Query Parameters**:

- `ids` (optional): Comma-separated activity IDs to filter

**Response 200**:

```json
{
  "activities": [
    {
      "id": "string",
      "name": "string",
      "description": "string | null",
      "durationMinutes": "number",
      "color": "string",
      "price": "number",
      "requiredFields": {
        "phone": "boolean",
        "address": "boolean",
        "customField": "boolean",
        "customFieldLabel": "string | null"
      },
      "minimumBookingNoticeHours": "number"
    }
  ]
}
```

### POST /api/appointments/activities

Create a new activity.

**Authentication**: Admin only

**Request Body**:

```json
{
  "name": "string",
  "description": "string | null",
  "durationMinutes": "number",
  "color": "string",
  "price": "number",
  "requiredFields": {
    "phone": "boolean",
    "address": "boolean",
    "customField": "boolean",
    "customFieldLabel": "string | null"
  },
  "reminderSettings": {
    "enabled": "boolean",
    "hoursBefore": "number | null"
  },
  "minimumBookingNoticeHours": "number"
}
```

**Response 201**:

```json
{
  "activity": {
    /* Activity object */
  }
}
```

### PUT /api/appointments/activities/[id]

Update an existing activity.

**Authentication**: Admin only

**Request Body**: Same as POST

**Response 200**:

```json
{
  "activity": {
    /* Activity object */
  }
}
```

### DELETE /api/appointments/activities/[id]

Delete an activity.

**Authentication**: Admin only

**Response 204**: No content

---

## Availability

### GET /api/appointments/availability

Get availability configuration.

**Authentication**: Admin only

**Response 200**:

```json
{
  "availability": {
    "weeklySlots": [
      {
        "dayOfWeek": "number",
        "startTime": "string",
        "endTime": "string"
      }
    ],
    "exceptions": [
      {
        "date": "string (ISO 8601)",
        "reason": "string | null"
      }
    ]
  }
}
```

### PUT /api/appointments/availability

Update availability configuration.

**Authentication**: Admin only

**Request Body**:

```json
{
  "weeklySlots": [
    {
      "dayOfWeek": "number",
      "startTime": "string",
      "endTime": "string"
    }
  ],
  "exceptions": [
    {
      "date": "string (ISO 8601)",
      "reason": "string | null"
    }
  ]
}
```

**Response 200**:

```json
{
  "availability": {
    /* Availability object */
  }
}
```

### GET /api/appointments/availability/slots

Get available time slots for booking.

**Authentication**: None (public)

**Query Parameters**:

- `activityId` (required): Activity ID to check availability for
- `startDate` (required): Start of date range (ISO 8601)
- `endDate` (required): End of date range (ISO 8601)

**Response 200**:

```json
{
  "slots": [
    {
      "dateTime": "string (ISO 8601)",
      "available": "boolean"
    }
  ]
}
```

---

## Appointments

### GET /api/appointments

Get all appointments.

**Authentication**: Admin only

**Query Parameters**:

- `status` (optional): Filter by status (pending, confirmed, cancelled)
- `startDate` (optional): Filter by date range start
- `endDate` (optional): Filter by date range end

**Response 200**:

```json
{
  "appointments": [
    {
      "id": "string",
      "activityId": "string",
      "activityName": "string",
      "activityDurationMinutes": "number",
      "activityColor": "string",
      "dateTime": "string (ISO 8601)",
      "status": "pending | confirmed | cancelled",
      "clientInfo": {
        "name": "string",
        "email": "string",
        "phone": "string | null",
        "address": "string | null",
        "customFieldValue": "string | null"
      },
      "createdAt": "string (ISO 8601)"
    }
  ]
}
```

### GET /api/appointments/[id]

Get a single appointment.

**Authentication**: Admin only

**Response 200**:

```json
{
  "appointment": {
    /* Appointment object */
  }
}
```

### POST /api/appointments

Create a new appointment (public booking).

**Authentication**: None (public)

**Request Body**:

```json
{
  "activityId": "string",
  "dateTime": "string (ISO 8601)",
  "clientInfo": {
    "name": "string",
    "email": "string",
    "phone": "string | null",
    "address": "string | null",
    "customFieldValue": "string | null"
  }
}
```

**Response 201**:

```json
{
  "appointment": {
    /* Appointment object */
  },
  "message": "Rendez-vous créé avec succès"
}
```

**Response 409** (Conflict - slot already booked):

```json
{
  "error": "Ce créneau n'est plus disponible",
  "code": "SLOT_UNAVAILABLE"
}
```

### PATCH /api/appointments/[id]/status

Update appointment status.

**Authentication**: Admin only

**Request Body**:

```json
{
  "status": "confirmed | cancelled"
}
```

**Response 200**:

```json
{
  "appointment": {
    /* Appointment object */
  }
}
```

### DELETE /api/appointments/[id]

Delete an appointment.

**Authentication**: Admin only

**Response 204**: No content

---

## Module Settings

### GET /api/settings/appointment-module

Get appointment module enabled status.

**Authentication**: None (public - for conditional rendering)

**Response 200**:

```json
{
  "enabled": "boolean"
}
```

### PUT /api/settings/appointment-module

Update appointment module enabled status.

**Authentication**: Admin only

**Request Body**:

```json
{
  "enabled": "boolean"
}
```

**Response 200**:

```json
{
  "enabled": "boolean"
}
```

---

## Calendar Events (Admin)

### GET /api/appointments/calendar

Get calendar events for admin view (availability + appointments).

**Authentication**: Admin only

**Query Parameters**:

- `startDate` (required): Start of date range (ISO 8601)
- `endDate` (required): End of date range (ISO 8601)

**Response 200**:

```json
{
  "events": [
    {
      "id": "string",
      "title": "string",
      "start": "string (ISO 8601)",
      "end": "string (ISO 8601)",
      "color": "string",
      "type": "availability | appointment",
      "status": "pending | confirmed | cancelled | null",
      "extendedProps": {
        "appointmentId": "string | null",
        "activityId": "string | null",
        "clientName": "string | null"
      }
    }
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

**401 Unauthorized**:

```json
{
  "error": "Non autorisé"
}
```

**403 Forbidden**:

```json
{
  "error": "Accès interdit"
}
```

**404 Not Found**:

```json
{
  "error": "Ressource non trouvée"
}
```

**422 Validation Error**:

```json
{
  "error": "Données invalides",
  "details": {
    "field": "Message d'erreur"
  }
}
```

**500 Internal Server Error**:

```json
{
  "error": "Erreur serveur"
}
```
