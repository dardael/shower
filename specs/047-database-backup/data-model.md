# Data Model: Database Backup Configuration

**Feature**: 047-database-backup  
**Date**: 2025-12-22

## Entities

### BackupConfiguration

Represents the backup scheduling settings for the application.

| Field          | Type    | Constraints                | Description                                    |
| -------------- | ------- | -------------------------- | ---------------------------------------------- |
| enabled        | boolean | Required, default: false   | Whether scheduled backups are active           |
| scheduledHour  | number  | Required, 0-23, default: 3 | Hour of day for daily backup (24h format)      |
| retentionCount | number  | Required, 1-30, default: 7 | Maximum number of backups to keep              |
| timezone       | string  | Required                   | Timezone for scheduling (e.g., "Europe/Paris") |
| lastBackupAt   | Date    | Optional                   | Timestamp of most recent backup                |

**Business Rules**:

- When `enabled` is false, no automatic backups are created
- When a new backup would exceed `retentionCount`, oldest backup is deleted first
- `scheduledHour` is interpreted in the configured `timezone`
- Manual backups still work when `enabled` is false

**Validation Rules**:

- `scheduledHour` must be integer between 0 and 23 inclusive
- `retentionCount` must be integer between 1 and 30 inclusive
- `timezone` must be valid IANA timezone string

---

### DatabaseBackup

Represents a single database backup record.

| Field     | Type   | Constraints                       | Description                         |
| --------- | ------ | --------------------------------- | ----------------------------------- |
| id        | string | Required, UUID                    | Unique backup identifier            |
| createdAt | Date   | Required                          | When the backup was created         |
| filePath  | string | Required                          | Path to backup ZIP file             |
| sizeBytes | number | Required, >= 0                    | Size of backup file in bytes        |
| status    | enum   | Required, 'completed' \| 'failed' | Backup operation result             |
| error     | string | Optional                          | Error message if status is 'failed' |

**Business Rules**:

- Only backups with `status: 'completed'` can be restored
- Failed backups are kept for diagnostic purposes but count toward retention limit
- When a backup is deleted, its file is also removed from filesystem

**Validation Rules**:

- `id` must be valid UUID v4 format
- `filePath` must be non-empty string
- `sizeBytes` must be non-negative integer

---

## Relationships

```
BackupConfiguration (1) -----> (0..n) DatabaseBackup
                         manages
```

- BackupConfiguration controls how many DatabaseBackup records are retained
- No direct foreign key - relationship managed by application logic

## State Transitions

### BackupConfiguration States

```
Disabled ──(enable)──> Enabled
    │                     │
    │<──(disable)─────────│
```

### DatabaseBackup Lifecycle

```
[Created] ──(backup starts)──> [In Progress] ──(success)──> [Completed]
                                     │
                                     └──(failure)──> [Failed]

[Completed/Failed] ──(retention exceeded or manual delete)──> [Deleted]
```

## Indexes

### DatabaseBackup Collection

- `createdAt`: Descending (for listing most recent first)
- `status`: For filtering completed backups for restore

## Data Migration

No migration needed - new entities with no existing data.

## Export/Import Considerations

- **BackupConfiguration**: Included in configuration export
- **DatabaseBackup records**: NOT exported (environment-specific)
- **Backup files**: NOT exported (too large, environment-specific)
