# Data Model: Simplify Logging System

**Feature**: 002-simplify-logging  
**Date**: 2025-11-20  
**Purpose**: Define data entities affected by logging system simplification

## Entity Analysis

### Removed Entities

The following entities from the enhanced logging system will be completely removed:

#### Logger

- **Purpose**: Central logging interface with dependency injection
- **Fields**: N/A (interface/service)
- **Relationships**: Used throughout all application layers
- **State Changes**: Completely removed

#### AsyncFileLoggerAdapter

- **Purpose**: File-based logging adapter for server-side
- **Fields**: logFilePath, rotationSettings
- **Relationships**: Implements Logger interface
- **State Changes**: Completely removed

#### RemoteLoggerAdapter

- **Purpose**: Client-side logging adapter that sends logs to server
- **Fields**: endpointUrl, batchSize, retrySettings
- **Relationships**: Used by client-side components
- **State Changes**: Completely removed

#### ContextualLogger

- **Purpose**: Logger with preset metadata context
- **Fields**: baseLogger, context
- **Relationships**: Wraps Logger instance
- **State Changes**: Completely removed

#### PerformanceMonitor

- **Purpose**: Performance measurement and logging
- **Fields**: timers, metrics
- **Relationships**: Used with Logger
- **State Changes**: Completely removed

#### LoggerContext

- **Purpose**: React context for providing logger to components
- **Fields**: logger instance
- **Relationships**: Used by useLogger hook
- **State Changes**: Completely removed

### Adapted Existing Entities

#### useLogger Hook (Adapted)

- **Purpose**: React hook for logging - kept for developer experience
- **Fields**: Returns logger interface with info, warn, error, debug, startTimer, endTimer methods
- **Relationships**: Used by frontend components
- **State Changes**: Adapted to use FrontendLog wrapper internally

#### Logger Interface (Kept)

- **Purpose**: Backend logging interface for dependency injection - kept for clean architecture
- **Fields**: info, warn, error, debug, startTimer, endTimer methods
- **Relationships**: Injected into backend services
- **State Changes**: Implementation replaced with BackendLog wrapper

### New Simple Implementation Entities

#### FrontendLog

- **Purpose**: Simple frontend logging wrapper with environment-based log level control
- **Fields**: logLevel (from environment), console methods
- **Relationships**: Used internally by adapted useLogger hook
- **State Changes**: New simple wrapper object

#### BackendLog

- **Purpose**: Simple backend logging wrapper with environment-based log level control
- **Fields**: logLevel (from environment), console methods
- **Relationships**: Used by Logger implementation
- **State Changes**: New simple wrapper object

#### BackendLog

- **Purpose**: Simple backend logging wrapper with environment-based log level control
- **Fields**: logLevel (from environment), console methods
- **Relationships**: Used by backend services and API routes
- **State Changes**: New simple wrapper object

#### AsyncFileLoggerAdapter

- **Purpose**: File-based logging adapter for server-side
- **Fields**: logFilePath, rotationSettings
- **Relationships**: Implements Logger interface
- **State Changes**: Completely removed

#### RemoteLoggerAdapter

- **Purpose**: Client-side logging adapter that sends logs to server
- **Fields**: endpointUrl, batchSize, retrySettings
- **Relationships**: Used by client-side components
- **State Changes**: Completely removed

#### ContextualLogger

- **Purpose**: Logger with preset metadata context
- **Fields**: baseLogger, context
- **Relationships**: Wraps Logger instance
- **State Changes**: Completely removed

#### PerformanceMonitor

- **Purpose**: Performance measurement and logging
- **Fields**: timers, metrics
- **Relationships**: Used with Logger
- **State Changes**: Completely removed

#### LoggerContext

- **Purpose**: React context for providing logger to components
- **Fields**: logger instance
- **Relationships**: Used by useLogger hook
- **State Changes**: Completely removed

### Unchanged Entities

All existing business entities remain unchanged:

- User (auth domain)
- SocialNetwork (settings domain)
- WebsiteSetting (settings domain)
- All other domain entities

## Validation Rules

### Removal Validation

- All references to removed entities must be eliminated
- No orphaned imports or dependencies
- Build must succeed after removal

### Console Usage Validation

- All logging must use existing interfaces (useLogger, Logger DI)
- Simple console-based implementation with log level filtering
- Consistent usage patterns across codebase

## State Transitions

### Before Simplification

```
Component → useLogger() → Logger → RemoteLoggerAdapter → /api/logs → AsyncFileLoggerAdapter → File
```

### After Simplification

```
Frontend Component → useLogger() → FrontendLog → console.log() → Browser Console (filtered by LOG_LEVEL)
Backend Service → Logger (DI) → BackendLog → console.log() → Server Console (filtered by LOG_LEVEL)
```

Component → useLogger() → Logger → RemoteLoggerAdapter → /api/logs → AsyncFileLoggerAdapter → File

```

### After Simplification

```

Component → console.log() → Browser Console / Server Console

```

## Impact Assessment

### Code Reduction

- Estimated 90% reduction in logging-related code
- Removal of ~15 logging-specific files
- Simplified dependency injection configuration

### Performance Impact

- Reduced bundle size by removing logging infrastructure
- Faster build times
- Lower memory usage during runtime
- Immediate log visibility during development

### Maintenance Impact

- Simplified debugging process
- Reduced cognitive load for developers
- No logging infrastructure maintenance required
- Standardized console usage patterns
```
