# API Contracts: Simplify Logging System

**Feature**: 002-simplify-logging  
**Date**: 2025-11-20  
**Purpose**: Document API changes resulting from logging system simplification

## Removed API Endpoints

### POST /api/logs

- **Purpose**: Received client-side logs from RemoteLoggerAdapter
- **Request Body**: Log entry array with metadata
- **Response**: Success acknowledgment
- **Status**: REMOVED - No longer needed with console logging

## Modified API Endpoints

### All Existing API Routes

- **Change**: Remove enhanced logging calls
- **Implementation**: Keep Logger DI, replace implementation with BackendLog wrapper
- **Impact**: No functional changes to API behavior
- **Examples**:
  - `logger.logApiRequest()` → `logger.info('API request:', method, url)` (same interface, simple implementation)
  - `logger.logApiResponse()` → `logger.info('API response:', statusCode, duration)` (same interface, simple implementation)
  - `logger.logError()` → `logger.error('API error:', error)` (same interface, simple implementation)

## Client-Side Changes

### React Components

- **Change**: Keep useLogger hook usage (no changes needed)
- **Implementation**: useLogger adapted to use FrontendLog internally
- **Impact**: No functional changes to component behavior
- **Examples**:
  - `logger.info('User action', { userId })` → same call, uses FrontendLog internally
  - `logger.error('Component error', error)` → same call, uses FrontendLog internally

### Hooks and Contexts

- **Adapted**: useLogger hook (kept for developer experience)
- **Removed**: LoggerProvider context (if exists)
- **Removed**: LoggerContext (if exists)
- **Added**: FrontendLog wrapper (used internally by useLogger)

## Data Flow Changes

### Before Simplification

```
Frontend Component → useLogger() → RemoteLoggerAdapter → POST /api/logs → AsyncFileLoggerAdapter → File Storage
```

### After Simplification

```
Frontend Component → useLogger() → FrontendLog → console.log() → Browser Console (filtered by LOG_LEVEL)
Backend API → Logger (DI) → BackendLog → console.log() → Server Console (filtered by LOG_LEVEL)
```

Frontend Component → FrontendLog → console.log() → Browser Console (filtered by LOG_LEVEL)
Backend API → BackendLog → console.log() → Server Console (filtered by LOG_LEVEL)

```

Frontend Component → console.log() → Browser Console
Backend API → console.log() → Server Console

```

## Error Handling Changes

### Before

```typescript
try {
  // operation
  logger.logSuccess('Operation completed');
} catch (error) {
  logger.logError(error, 'Operation failed');
}
```

### After

```typescript
try {
  // operation
  logger.info('Operation completed');
} catch (error) {
  logger.error('Operation failed:', error);
}
```

## Performance Monitoring Changes

### Before

```typescript
const timer = logger.startTimer('operation');
// ... operation
logger.endTimer(timer, { result: 'success' });
```

### After (Same Interface, Simple Implementation)

```typescript
const timer = logger.startTimer('operation');
// ... operation
logger.endTimer(timer, { result: 'success' });
// Uses simple performance.now() internally with console output
```

## Security Considerations

### Before

- Structured logging with security event tracking
- Centralized log storage and analysis
- Correlation IDs for request tracking

### After

- Console output for immediate debugging
- No persistent log storage
- Security events visible in console during development

## Testing Changes

### Unit Tests

- **Before**: Mock Logger instances and verify method calls
- **After**: Mock Logger instances (same interface) and verify method calls

### Integration Tests

- **Before**: Verify log files are created and contain expected entries
- **After**: Verify console output contains expected messages (filtered by LOG_LEVEL)
