# Logging System Migration Guide

## Current vs Enhanced Logging

### Current Usage

```typescript
// Old way
import { container } from '@/infrastructure/container';
import { LogMessage } from '@/application/shared/LogMessage';
import { LogLevel } from '@/domain/shared/value-objects/LogLevel';

const logger = container.resolve<ILogger>('ILogger');
new LogMessage(logger).execute(LogLevel.ERROR, 'Error message', { error });
```

### Enhanced Usage

```typescript
// New way - Direct methods
import { EnhancedLoggerServiceLocator } from '@/infrastructure/enhancedContainer';

const logger = EnhancedLoggerServiceLocator.getUnifiedLogger();
logger.error('Error message', { error });

// Or with convenience methods
logger.logError(error as Error, 'Something went wrong', { userId });

// Context-aware logging
const contextualLogger = logger.withContext({
  requestId: '123',
  userId: '456',
});
contextualLogger.info('User action completed');
```

## API Route Integration

### Before

```typescript
export async function POST(request: NextRequest) {
  try {
    // ... logic
  } catch (error) {
    const logger = container.resolve<ILogger>('ILogger');
    new LogMessage(logger).execute(LogLevel.ERROR, 'API Error', { error });
    throw error;
  }
}
```

### After

```typescript
import { requestMiddleware } from '@/infrastructure/shared/middleware/requestContext';

export const POST = requestMiddleware(async (request: NextRequest) => {
  const context = getRequestContext();

  try {
    // ... logic
    context.logger.info('Operation completed');
  } catch (error) {
    context.logger.logError(error as Error, 'API Error');
    throw error;
  }
});
```

## Environment Configuration

### New Environment Variables

```bash
# Buffering
LOG_BUFFER_SIZE=100          # Number of logs before flush
LOG_FLUSH_INTERVAL=5000      # Flush interval in milliseconds

# File management
LOG_MAX_FILE_SIZE=10485760   # 10MB per file
LOG_MAX_FILES=30             # Keep 30 log files
LOG_COMPRESS=true            # Compress old files

# Formatting
LOG_STACK_TRACE=true         # Include stack traces in errors
LOG_FOLDER=./logs           # Log directory
```

## Performance Benefits

1. **Async Operations**: No blocking I/O
2. **Buffered Writing**: Reduced file operations
3. **Log Rotation**: Automatic file management
4. **Structured Logging**: Better searchability
5. **Request Correlation**: Easy debugging

## Migration Steps

1. Update container registration
2. Replace `new LogMessage()` calls with `logger.error()` etc.
3. Add request context middleware to API routes
4. Configure environment variables
5. Monitor log file sizes and rotation

## Backward Compatibility

The enhanced system maintains backward compatibility with existing `ILogger` implementations while providing new capabilities through the `UnifiedLogger` interface.
