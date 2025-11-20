# Shower

A Next.js application for creating showcase websites with admin authentication.

This project uses modern technologies including Next.js 15, TypeScript, Chakra UI, and follows Domain-Driven Design (DDD) and Hexagonal Architecture principles.

## Getting Started

First, run the development server:

```bash
docker compose up app
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Architecture

This project follows **Domain-Driven Design (DDD)** and **Hexagonal Architecture**:

- **Domain Layer**: Business logic and entities (`src/domain/`)
- **Application Layer**: Use cases and services (`src/application/`)
- **Infrastructure Layer**: Adapters and external integrations (`src/infrastructure/`)
- **Presentation Layer**: UI components and routes (`src/presentation/`)

Key technologies:

- **Authentication**: BetterAuth with Google OAuth
- **Dependency Injection**: Tsyringe
- **Styling**: Chakra UI
- **Logging**: Production-grade async logging system with structured output
- **Testing**: Jest for unit tests

## Project Structure

```
shower/
├── src/
│   ├── presentation/     # UI components and Next.js routes
│   ├── domain/          # Business logic and entities
│   ├── application/     # Use cases and application services
│   ├── infrastructure/  # Adapters and external services
│   └── shared/          # Shared utilities and components
├── test/
│   ├── unit/            # Unit tests
│   │   └── performance/ # Performance tests
├── logs/                # Generated log files
└── public/              # Static assets
```

## Admin Access Setup

The `/admin` page is protected and requires Google authentication. Only users with an email address matching the `ADMIN_EMAIL` environment variable can access it.

### Setup Steps

1. **Set up Google OAuth credentials:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Enable the Google+ API.
   - Create OAuth 2.0 credentials (Client ID and Client Secret).
   - Add `http://localhost:3000/api/auth/callback/google` to the authorized redirect URIs.

2. **Configure environment variables in `.env`:**

   ```
   # Admin Configuration
   ADMIN_EMAIL=your-admin-email@example.com
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   BETTERAUTH_SECRET=your-random-secret-string

   # Logging Configuration
   LOG_FOLDER=./logs
   LOG_LEVEL=info
   LOG_BUFFER_SIZE=100
   LOG_FLUSH_INTERVAL=5000
   LOG_MAX_FILE_SIZE=10485760    # 10MB
   LOG_MAX_FILES=30
   LOG_COMPRESS=true
   LOG_COMPRESSION_LEVEL=6
   LOG_DELETE_COMPRESSED_OLDER_THAN=90  # days
   LOG_STACK_TRACE=false
   ```

3. **Access the admin page:**
   - Start the development server.
   - Navigate to `/admin`.
   - You will be redirected to Google for authentication.
   - Only the specified admin email can log in and access the page.
   - Note: The Google OAuth flow is configured to always prompt for consent, ensuring users must explicitly reauthenticate after signing out.

## Enhanced Logging System

This application features a comprehensive, production-grade logging system that provides structured, performant, and maintainable logging across all application layers.

**⚠️ Important**: This logging system is designed for **single-instance deployments only**. Rate limiting and log storage are handled in-memory and on local filesystem.

### Key Features

- **Async Buffered Logging**: Prevents event loop blocking with configurable buffers
- **Automatic Log Rotation**: File size-based rotation with compression and retention policies
- **Structured JSON Logging**: Production-ready format with consistent metadata
- **Performance Monitoring**: Built-in timing and measurement tools
- **Request Context Tracking**: Correlation IDs for end-to-end request tracing
- **Memory Efficient**: Minimal resource footprint with automatic cleanup

### Performance Characteristics

- **14,000+ logs/sec** high-volume logging capability
- **200,000+ logs/sec** concurrent operation handling
- **Sub-10ms response times** for individual log operations
- **Automatic compression** with configurable levels (1-9)
- **Smart rotation** preventing disk space issues

### Usage Examples

#### Dependency Injection (Recommended)

```typescript
import { Logger } from '@/application/shared/Logger';
import { inject, injectable } from 'tsyringe';

@injectable()
class UserService {
  constructor(@inject('Logger') private logger: Logger) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    this.logger.info('Creating user', { email: userData.email });

    try {
      const user = await this.userRepository.create(userData);
      this.logger.info('User created successfully', { userId: user.id });
      return user;
    } catch (error) {
      this.logger.logError(error, 'Failed to create user', {
        email: userData.email,
      });
      throw error;
    }
  }
}
```

#### API Request/Response Logging

```typescript
export async function GET(request: NextRequest) {
  const logger = EnhancedLoggerServiceLocator.getLogger();
  const startTime = Date.now();

  try {
    logger.logApiRequest('GET', '/api/users', request.headers.get('x-user-id'));

    const users = await userService.getUsers();

    const duration = Date.now() - startTime;
    logger.logApiResponse('GET', '/api/users', 200, duration, {
      count: users.length,
    });

    return Response.json(users);
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.logApiResponse('GET', '/api/users', 500, duration);
    logger.logError(error, 'API request failed', {
      method: 'GET',
      url: '/api/users',
    });
    throw error;
  }
}
```

#### Performance Measurement

```typescript
// Automatic async measurement
const result = await logger.measure(
  'database-query',
  async () => await userRepository.findById(userId),
  { table: 'users', operation: 'findById' }
);

// Manual timing
const timer = logger.startTimer('data-processing', { batchSize });
try {
  const processed = await processData(data);
  logger.endTimer(timer, { processedCount: processed.length, success: true });
} catch (error) {
  logger.endTimer(timer, { success: false, error: error.message });
  throw error;
}
```

### Log Levels

- **DEBUG**: Detailed troubleshooting information (development only)
- **INFO**: Important business events and successful operations
- **WARN**: Concerning situations that don't stop the application
- **ERROR**: Error conditions that impact functionality

### Environment Configuration

Configure the logging system with these environment variables:

```env
# Core logging configuration
LOG_FOLDER=./logs                    # Log file directory
LOG_LEVEL=info                       # Minimum log level
LOG_BUFFER_SIZE=100                  # Buffer size for async operations
LOG_FLUSH_INTERVAL=5000              # Flush interval in milliseconds

# Log rotation configuration
LOG_MAX_FILE_SIZE=10485760           # Max file size (10MB)
LOG_MAX_FILES=30                     # Maximum number of log files
LOG_COMPRESS=true                    # Enable compression
LOG_COMPRESSION_LEVEL=6              # Compression level (1-9)
LOG_DELETE_COMPRESSED_OLDER_THAN=90  # Delete compressed files older than (days)

# Development settings
LOG_STACK_TRACE=false                # Include stack traces in development

# Rate limiting configuration (for /api/logs endpoint)
RATE_LIMIT_WINDOW_MS=60000          # Rate limit time window in milliseconds (1 minute)
RATE_LIMIT_MAX_REQUESTS=100          # Max requests per window per IP
```

## Deployment Considerations

### Single Instance Limitation

**⚠️ Important**: This logging system is designed for **single-instance deployments only**.

#### What this means

- **Rate limiting** is handled in-memory and resets on server restart
- **Log storage** is on local filesystem of each instance
- **No shared state** between multiple server instances
- **Not suitable** for multi-instance or distributed deployments

#### Suitable for

- Development environments
- Single-server production deployments
- Small to medium applications with single instance
- Applications where simple logging is sufficient

#### Not suitable for

- Multi-instance production deployments
- Distributed systems with load balancing
- High-availability applications requiring shared logging
- Applications needing centralized log aggregation

#### Alternatives for multi-instance deployments

- Implement centralized logging services (ELK stack, Splunk, etc.)
- Use external log aggregation services
- Implement distributed tracing systems
- Consider cloud provider logging solutions

## Testing

### Unit Tests

Run unit tests with Jest:

```bash
docker compose run --rm app npm test
```

The test suite includes comprehensive performance tests that automatically validate:

- High-volume logging capabilities (14,000+ logs/sec)
- Concurrent operation handling (200,000+ logs/sec)
- Memory efficiency and leak prevention
- Large metadata object processing

Performance tests run as part of the standard test suite, ensuring the logging system maintains optimal performance.

The logging system includes comprehensive performance tests that run automatically as part of the unit test suite, validating:

- High-volume logging capabilities (14,000+ logs/sec)
- Concurrent operation handling (200,000+ logs/sec)
- Memory efficiency and leak prevention
- Large metadata object processing

### Git Hooks

This project uses Husky for git hooks:

- **Pre-commit**: Runs linting, formatting, and TypeScript checks
- **Pre-push**: Runs unit tests and build

## Commands Summary

| Command                                      | Description                                |
| -------------------------------------------- | ------------------------------------------ |
| `docker compose run --rm app npm install`    | Install npm dependencies                   |
| `docker compose up app`                      | Start development server                   |
| `docker compose up mongodb -d`               | Start MongoDB service                      |
| `docker compose run --rm app npm run build`  | Build for production                       |
| `docker compose run --rm app npm run start`  | Start production server                    |
| `docker compose run --rm app npm run lint`   | Run ESLint                                 |
| `docker compose run --rm app npm run format` | Format code with Prettier                  |
| `docker compose run --rm app npm test`       | Run all unit tests (including performance) |

## Monitoring and Observability

### Log File Locations

Log files are automatically generated in the configured `LOG_FOLDER`:

```
logs/
├── app-2024-01-15.log          # Current day's logs
├── app-2024-01-14.log.gz       # Compressed previous logs
├── app-2024-01-13.log.gz       # Older compressed logs
└── ...
```

### Log Format

Logs are structured in JSON format for easy parsing and analysis:

```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "INFO",
  "message": "User created successfully",
  "metadata": {
    "userId": "user-123",
    "email": "user@example.com",
    "requestId": "req-456"
  }
}
```

### Performance Monitoring

The logging system includes built-in performance monitoring:

- **Automatic timing** for operations exceeding 1000ms
- **Memory usage tracking** with leak detection
- **Buffer utilization metrics** for optimization
- **Error rate monitoring** with detailed context

### Integration with Log Aggregation

The structured JSON format is compatible with popular log aggregation tools:

- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Splunk**
- **Datadog**
- **Grafana Loki**
- **AWS CloudWatch Logs**

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Code Formatting

This project uses Prettier for code formatting.

To format the code, run:

```bash
docker compose run --rm app npm run format
```

To check if the code is formatted correctly, run:

```bash
docker compose run --rm app npm run check-format
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Environment Variables

Make sure to set the following environment variables in your Vercel project settings:

#### Required Variables

- `ADMIN_EMAIL` - Email address for admin access
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `BETTERAUTH_SECRET` - Secret key for BetterAuth
- `BETTERAUTH_URL` - Your deployment URL

#### Logging Configuration (Optional)

- `LOG_FOLDER` - Log file directory (default: `./logs`)
- `LOG_LEVEL` - Minimum log level (default: `info`)
- `LOG_BUFFER_SIZE` - Buffer size for async operations (default: `100`)
- `LOG_FLUSH_INTERVAL` - Flush interval in milliseconds (default: `5000`)
- `LOG_MAX_FILE_SIZE` - Max file size in bytes (default: `10485760`)
- `LOG_MAX_FILES` - Maximum number of log files (default: `30`)
- `LOG_COMPRESS` - Enable compression (default: `true`)
- `LOG_COMPRESSION_LEVEL` - Compression level 1-9 (default: `6`)
- `LOG_DELETE_COMPRESSED_OLDER_THAN` - Delete compressed files older than days (default: `90`)
- `LOG_STACK_TRACE` - Include stack traces (default: `false`)

#### Production Logging Recommendations

For production deployments, consider these optimized settings:

```env
LOG_LEVEL=warn                      # Reduce verbosity in production
LOG_BUFFER_SIZE=200                 # Larger buffer for high traffic
LOG_FLUSH_INTERVAL=3000             # More frequent flushes
LOG_MAX_FILE_SIZE=20971520          # 20MB files
LOG_MAX_FILES=50                    # More retention
LOG_COMPRESS=true                   # Enable compression
LOG_COMPRESSION_LEVEL=9             # Maximum compression
LOG_DELETE_COMPRESSED_OLDER_THAN=30 # 30-day retention
LOG_STACK_TRACE=false               # Disable stack traces
```

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Logging System Architecture

The enhanced logging system follows the same hexagonal architecture principles as the rest of the application:

### Components

- **`Logger`** (Application Layer): Main interface for all logging operations
- **`EnhancedLogFormatterService`** (Domain Layer): Handles log formatting and structure
- **`AsyncFileLoggerAdapter`** (Infrastructure Layer): Manages async file operations
- **`LogRotationService`** (Infrastructure Layer): Automatic log management and cleanup
- **`ContextualLogger`** (Application Layer): Request-scoped logging with correlation IDs

### Design Principles

- **Dependency Injection**: All logging components are injectable and testable
- **Async Operations**: Non-blocking I/O prevents performance degradation
- **Structured Logging**: Consistent JSON format across all environments
- **Configuration Driven**: Environment-based configuration for different deployment scenarios
- **Error Resilience**: Graceful degradation and fallback mechanisms

### Performance Optimizations

- **Buffered Writing**: Batches log entries for efficient I/O
- **Lazy Initialization**: Components created only when needed
- **Memory Management**: Automatic cleanup and garbage collection
- **Compression**: Reduces storage requirements for historical logs
- **Smart Rotation**: Prevents disk space issues while maintaining retention
