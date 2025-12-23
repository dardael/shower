# Feature Specification: Database Backup Configuration

**Feature Branch**: `047-database-backup`  
**Created**: 2025-12-22  
**Status**: Draft  
**Input**: As an administrator, I want to enable and configure an hour when every day, a save of the database is done. I want to configure the number of saves kept in memory. And I want to choose one of these saves to load it. I want this in the existing maintenance tab.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Enable and Configure Daily Backups (Priority: P1)

As an administrator, I want to enable scheduled daily database backups and configure the time when they occur, so that my website data is automatically protected without manual intervention.

**Why this priority**: This is the core value proposition - automatic data protection. Without this, the feature has no purpose.

**Independent Test**: Can be fully tested by enabling backups, setting a time, and verifying that a backup is created at the configured hour. Delivers automatic data protection.

**Acceptance Scenarios**:

1. **Given** I am on the maintenance tab, **When** I enable database backups, **Then** the backup configuration options become visible
2. **Given** backups are enabled, **When** I set the backup hour to 3 (3:00 AM), **Then** the system saves this configuration and displays "Sauvegarde programmée à 03h00"
3. **Given** backups are enabled and configured for 3:00 AM, **When** the clock reaches 3:00 AM, **Then** a new backup is automatically created
4. **Given** I am configuring the backup time, **When** I view the time selector, **Then** I can choose any hour from 0 to 23 (24-hour format)

---

### User Story 2 - Configure Backup Retention (Priority: P2)

As an administrator, I want to configure how many backups are kept, so that I can balance storage usage with historical data availability.

**Why this priority**: Essential for managing storage and ensuring older backups are automatically cleaned up. Depends on P1 being functional.

**Independent Test**: Can be tested by setting a retention limit of 3, creating 4 backups, and verifying only the 3 most recent remain.

**Acceptance Scenarios**:

1. **Given** backups are enabled, **When** I set the retention count to 5, **Then** the system saves this configuration
2. **Given** retention is set to 3 and there are already 3 backups, **When** a new backup is created, **Then** the oldest backup is automatically deleted
3. **Given** I am configuring retention, **When** I view the retention input, **Then** I can set a value between 1 and 30

---

### User Story 3 - View Available Backups (Priority: P2)

As an administrator, I want to see a list of all available backups with their creation dates, so that I can choose which backup to restore if needed.

**Why this priority**: Necessary for the restore functionality and provides visibility into backup status. Same priority as retention since they work together.

**Independent Test**: Can be tested by creating several backups and verifying they appear in the list with correct timestamps.

**Acceptance Scenarios**:

1. **Given** there are 3 backups available, **When** I view the backup section, **Then** I see a list showing all 3 backups with their creation date and time
2. **Given** there are no backups yet, **When** I view the backup section, **Then** I see a message indicating "Aucune sauvegarde disponible"
3. **Given** backups exist, **When** I view the list, **Then** backups are sorted with the most recent first

---

### User Story 4 - Restore from Backup (Priority: P3)

As an administrator, I want to select a backup and restore the database to that state, so that I can recover from data loss or unwanted changes.

**Why this priority**: This is the disaster recovery capability. While critical for emergencies, it's less frequently used than backup creation.

**Independent Test**: Can be tested by creating content, making a backup, modifying content, restoring, and verifying the content returns to the backed-up state.

**Acceptance Scenarios**:

1. **Given** I am viewing the backup list, **When** I select a backup and click "Restaurer", **Then** I see a confirmation dialog warning that current data will be replaced
2. **Given** I confirm the restore action, **When** the restore completes, **Then** the database reflects the state at the time of the selected backup
3. **Given** I am about to restore, **When** I see the confirmation dialog, **Then** I can cancel the action and return to the backup list
4. **Given** a restore is in progress, **When** I view the interface, **Then** I see a loading indicator and cannot trigger additional actions

---

### User Story 5 - Create Manual Backup (Priority: P3)

As an administrator, I want to manually trigger a backup at any time, so that I can create a save point before making significant changes.

**Why this priority**: Nice-to-have feature that complements scheduled backups. Lower priority since scheduled backups handle most use cases.

**Independent Test**: Can be tested by clicking the manual backup button and verifying a new backup appears in the list immediately.

**Acceptance Scenarios**:

1. **Given** I am on the maintenance tab, **When** I click "Créer une sauvegarde maintenant", **Then** a new backup is created immediately
2. **Given** I triggered a manual backup, **When** the backup completes, **Then** it appears in the backup list with the current timestamp
3. **Given** a manual backup is in progress, **When** I view the button, **Then** it shows a loading state and is disabled

---

### Edge Cases

- What happens when the backup process fails (disk full, database error)? System displays an error message and logs the failure. Previous backups remain unaffected.
- What happens if the administrator tries to restore while a backup is in progress? The restore button is disabled until the backup completes.
- What happens if the configured backup hour passes while the server is down? The missed backup is skipped; the next backup occurs at the scheduled time the following day.
- What happens if the administrator disables backups while backups exist? Existing backups are preserved but no new automatic backups are created. Manual backups remain possible.
- What happens if the retention count is reduced below the current number of backups? Oldest backups are deleted immediately to match the new limit.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow administrators to enable or disable scheduled daily database backups
- **FR-002**: System MUST allow administrators to configure the hour (0-23) when daily backups occur
- **FR-003**: System MUST automatically create a database backup at the configured hour each day when backups are enabled
- **FR-004**: System MUST allow administrators to configure the maximum number of backups to retain (1-30)
- **FR-005**: System MUST automatically delete the oldest backup when creating a new one would exceed the retention limit
- **FR-006**: System MUST display a list of all available backups with their creation timestamps
- **FR-007**: System MUST allow administrators to select and restore any available backup
- **FR-008**: System MUST show a confirmation dialog before performing a restore operation
- **FR-009**: System MUST allow administrators to manually trigger an immediate backup
- **FR-010**: System MUST display the user's timezone when showing backup configuration
- **FR-011**: System MUST provide visual feedback (loading states) during backup and restore operations
- **FR-012**: System MUST display appropriate error messages when backup or restore operations fail
- **FR-013**: System MUST ensure proper contrast ratios for text and UI elements in both light and dark modes
- **FR-014**: Code MUST implement only strict minimum required for current feature (YAGNI principle)
- **FR-015**: Code MUST avoid duplication through reusable functions and components (DRY principle)
- **FR-016**: Code MUST be simple, readable, and clear with straightforward implementations (KISS principle)
- **FR-017**: Configuration changes MUST be synchronized with export/import system and increment export file version (Configuration Portability principle)
- **FR-018**: All visible text displayed on screen MUST be in French (French Localization principle)

### Key Entities

- **BackupConfiguration**: Represents the backup settings - enabled status, scheduled hour, retention count
- **DatabaseBackup**: Represents a single backup - unique identifier, creation timestamp, file reference

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can enable and configure daily backups in under 1 minute
- **SC-002**: Scheduled backups are created within 5 minutes of the configured hour
- **SC-003**: Backup list displays available backups with accurate timestamps immediately upon page load
- **SC-004**: Restore operation completes and reflects the backed-up state within 2 minutes for typical database sizes
- **SC-005**: Manual backup creation completes within 1 minute for typical database sizes
- **SC-006**: 100% of backup and restore operations provide clear success or error feedback to the administrator

## Assumptions

- The maintenance tab already exists and has the Scheduled Restart feature, so the backup configuration will be added as an additional section
- Backups are stored on the server's local filesystem
- The database size is manageable for file-based backup/restore operations
- Server timezone is used for scheduling, displayed in user's local timezone in the UI
- Only one administrator performs backup/restore operations at a time (no concurrent access handling required)
