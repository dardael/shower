# API Contracts: Database Backup Configuration

**Feature**: 047-database-backup  
**Date**: 2025-12-22  
**Base Path**: `/api/backup`

## Endpoints Overview

| Method | Path                      | Description                 |
| ------ | ------------------------- | --------------------------- |
| GET    | /api/backup/configuration | Get backup configuration    |
| PUT    | /api/backup/configuration | Update backup configuration |
| GET    | /api/backup/list          | List all backups            |
| POST   | /api/backup/create        | Create manual backup        |
| POST   | /api/backup/restore/{id}  | Restore from backup         |
| DELETE | /api/backup/{id}          | Delete a backup             |

---

## GET /api/backup/configuration

Get the current backup configuration settings.

### Response

**Status**: 200 OK

```json
{
  "enabled": true,
  "scheduledHour": 3,
  "retentionCount": 7,
  "timezone": "Europe/Paris",
  "lastBackupAt": "2025-12-22T03:00:00.000Z"
}
```

**Status**: 401 Unauthorized - Not authenticated as admin

---

## PUT /api/backup/configuration

Update backup configuration settings.

### Request Body

```json
{
  "enabled": true,
  "scheduledHour": 3,
  "retentionCount": 7,
  "timezone": "Europe/Paris"
}
```

| Field          | Type    | Required | Constraints         |
| -------------- | ------- | -------- | ------------------- |
| enabled        | boolean | Yes      | -                   |
| scheduledHour  | number  | Yes      | 0-23                |
| retentionCount | number  | Yes      | 1-30                |
| timezone       | string  | Yes      | Valid IANA timezone |

### Response

**Status**: 200 OK

```json
{
  "enabled": true,
  "scheduledHour": 3,
  "retentionCount": 7,
  "timezone": "Europe/Paris",
  "lastBackupAt": "2025-12-22T03:00:00.000Z"
}
```

**Status**: 400 Bad Request - Invalid parameters

```json
{
  "error": "scheduledHour must be between 0 and 23"
}
```

**Status**: 401 Unauthorized - Not authenticated as admin

---

## GET /api/backup/list

List all available database backups.

### Response

**Status**: 200 OK

```json
{
  "backups": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2025-12-22T03:00:00.000Z",
      "sizeBytes": 1048576,
      "status": "completed"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "createdAt": "2025-12-21T03:00:00.000Z",
      "sizeBytes": 1024000,
      "status": "completed"
    }
  ]
}
```

**Notes**:

- Backups are sorted by `createdAt` descending (most recent first)
- `filePath` is not exposed to the client for security

**Status**: 401 Unauthorized - Not authenticated as admin

---

## POST /api/backup/create

Create a new database backup immediately (manual backup).

### Request Body

None required.

### Response

**Status**: 201 Created

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "createdAt": "2025-12-22T14:30:00.000Z",
  "sizeBytes": 1050000,
  "status": "completed"
}
```

**Status**: 409 Conflict - Backup already in progress

```json
{
  "error": "Une sauvegarde est déjà en cours"
}
```

**Status**: 500 Internal Server Error - Backup failed

```json
{
  "error": "La sauvegarde a échoué: [details]"
}
```

**Status**: 401 Unauthorized - Not authenticated as admin

---

## POST /api/backup/restore/{id}

Restore the database from a specific backup.

### Path Parameters

| Parameter | Type          | Description          |
| --------- | ------------- | -------------------- |
| id        | string (UUID) | Backup ID to restore |

### Request Body

None required.

### Response

**Status**: 200 OK

```json
{
  "success": true,
  "restoredFrom": "550e8400-e29b-41d4-a716-446655440000",
  "restoredAt": "2025-12-22T14:35:00.000Z"
}
```

**Status**: 404 Not Found - Backup not found

```json
{
  "error": "Sauvegarde introuvable"
}
```

**Status**: 409 Conflict - Restore already in progress

```json
{
  "error": "Une restauration est déjà en cours"
}
```

**Status**: 422 Unprocessable Entity - Backup is not restorable (failed status)

```json
{
  "error": "Cette sauvegarde ne peut pas être restaurée (statut: failed)"
}
```

**Status**: 500 Internal Server Error - Restore failed

```json
{
  "error": "La restauration a échoué: [details]"
}
```

**Status**: 401 Unauthorized - Not authenticated as admin

---

## DELETE /api/backup/{id}

Delete a specific backup and its associated file.

### Path Parameters

| Parameter | Type          | Description         |
| --------- | ------------- | ------------------- |
| id        | string (UUID) | Backup ID to delete |

### Response

**Status**: 204 No Content

**Status**: 404 Not Found - Backup not found

```json
{
  "error": "Sauvegarde introuvable"
}
```

**Status**: 401 Unauthorized - Not authenticated as admin

---

## Common Error Responses

All endpoints may return:

**Status**: 401 Unauthorized

```json
{
  "error": "Authentification requise"
}
```

**Status**: 500 Internal Server Error

```json
{
  "error": "Erreur interne du serveur"
}
```

## Authentication

All endpoints require admin authentication via the existing BetterAuth session mechanism. Requests without valid admin session receive 401 Unauthorized.
