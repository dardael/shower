# Quickstart Guide: Simplify Logging System

**Feature**: 002-simplify-logging  
**Date**: 2025-11-20  
**Purpose**: Quick reference for implementing simple log wrapper objects with environment-based log level control

## Frontend useLogger Hook (Adapted)

### FrontendLog Implementation

```typescript
// src/shared/FrontendLog.ts
type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';

const LOG_LEVELS: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
};

const currentLogLevel: LogLevel =
  (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'INFO';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
}

export const frontendLog = {
  debug: (message: string, ...data: any[]) => {
    if (shouldLog('DEBUG')) {
      console.debug(`[DEBUG] ${message}`, ...data);
    }
  },

  info: (message: string, ...data: any[]) => {
    if (shouldLog('INFO')) {
      console.log(`[INFO] ${message}`, ...data);
    }
  },

  warn: (message: string, ...data: any[]) => {
    if (shouldLog('WARNING')) {
      console.warn(`[WARN] ${message}`, ...data);
    }
  },

  error: (message: string, ...data: any[]) => {
    if (shouldLog('ERROR')) {
      console.error(`[ERROR] ${message}`, ...data);
    }
  },
};
```

### Adapted useLogger Hook

```typescript
// src/presentation/shared/hooks/useLogger.ts
import { frontendLog } from '@/shared/FrontendLog';

export interface ILogger {
  debug: (message: string, ...data: any[]) => void;
  info: (message: string, ...data: any[]) => void;
  warn: (message: string, ...data: any[]) => void;
  error: (message: string, ...data: any[]) => void;
  startTimer: (operation: string, metadata?: any) => Timer;
  endTimer: (timer: Timer, metadata?: any) => void;
}

export interface Timer {
  operation: string;
  startTime: number;
  metadata?: any;
}

export function useLogger(): ILogger {
  return {
    ...frontendLog,
    startTimer: (operation: string, metadata?: any) => ({
      operation,
      startTime: performance.now(),
      metadata,
    }),
    endTimer: (timer: Timer, metadata?: any) => {
      const duration = performance.now() - timer.startTime;
      frontendLog.info(
        `${timer.operation} completed in ${duration.toFixed(2)}ms`,
        {
          ...timer.metadata,
          ...metadata,
          duration,
        }
      );
    },
  };
}
```

### Basic Usage (No Changes Needed)

```typescript
import { useLogger } from '@/presentation/shared/hooks/useLogger';

export function MyComponent() {
  const logger = useLogger();

  const handleClick = () => {
    logger.info('User clicked button:', { buttonId: 'submit' });
    logger.debug('Component state updated:', { count: 1 });
  };

  const handleError = (error: Error) => {
    logger.error('Component error:', error.message);
  };

  // ... rest of component
}
```

### Environment Configuration

```bash
# .env file
NEXT_PUBLIC_LOG_LEVEL=DEBUG    # Shows all logs (DEBUG, INFO, WARN, ERROR)
NEXT_PUBLIC_LOG_LEVEL=INFO     # Shows INFO, WARN, ERROR (hides DEBUG)
NEXT_PUBLIC_LOG_LEVEL=WARNING  # Shows WARN, ERROR (hides DEBUG, INFO)
NEXT_PUBLIC_LOG_LEVEL=ERROR    # Shows only ERROR (hides DEBUG, INFO, WARN)
```

### Basic Usage

```typescript
import { log } from '@/shared/FrontendLog';

// Information logging
log.info('User logged in:', userId);

// Error logging
log.error('API request failed:', error);

// Warning logging
log.warn('Deprecated feature used:', featureName);

// Debug logging
log.debug('Component state updated:', state);
```

### Environment Configuration

```bash
# .env file
LOG_LEVEL=DEBUG    # Shows all logs (DEBUG, INFO, WARN, ERROR)
LOG_LEVEL=INFO     # Shows INFO, WARN, ERROR (hides DEBUG)
LOG_LEVEL=WARNING  # Shows WARN, ERROR (hides DEBUG, INFO)
LOG_LEVEL=ERROR    # Shows only ERROR (hides DEBUG, INFO, WARN)
```

### React Component Example (No Changes Needed)

```typescript
import { useState, useEffect } from 'react'
import { useLogger } from '@/presentation/shared/hooks/useLogger'

export function UserProfile({ userId }: { userId: string }) {
  const logger = useLogger()
  const [user, setUser] = useState(null)

  useEffect(() => {
    logger.info('UserProfile component mounted for user:', userId)

    fetchUser(userId)
      .then(userData => {
        logger.info('User data loaded:', userData)
        setUser(userData)
      })
      .catch(error => {
        logger.error('Failed to load user data:', error)
      })

    return () => {
      logger.info('UserProfile component unmounted for user:', userId)
    }
  }, [userId])

  const handleUpdate = (updates: any) => {
    logger.info('Updating user profile:', userId, updates)
    // ... update logic
    logger.info('User profile updated successfully')
  }

  return <div>{/* component JSX */}</div>
}
```

## Backend Logger with Dependency Injection

### BackendLog Implementation

```typescript
// src/infrastructure/shared/BackendLog.ts
type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';

const LOG_LEVELS: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
};

const currentLogLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'INFO';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
}

export const backendLog = {
  debug: (message: string, ...data: any[]) => {
    if (shouldLog('DEBUG')) {
      console.debug(`[DEBUG] ${message}`, ...data);
    }
  },

  info: (message: string, ...data: any[]) => {
    if (shouldLog('INFO')) {
      console.log(`[INFO] ${message}`, ...data);
    }
  },

  warn: (message: string, ...data: any[]) => {
    if (shouldLog('WARNING')) {
      console.warn(`[WARN] ${message}`, ...data);
    }
  },

  error: (message: string, ...data: any[]) => {
    if (shouldLog('ERROR')) {
      console.error(`[ERROR] ${message}`, ...data);
    }
  },
};
```

### Logger Interface and Implementation

```typescript
// src/application/shared/ILogger.ts
export interface ILogger {
  debug: (message: string, ...data: any[]) => void;
  info: (message: string, ...data: any[]) => void;
  warn: (message: string, ...data: any[]) => void;
  error: (message: string, ...data: any[]) => void;
  startTimer: (operation: string, metadata?: any) => Timer;
  endTimer: (timer: Timer, metadata?: any) => void;
}

export interface Timer {
  operation: string;
  startTime: number;
  metadata?: any;
}

// src/infrastructure/shared/Logger.ts
import { ILogger } from '@/application/shared/ILogger';
import { backendLog } from './BackendLog';

export class Logger implements ILogger {
  debug = backendLog.debug;
  info = backendLog.info;
  warn = backendLog.warn;
  error = backendLog.error;

  startTimer = (operation: string, metadata?: any) => ({
    operation,
    startTime: Date.now(),
    metadata,
  });

  endTimer = (timer: Timer, metadata?: any) => {
    const duration = Date.now() - timer.startTime;
    backendLog.info(`${timer.operation} completed in ${duration}ms`, {
      ...timer.metadata,
      ...metadata,
      duration,
    });
  };
}
```

### Dependency Injection Setup

```typescript
// src/infrastructure/container.ts
import { container } from 'tsyringe';
import { Logger } from './shared/Logger';
import { ILogger } from '@/application/shared/ILogger';

container.register<ILogger>('Logger', {
  useClass: Logger,
});
```

### API Route Example

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Logger } from '@/infrastructure/shared/Logger';

export async function GET(request: NextRequest) {
  const logger = new Logger();
  logger.info('API request received:', request.method, request.url);

  try {
    const data = await fetchData();
    logger.info('Data fetched successfully:', data.length, 'items');

    return NextResponse.json({ data });
  } catch (error) {
    logger.error('API request failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Service Layer Example

```typescript
import { injectable, inject } from 'tsyringe';
import { ILogger } from '@/application/shared/ILogger';

@injectable()
export class UserService {
  constructor(
    @inject('Logger') private logger: ILogger,
    private userRepository: UserRepository
  ) {}

  async createUser(userData: any) {
    this.logger.info('Creating new user:', userData.email);

    try {
      const user = await this.userRepository.create(userData);
      this.logger.info('User created successfully:', user.id);
      return user;
    } catch (error) {
      this.logger.error('Failed to create user:', error);
      throw error;
    }
  }

  async authenticateUser(email: string, password: string) {
    this.logger.info('Authenticating user:', email);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.logger.warn('Authentication failed: User not found', email);
      return null;
    }

    const isValid = await this.validatePassword(password, user.passwordHash);
    if (!isValid) {
      this.logger.warn('Authentication failed: Invalid password', email);
      return null;
    }

    this.logger.info('User authenticated successfully:', email);
    return user;
  }
}
```

### Service Layer Example

```typescript
import { log } from '@/infrastructure/shared/BackendLog';

export class UserService {
  async createUser(userData: any) {
    log.info('Creating new user:', userData.email);

    try {
      const user = await this.userRepository.create(userData);
      log.info('User created successfully:', user.id);
      return user;
    } catch (error) {
      log.error('Failed to create user:', error);
      throw error;
    }
  }

  async authenticateUser(email: string, password: string) {
    log.info('Authenticating user:', email);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      log.warn('Authentication failed: User not found', email);
      return null;
    }

    const isValid = await this.validatePassword(password, user.passwordHash);
    if (!isValid) {
      log.warn('Authentication failed: Invalid password', email);
      return null;
    }

    log.info('User authenticated successfully:', email);
    return user;
  }
}
```

### Service Layer Example

```typescript
export class UserService {
  async createUser(userData: any) {
    console.log('Creating new user:', userData.email);

    try {
      const user = await this.userRepository.create(userData);
      console.log('User created successfully:', user.id);
      return user;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  async authenticateUser(email: string, password: string) {
    console.log('Authenticating user:', email);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      console.warn('Authentication failed: User not found', email);
      return null;
    }

    const isValid = await this.validatePassword(password, user.passwordHash);
    if (!isValid) {
      console.warn('Authentication failed: Invalid password', email);
      return null;
    }

    console.log('User authenticated successfully:', email);
    return user;
  }
}
```

## Performance Monitoring

### Simple Performance Timing

```typescript
// Frontend (using useLogger hook with timer methods)
import { useLogger } from '@/presentation/shared/hooks/useLogger';

function measureOperation<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const logger = useLogger();
  const timer = logger.startTimer(operation);

  return fn()
    .then((result) => {
      logger.endTimer(timer, { result: 'success' });
      return result;
    })
    .catch((error) => {
      logger.endTimer(timer, { result: 'error', error: error.message });
      throw error;
    });
}

// Usage
measureOperation('API call', () => fetch('/api/data')).then((data) => {
  const logger = useLogger();
  logger.info('Data received:', data);
});
```

```typescript
// Backend (using dependency injection with timer methods)
import { ILogger } from '@/application/shared/ILogger';

async function measureOperation<T>(
  operation: string,
  fn: () => Promise<T>,
  logger: ILogger
): Promise<T> {
  const timer = logger.startTimer(operation);

  try {
    const result = await fn();
    logger.endTimer(timer, { result: 'success' });
    return result;
  } catch (error) {
    logger.endTimer(timer, { result: 'error', error: error.message });
    throw error;
  }
}
```

```typescript
// Backend (using dependency injection)
import { ILogger } from '@/application/shared/ILogger';

async function measureOperation<T>(
  operation: string,
  fn: () => Promise<T>,
  logger: ILogger
): Promise<T> {
  logger.info(`Starting ${operation}`);
  const start = Date.now();

  try {
    const result = await fn();
    const duration = Date.now() - start;
    logger.info(`${operation} completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(`${operation} failed after ${duration}ms:`, error);
    throw error;
  }
}
```

```typescript
// Backend
import { log } from '@/infrastructure/shared/BackendLog';

async function measureOperation<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  log.info(`Starting ${operation}`);
  const start = Date.now();

  try {
    const result = await fn();
    const duration = Date.now() - start;
    log.info(`${operation} completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    log.error(`${operation} failed after ${duration}ms:`, error);
    throw error;
  }
}
```

```typescript
// Backend
async function measureOperation<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  console.log(`Starting ${operation}`);
  const start = Date.now();

  try {
    const result = await fn();
    const duration = Date.now() - start;
    console.log(`${operation} completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`${operation} failed after ${duration}ms:`, error);
    throw error;
  }
}
```

## Migration Checklist

### Remove Enhanced Logging Infrastructure

- [ ] Delete complex logging infrastructure files (AsyncFileLoggerAdapter, RemoteLoggerAdapter, etc.)
- [ ] Remove LoggerProvider from component tree (if exists)
- [ ] Remove complex logging environment variables
- [ ] Remove logging middleware and configuration

### Keep Existing Interfaces, Update Implementation

- [ ] Keep useLogger hook interface (adapt to use FrontendLog internally)
- [ ] Keep Logger dependency injection interface (replace implementation with BackendLog)
- [ ] Create FrontendLog wrapper object
- [ ] Create BackendLog wrapper object
- [ ] Add LOG_LEVEL environment variable support
- [ ] Add startTimer/endTimer methods to both interfaces
- [ ] Update dependency injection container to register new Logger implementation

### Update Tests

- [ ] Keep existing Logger interface mocks (same interface)
- [ ] Update test assertions to expect console output with log level filtering
- [ ] Remove logging infrastructure tests
- [ ] Add tests for LOG_LEVEL filtering
- [ ] Add tests for startTimer/endTimer functionality

## Best Practices

### Log Message Format

```typescript
// Frontend (using useLogger hook)
const logger = useLogger()
logger.info('User login successful:', { userId, email, timestamp })
logger.error('Database connection failed:', { host, port, error })

// Backend (using dependency injection)
constructor(@inject('Logger') private logger: ILogger) {}
this.logger.info('User login successful:', { userId, email, timestamp })
this.logger.error('Database connection failed:', { host, port, error })

// Avoid: Vague messages without context
logger.info('Done')
logger.error('Error')
```

### Log Level Filtering

```typescript
// Both frontend and backend automatically filter based on LOG_LEVEL environment variable
logger.debug('Detailed debug info'); // Only shown if LOG_LEVEL=DEBUG
logger.info('General information'); // Shown if LOG_LEVEL=DEBUG, INFO
logger.warn('Warning message'); // Shown if LOG_LEVEL=DEBUG, INFO, WARNING
logger.error('Error occurred'); // Always shown regardless of LOG_LEVEL
```

### Log Level Filtering

```typescript
// Log wrapper automatically filters based on LOG_LEVEL environment variable
log.debug('Detailed debug info'); // Only shown if LOG_LEVEL=DEBUG
log.info('General information'); // Shown if LOG_LEVEL=DEBUG, INFO
log.warn('Warning message'); // Shown if LOG_LEVEL=DEBUG, INFO, WARNING
log.error('Error occurred'); // Always shown regardless of LOG_LEVEL
```

### Error Logging with Stack Traces

```typescript
try {
  // operation
} catch (error) {
  log.error('Operation failed:', error.message);
  log.error('Stack trace:', error.stack);
}
```

## Production Considerations

### Environment Configuration

```bash
# Frontend (NEXT_PUBLIC_ prefix for client-side access)
NEXT_PUBLIC_LOG_LEVEL=DEBUG    # Development - show all logs
NEXT_PUBLIC_LOG_LEVEL=INFO     # Staging - hide debug logs
NEXT_PUBLIC_LOG_LEVEL=WARNING  # Production - only show warnings and errors

# Backend (server-side only)
LOG_LEVEL=DEBUG    # Development - show all logs
LOG_LEVEL=INFO     # Staging - hide debug logs
LOG_LEVEL=WARNING  # Production - only show warnings and errors
```

### Log Level Hierarchy

- `DEBUG`: Shows all logs (debug, info, warn, error)
- `INFO`: Shows info, warn, error (hides debug)
- `WARNING`: Shows warn, error (hides debug, info)
- `ERROR`: Shows only error (hides debug, info, warn)

### Console Output Management

- Development: Full console output enabled
- Production: Console output visible in server logs, browser console available via dev tools
- Log level filtering reduces noise in production environments
