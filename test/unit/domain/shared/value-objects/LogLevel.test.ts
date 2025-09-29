import { LogLevel } from '@/domain/shared/value-objects/LogLevel';

describe('LogLevel', () => {
  it('should create DEBUG level', () => {
    expect(LogLevel.DEBUG.toString()).toBe('debug');
  });

  it('should create from string', () => {
    expect(LogLevel.fromString('info')).toEqual(LogLevel.INFO);
  });

  it('should throw on invalid string', () => {
    expect(() => LogLevel.fromString('invalid')).toThrow();
  });

  it('should check isHigherOrEqual', () => {
    expect(LogLevel.INFO.isHigherOrEqual(LogLevel.DEBUG)).toBe(true);
    expect(LogLevel.DEBUG.isHigherOrEqual(LogLevel.INFO)).toBe(false);
    expect(LogLevel.WARNING.isHigherOrEqual(LogLevel.WARNING)).toBe(true);
  });

  it('should check equals', () => {
    expect(LogLevel.INFO.equals(LogLevel.INFO)).toBe(true);
    expect(LogLevel.INFO.equals(LogLevel.DEBUG)).toBe(false);
  });
});
