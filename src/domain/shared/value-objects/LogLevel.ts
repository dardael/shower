export class LogLevel {
  private constructor(private readonly value: string) {}

  static readonly DEBUG = new LogLevel('debug');
  static readonly INFO = new LogLevel('info');
  static readonly WARNING = new LogLevel('warning');
  static readonly ERROR = new LogLevel('error');

  static fromString(level: string): LogLevel {
    switch (level.toLowerCase()) {
      case 'debug':
        return LogLevel.DEBUG;
      case 'info':
        return LogLevel.INFO;
      case 'warning':
        return LogLevel.WARNING;
      case 'error':
        return LogLevel.ERROR;
      default:
        throw new Error(`Invalid log level: ${level}`);
    }
  }

  isHigherOrEqual(other: LogLevel): boolean {
    const levels = [
      LogLevel.DEBUG,
      LogLevel.INFO,
      LogLevel.WARNING,
      LogLevel.ERROR,
    ];
    return levels.indexOf(this) >= levels.indexOf(other);
  }

  toString(): string {
    return this.value;
  }

  equals(other: LogLevel): boolean {
    return this.value === other.value;
  }
}
