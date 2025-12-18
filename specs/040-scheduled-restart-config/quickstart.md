# Quickstart: Scheduled Restart Configuration

**Feature**: 001-scheduled-restart-config  
**Date**: 2025-12-17

## Overview

This feature enables website maintainers to configure automatic daily server restarts at a specified hour. The server uses Docker's restart policy to handle the actual restart.

## Prerequisites

1. Docker with `restart: always` policy configured
2. MongoDB database (existing)
3. Admin authentication (existing)

## Implementation Steps

### Step 1: Install Dependencies

```bash
docker compose run --rm app npm install node-cron
docker compose run --rm app npm install --save-dev @types/node-cron
```

### Step 2: Add Setting Key

Update `src/domain/settings/constants/SettingKeys.ts`:

```typescript
export const VALID_SETTING_KEYS = {
  // ... existing keys
  SCHEDULED_RESTART: 'scheduled-restart',
} as const;
```

### Step 3: Create Value Object

Create `src/domain/config/value-objects/ScheduledRestartConfig.ts` following the pattern in `data-model.md`.

### Step 4: Create Use Cases

Create in `src/application/config/use-cases/`:

- `GetScheduledRestartConfig.ts`
- `UpdateScheduledRestartConfig.ts`

Follow existing patterns from `src/application/settings/`.

### Step 5: Create Scheduler Service

Create `src/infrastructure/config/services/RestartSchedulerService.ts`:

- Initialize on server startup
- Use node-cron for scheduling
- Call `process.exit(0)` at configured hour

### Step 6: Create API Route

Create `src/app/api/admin/scheduled-restart/route.ts`:

- GET: Return current config
- POST: Update config and reschedule

### Step 7: Create Admin UI Component

Create `src/presentation/admin/components/ScheduledRestartConfigForm.tsx`:

- Hour selector (0-23)
- Enable/disable toggle
- Save button with confirmation

### Step 8: Verify Docker Configuration

Ensure `docker-compose.yml` has:

```yaml
services:
  app:
    restart: always
```

## Testing

1. Configure restart hour in admin panel
2. Verify setting persists after page reload
3. Check scheduler logs at configured hour
4. Verify server restarts and comes back online

## Key Files

| File                                                               | Purpose                |
| ------------------------------------------------------------------ | ---------------------- |
| `src/domain/config/value-objects/ScheduledRestartConfig.ts`        | Domain value object    |
| `src/application/config/use-cases/GetScheduledRestartConfig.ts`    | Get config use case    |
| `src/application/config/use-cases/UpdateScheduledRestartConfig.ts` | Update config use case |
| `src/infrastructure/config/services/RestartSchedulerService.ts`    | Cron scheduler         |
| `src/app/api/admin/scheduled-restart/route.ts`                     | API endpoint           |
| `src/presentation/admin/components/ScheduledRestartConfigForm.tsx` | Admin UI               |
