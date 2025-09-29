import { LogFormatterService } from '@/domain/shared/services/LogFormatterService';
import { LogLevel } from '@/domain/shared/value-objects/LogLevel';

describe('LogFormatterService', () => {
  let service: LogFormatterService;

  beforeEach(() => {
    service = new LogFormatterService();
  });

  it('should format log message without metadata', () => {
    const formatted = service.format(LogLevel.INFO, 'Test message');
    expect(formatted).toMatch(
      /^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\] INFO: Test message$/
    );
  });

  it('should format log message with metadata', () => {
    const formatted = service.format(LogLevel.ERROR, 'Error occurred', {
      userId: 123,
    });
    expect(formatted).toMatch(
      /^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\] ERROR: Error occurred \{"userId":123\}$/
    );
  });
});
