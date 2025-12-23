# Research: Database Backup Configuration

**Feature**: 047-database-backup  
**Date**: 2025-12-22

## Research Questions & Findings

### 1. MongoDB Backup Strategy

**Decision**: Use `mongodump` and `mongorestore` CLI tools via Node.js child_process

**Rationale**:

- Standard MongoDB backup tools, reliable and well-documented
- Produce BSON files that preserve all data types exactly
- Can backup/restore entire database with single command
- Available in MongoDB Docker container (already used by project)

**Alternatives Considered**:

- Mongoose-level document export (JSON): Rejected - loses BSON type information, more complex for full DB backup
- MongoDB Atlas Backup: N/A - project uses self-hosted MongoDB

**Implementation Notes**:

- Use `child_process.exec()` to run mongodump/mongorestore
- Parse MONGODB_URI to extract connection details for CLI
- Store dump in `temp/backups/{backupId}/` directory, then ZIP for storage

### 2. Scheduler Implementation

**Decision**: Use existing `node-cron` pattern from ScheduledRestartConfig

**Rationale**:

- Already implemented and working in the codebase
- Follows established patterns (NodeCronRestartScheduler.ts)
- Prevents duplicate jobs during hot-reload with shared state

**Alternatives Considered**:

- setInterval: Rejected - not reliable for daily tasks, drift issues
- External cron service: Rejected - adds complexity, YAGNI

**Reference Files**:

- `/src/infrastructure/config/services/NodeCronRestartScheduler.ts`
- Cron expression: `"0 {hour} * * *"` for daily execution

### 3. Backup Storage Location

**Decision**: Store backups in `temp/backups/` directory as ZIP files

**Rationale**:

- Follows existing pattern from BackupService.ts
- ZIP compression reduces storage footprint
- Single file per backup simplifies management
- `temp/` directory is gitignored, prevents accidental commits

**Alternatives Considered**:

- Store in database (GridFS): Rejected - adds complexity, backups should be separate from DB
- Cloud storage (S3): Rejected - YAGNI for current scope

### 4. Configuration Storage

**Decision**: Store backup configuration in MongoDB using existing settings pattern

**Rationale**:

- Consistent with other configuration (scheduled restart, theme, etc.)
- Follows existing repository pattern
- Included in configuration export/import automatically

**Model Structure**:

```typescript
BackupConfiguration {
  enabled: boolean
  scheduledHour: number (0-23)
  retentionCount: number (1-30)
  timezone: string
  lastBackupAt?: Date
}
```

### 5. Backup Metadata Storage

**Decision**: Store backup records in MongoDB collection

**Rationale**:

- Need to track backup history, timestamps, file paths
- Allows querying for available backups
- Survives server restarts

**Model Structure**:

```typescript
DatabaseBackup {
  id: string (UUID)
  createdAt: Date
  filePath: string
  sizeBytes: number
  status: 'completed' | 'failed'
  error?: string
}
```

### 6. Restore Operation Safety

**Decision**: Implement 2-step confirmation with clear warning messages

**Rationale**:

- Restore is destructive operation (replaces current data)
- User must explicitly confirm to prevent accidents
- Show backup date/time in confirmation dialog

**UX Flow**:

1. User clicks "Restaurer" button on backup row
2. Confirmation modal appears with warning text
3. User must click "Confirmer la restauration" to proceed
4. Loading state during restore, success/error toast on completion

### 7. Concurrent Operation Handling

**Decision**: Disable backup/restore buttons during any operation in progress

**Rationale**:

- Prevents conflicting operations
- Simple mutex-like behavior via React state
- KISS principle - no complex locking mechanism needed

### 8. Export/Import Integration

**Decision**: Include BackupConfiguration in configuration export, exclude actual backup files

**Rationale**:

- Configuration (schedule, retention) should be portable
- Actual database backups are environment-specific, shouldn't be exported
- Follows Configuration Portability constitution principle

## Dependencies Summary

| Dependency    | Version          | Purpose                        |
| ------------- | ---------------- | ------------------------------ |
| node-cron     | existing         | Scheduling daily backups       |
| archiver      | existing         | Creating ZIP files             |
| child_process | Node.js built-in | Running mongodump/mongorestore |
| uuid          | existing         | Generating backup IDs          |

## Risk Assessment

| Risk                                 | Mitigation                                   |
| ------------------------------------ | -------------------------------------------- |
| mongodump not available in container | Verify MongoDB tools installed in Dockerfile |
| Backup takes too long                | Add timeout, background execution            |
| Disk space exhaustion                | Retention limit enforces cleanup             |
| Restore fails mid-operation          | mongorestore is atomic per collection        |

## Open Questions - RESOLVED

All technical questions have been resolved through codebase research. No clarification needed.
