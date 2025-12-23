# Quickstart: Database Backup Configuration

**Feature**: 047-database-backup  
**Branch**: `47-database-backup`

## Prerequisites

- MongoDB running and accessible via `MONGODB_URI` in `.env.local`
- `mongodump` and `mongorestore` binaries available in PATH (included in MongoDB tools)
- Docker environment configured (for development)

## Setup Steps

### 1. Verify MongoDB Tools

```bash
# Check mongodump/mongorestore are available
docker compose run --rm app which mongodump
docker compose run --rm app which mongorestore
```

If not available, add to Dockerfile:

```dockerfile
RUN apt-get update && apt-get install -y mongodb-database-tools
```

### 2. Create Backup Directory

```bash
mkdir -p temp/backups
chmod 755 temp/backups
```

### 3. Environment Variables

Ensure `.env.local` contains:

```
MONGODB_URI=mongodb://user:password@host:27017/database
```

## Development Workflow

### Run Development Server

```bash
docker compose up app
```

### Run Tests

```bash
# Unit tests only
docker compose run --rm app npm run test -- --testPathPattern="backup"

# Integration tests
docker compose run --rm app npm run test -- --testPathPattern="backup.*integration"
```

### Access Admin Panel

Navigate to: `http://localhost:3000/admin/maintenance`

## API Endpoints

| Endpoint                    | Method | Description            |
| --------------------------- | ------ | ---------------------- |
| `/api/backup/configuration` | GET    | Get backup settings    |
| `/api/backup/configuration` | PUT    | Update backup settings |
| `/api/backup/list`          | GET    | List all backups       |
| `/api/backup/create`        | POST   | Create manual backup   |
| `/api/backup/restore/{id}`  | POST   | Restore from backup    |
| `/api/backup/{id}`          | DELETE | Delete a backup        |

## Key Files

### Domain Layer

- `src/domain/backup/entities/BackupConfiguration.ts`
- `src/domain/backup/entities/DatabaseBackup.ts`
- `src/domain/backup/ports/IBackupConfigurationRepository.ts`
- `src/domain/backup/ports/IDatabaseBackupService.ts`

### Application Layer

- `src/application/backup/use-cases/GetBackupConfiguration.ts`
- `src/application/backup/use-cases/UpdateBackupConfiguration.ts`
- `src/application/backup/use-cases/CreateDatabaseBackup.ts`
- `src/application/backup/use-cases/ListDatabaseBackups.ts`
- `src/application/backup/use-cases/RestoreDatabaseBackup.ts`
- `src/application/backup/use-cases/DeleteDatabaseBackup.ts`
- `src/application/backup/services/BackupSchedulerService.ts`

### Infrastructure Layer

- `src/infrastructure/backup/adapters/MongoBackupConfigurationRepository.ts`
- `src/infrastructure/backup/adapters/MongoDumpBackupService.ts`
- `src/infrastructure/backup/models/BackupConfigurationModel.ts`
- `src/infrastructure/backup/models/DatabaseBackupModel.ts`

### Presentation Layer

- `src/app/admin/maintenance/page.tsx` (modified)
- `src/presentation/admin/components/BackupConfigurationForm.tsx`
- `src/presentation/admin/hooks/useBackupConfiguration.ts`

### API Routes

- `src/app/api/backup/configuration/route.ts`
- `src/app/api/backup/list/route.ts`
- `src/app/api/backup/create/route.ts`
- `src/app/api/backup/restore/[id]/route.ts`
- `src/app/api/backup/[id]/route.ts`

## Testing Checklist

- [ ] Enable/disable backup toggle works
- [ ] Hour selection saves correctly (0-23)
- [ ] Retention count saves correctly (1-30)
- [ ] Backup list displays with timestamps
- [ ] Manual backup creates new entry
- [ ] Restore shows confirmation dialog
- [ ] Restore replaces database content
- [ ] Delete removes backup from list
- [ ] Scheduled backup triggers at configured hour
- [ ] Oldest backup auto-deleted when exceeding retention
