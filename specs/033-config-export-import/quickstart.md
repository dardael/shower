# Quickstart: Configuration Export/Import

**Feature**: 033-config-export-import | **Date**: 2025-12-14

## Prerequisites

- Node.js 18+ with npm
- Docker and Docker Compose
- MongoDB running (via docker-compose)
- Existing admin authentication set up

## New Dependencies

Add to `package.json`:

```json
{
  "dependencies": {
    "archiver": "^7.0.0",
    "adm-zip": "^0.5.10"
  },
  "devDependencies": {
    "@types/archiver": "^6.0.0",
    "@types/adm-zip": "^0.5.0"
  }
}
```

Install:

```bash
docker compose run --rm app npm install archiver adm-zip
docker compose run --rm app npm install -D @types/archiver @types/adm-zip
```

## Key Files to Create

### Domain Layer

- `src/domain/config/entities/ExportPackage.ts` - Package metadata entity
- `src/domain/config/value-objects/PackageVersion.ts` - Version compatibility
- `src/domain/config/ports/IConfigurationExporter.ts` - Export interface
- `src/domain/config/ports/IConfigurationImporter.ts` - Import interface

### Application Layer

- `src/application/config/use-cases/ExportConfiguration.ts`
- `src/application/config/use-cases/ImportConfiguration.ts`
- `src/application/config/use-cases/PreviewImport.ts`
- `src/application/config/services/ConfigurationService.ts`

### Infrastructure Layer

- `src/infrastructure/config/adapters/ZipExporter.ts`
- `src/infrastructure/config/adapters/ZipImporter.ts`
- `src/infrastructure/config/adapters/BackupService.ts`
- `src/infrastructure/config/services/ConfigurationServiceLocator.ts`

### API Routes

- `src/app/api/config/export/route.ts` - GET endpoint
- `src/app/api/config/import/route.ts` - POST endpoint
- `src/app/api/config/import/preview/route.ts` - POST endpoint

### Presentation Layer

- `src/app/admin/export-import/page.tsx` - Admin page
- `src/presentation/admin/components/ExportImportPanel.tsx` - UI component
- `src/presentation/admin/hooks/useExportConfiguration.ts`
- `src/presentation/admin/hooks/useImportConfiguration.ts`
- Update `src/presentation/admin/components/AdminSidebar.tsx` - Add menu item

### Tests

- `test/integration/config-export.integration.test.tsx`
- `test/integration/config-import.integration.test.tsx`
- `test/unit/application/config/ExportConfiguration.test.ts`

## Development Workflow

1. **Start services**:

   ```bash
   docker compose up -d
   ```

2. **Run tests**:

   ```bash
   docker compose run --rm app npm run test
   ```

3. **Type check**:

   ```bash
   docker compose run --rm app npm run build:strict
   ```

4. **Lint**:
   ```bash
   docker compose run --rm app npm run lint
   ```

## Testing the Feature

### Manual Testing

1. Log in as admin
2. Navigate to "Export/Import" tab in sidebar
3. Click "Export" - should download ZIP file
4. Upload the ZIP file in the import section
5. Verify preview shows correct summary
6. Confirm import
7. Verify all data restored correctly

### Integration Test Commands

```bash
docker compose run --rm app npm run test -- --testPathPattern="config-export|config-import"
```

## Architecture Notes

- Uses existing repositories for data collection (DRY)
- ZIP handling via archiver/adm-zip
- Full backup before import for atomicity
- Version check in manifest.json for compatibility
