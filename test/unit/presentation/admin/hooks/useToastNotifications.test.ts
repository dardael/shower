import { renderHook, act } from '@testing-library/react';
import { useToastNotifications } from '@/presentation/admin/hooks/useToastNotifications';
import { toaster } from '@/presentation/shared/components/ui/toaster';
import { useLogger } from '@/presentation/shared/hooks/useLogger';

// Mock dependencies
jest.mock('@/presentation/shared/components/ui/toaster');
jest.mock('@/presentation/shared/hooks/useLogger');

// Mock console methods to prevent test output pollution
const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
const consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();

describe('useToastNotifications', () => {
  const mockLogger = {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    logError: jest.fn(),
    logErrorWithObject: jest.fn(),
    logApiRequest: jest.fn(),
    logApiResponse: jest.fn(),
    logSecurity: jest.fn(),
    logUserAction: jest.fn(),
    logBusinessEvent: jest.fn(),
    startTimer: jest.fn(),
    endTimer: jest.fn(),
    measure: jest.fn(),
    execute: jest.fn(),
    logIf: jest.fn(),
    debugIf: jest.fn(),
    batch: jest.fn(),
    withContext: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useLogger as jest.Mock).mockReturnValue(mockLogger);
    (toaster.create as jest.Mock).mockReturnValue('mock-toast-id');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleDebugSpy.mockRestore();
  });

  it('should show success toast with correct message and title', () => {
    const { result } = renderHook(() => useToastNotifications());

    act(() => {
      result.current.showToast('Test success message', 'success');
    });

    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Success',
      description: 'Test success message',
      type: 'success',
      duration: 3000,
    });

    expect(mockLogger.info).toHaveBeenCalledWith(
      'Creating toast notification',
      {
        message: 'Test success message',
        type: 'success',
      }
    );

    expect(mockLogger.info).toHaveBeenCalledWith('Toast notification created', {
      message: 'Test success message',
      type: 'success',
      duration: 3000,
    });
  });

  it('should show error toast with correct message and title', () => {
    const { result } = renderHook(() => useToastNotifications());

    act(() => {
      result.current.showToast('Test error message', 'error');
    });

    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Test error message',
      type: 'error',
      duration: 3000,
    });

    expect(mockLogger.info).toHaveBeenCalledWith(
      'Creating toast notification',
      {
        message: 'Test error message',
        type: 'error',
      }
    );

    expect(mockLogger.info).toHaveBeenCalledWith('Toast notification created', {
      message: 'Test error message',
      type: 'error',
      duration: 3000,
    });
  });

  it('should prevent duplicate toast messages', () => {
    const { result } = renderHook(() => useToastNotifications());

    act(() => {
      result.current.showToast('Duplicate message', 'success');
      result.current.showToast('Duplicate message', 'success');
    });

    expect(toaster.create).toHaveBeenCalledTimes(1);
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Duplicate toast message prevented',
      {
        message: 'Duplicate message',
        type: 'success',
      }
    );
  });

  it('should allow same message after duration expires', () => {
    const { result } = renderHook(() => useToastNotifications());

    act(() => {
      result.current.showToast('Test message', 'success');
    });

    expect(toaster.create).toHaveBeenCalledTimes(1);

    // Fast-forward time by 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Should allow same message again after cleanup
    act(() => {
      result.current.showToast('Test message', 'success');
    });

    expect(toaster.create).toHaveBeenCalledTimes(2);
    expect(mockLogger.debug).toHaveBeenCalledWith('Toast message cleaned up', {
      message: 'Test message',
    });
  });

  it('should clear all toasts manually', () => {
    const { result } = renderHook(() => useToastNotifications());

    act(() => {
      result.current.showToast('Message 1', 'success');
      result.current.showToast('Message 2', 'error');
    });

    expect(toaster.create).toHaveBeenCalledTimes(2);

    act(() => {
      result.current.clearAllToasts();
    });

    expect(mockLogger.info).toHaveBeenCalledWith(
      'All toast notifications cleared manually'
    );
  });

  it('should cleanup all toasts on component unmount', () => {
    const { unmount, result } = renderHook(() => useToastNotifications());

    act(() => {
      result.current.showToast('Test message', 'success');
    });

    unmount();

    expect(mockLogger.debug).toHaveBeenCalledWith(
      'All toast messages cleared on component unmount'
    );
  });

  it('should handle different message types independently', () => {
    const { result } = renderHook(() => useToastNotifications());

    act(() => {
      result.current.showToast('Same message success', 'success');
      result.current.showToast('Same message error', 'error');
    });

    // Should allow different messages with different types
    expect(toaster.create).toHaveBeenCalledTimes(2);
    expect(toaster.create).toHaveBeenNthCalledWith(1, {
      title: 'Success',
      description: 'Same message success',
      type: 'success',
      duration: 3000,
    });
    expect(toaster.create).toHaveBeenNthCalledWith(2, {
      title: 'Error',
      description: 'Same message error',
      type: 'error',
      duration: 3000,
    });
  });

  it('should handle rapid successive calls with deduplication', () => {
    const { result } = renderHook(() => useToastNotifications());

    act(() => {
      result.current.showToast('Rapid message 1', 'success');
      result.current.showToast('Rapid message 2', 'success');
      result.current.showToast('Rapid message 1', 'success'); // Duplicate
      result.current.showToast('Rapid message 3', 'error');
    });

    expect(toaster.create).toHaveBeenCalledTimes(3); // Only 3 unique messages
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Duplicate toast message prevented',
      {
        message: 'Rapid message 1',
        type: 'success',
      }
    );
  });

  it('should show conflict notification for rapid saves', () => {
    const { result } = renderHook(() => useToastNotifications());

    act(() => {
      result.current.showConflictNotification();
    });

    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Previous save request was superseded by a newer update',
      type: 'error',
      duration: 3000,
    });

    expect(mockLogger.info).toHaveBeenCalledWith(
      'Conflict notification shown for rapid save',
      {
        message: 'Previous save request was superseded by a newer update',
      }
    );
  });

  it('should not produce console output', () => {
    const { result } = renderHook(() => useToastNotifications());

    act(() => {
      result.current.showToast('Test message', 'success');
      result.current.clearAllToasts();
    });

    // Verify no console methods were called
    expect(consoleSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleDebugSpy).not.toHaveBeenCalled();
  });
});
