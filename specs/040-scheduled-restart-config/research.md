# Research: Scheduled Restart Configuration

**Feature**: 001-scheduled-restart-config  
**Date**: 2025-12-17

## Research Questions

### 1. Scheduling Mechanism for Hourly Checks

**Decision**: Use `node-cron` library for scheduling

**Rationale**:

- Familiar cron syntax (`0 {hour} * * *` for specific hour)
- Lightweight with minimal dependencies (~1-2MB memory footprint)
- Production-ready and widely used
- Built-in timezone support
- Simple API that integrates well with Next.js
- TypeScript support via `@types/node-cron`

**Alternatives Considered**:

| Option               | Pros                              | Cons                                                         | Why Not Chosen                            |
| -------------------- | --------------------------------- | ------------------------------------------------------------ | ----------------------------------------- |
| node-schedule        | Flexible scheduling, date-based   | Heavier (~3-5MB), complex API                                | Overkill for simple hourly scheduling     |
| Built-in setInterval | Zero dependencies, minimal memory | No cron syntax, manual drift correction, no timezone support | Too error-prone for production scheduling |
| Croner               | Zero deps, TypeScript built-in    | Less battle-tested, newer library                            | Prefer widely-used solution               |

**Implementation Pattern**:

```typescript
import * as cron from 'node-cron';

// Schedule restart at specific hour (e.g., 3 AM)
cron.schedule(
  `0 ${configuredHour} * * *`,
  async () => {
    await triggerGracefulRestart();
  },
  { timezone: 'UTC' }
);
```

---

### 2. Server Restart Mechanism in Docker

**Decision**: Use `process.exit(0)` with Docker `restart: always` policy

**Rationale**:

- Simplest implementation with minimal code changes
- Uses Docker's mature, built-in restart mechanism
- No additional dependencies required
- Predictable and reliable behavior
- Next.js handles SIGTERM gracefully by default
- Brief downtime (5-10 seconds) acceptable for daily maintenance

**Alternatives Considered**:

| Option                  | Pros                              | Cons                                              | Why Not Chosen                                          |
| ----------------------- | --------------------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| PM2 restart             | Zero-downtime, process management | Additional dependency, complex setup              | Overkill for daily restart; adds operational complexity |
| Docker API              | Controlled restart, monitoring    | Security concerns (Docker socket access), complex | Unnecessary complexity for this use case                |
| SIGTERM/SIGUSR2 signals | Custom shutdown logic             | Complex to implement correctly                    | Same result as process.exit but harder to get right     |

**Implementation Pattern**:

```typescript
// In scheduler service
function triggerGracefulRestart(): void {
  logger.info('Initiating scheduled server restart...');
  // Give time for logging before exit
  setTimeout(() => {
    process.exit(0);
  }, 1000);
}
```

**Docker Configuration Required**:

```yaml
# docker-compose.yml
services:
  app:
    restart: always
    # ... rest of config
```

---

### 3. Settings Infrastructure Pattern

**Decision**: Follow existing WebsiteSetting pattern with MongoDB key-value storage

**Rationale**:

- Consistent with existing codebase patterns
- Reuses proven infrastructure (repository, use cases, API routes)
- Integrates with existing export/import system
- Type-safe with value objects and validation

**Key Patterns Identified**:

1. **Domain Entity**: Use `VALID_SETTING_KEYS` constant for new setting key
2. **Value Object**: Create `ScheduledRestartConfig` value object with validation
3. **Repository**: Reuse existing `MongooseWebsiteSettingsRepository` with `getByKey`/`setByKey`
4. **Use Cases**: Create `GetScheduledRestartConfig` and `UpdateScheduledRestartConfig`
5. **API Route**: Add `/api/admin/scheduled-restart` with GET/POST
6. **Context**: Create `ScheduledRestartContext` for React state management

**Setting Key**: `scheduled-restart`

**Setting Value Structure**:

```typescript
interface ScheduledRestartConfigValue {
  enabled: boolean;
  restartHour: number; // 0-23
}
```

---

## Technical Decisions Summary

| Decision                 | Choice                           | Key Reason                        |
| ------------------------ | -------------------------------- | --------------------------------- |
| Scheduling library       | node-cron                        | Simple, lightweight, cron syntax  |
| Restart mechanism        | process.exit(0) + Docker restart | Simplest, uses Docker built-in    |
| Settings storage         | Existing MongoDB key-value       | Consistent with codebase patterns |
| Scheduler initialization | Infrastructure service singleton | Runs on server startup            |

## Dependencies to Add

- `node-cron`: ^3.0.3
- `@types/node-cron`: ^3.0.11 (devDependency)

## Risks and Mitigations

| Risk                                      | Mitigation                                                    |
| ----------------------------------------- | ------------------------------------------------------------- |
| Scheduler not starting on server boot     | Initialize scheduler in infrastructure layer on app startup   |
| Multiple scheduler instances (hot reload) | Use singleton pattern with guard against duplicate scheduling |
| Server down during scheduled time         | No retroactive restart (by design per spec)                   |
| Configuration not persisting              | Use existing proven MongoDB settings infrastructure           |
