import { Logger } from '@/application/shared/Logger';

export type StorageOperation = 'load' | 'save';

export interface StorageErrorHandlerOptions {
  logger: Logger;
  onError?: (message: string) => void;
  storageKey?: string;
}

export class LocalStorageErrorHandler {
  private logger: Logger;
  private onError?: (message: string) => void;
  private storageKey: string;

  constructor(options: StorageErrorHandlerOptions) {
    this.logger = options.logger;
    this.onError = options.onError;
    this.storageKey = options.storageKey || 'unknown';
  }

  handleError(error: unknown, operation: StorageOperation): string | null {
    this.logger.warn(`Failed to ${operation} data from localStorage`, {
      error,
      operation,
      storageKey: this.storageKey,
    });

    let message: string | null = null;

    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      message = 'Stored preference data was corrupted. Using default settings.';
      this.clearCorruptedData();
    } else if (
      error instanceof Error &&
      (error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        error.message.includes('quota') ||
        error.message.includes('storage'))
    ) {
      message =
        operation === 'load'
          ? 'Storage quota exceeded. Some preferences may not be saved.'
          : 'Storage quota exceeded. Preference may not be saved.';
    } else if (error instanceof Error && error.name === 'SecurityError') {
      message = 'Storage access restricted. Some preferences may not persist.';
    } else {
      message = `Unable to ${operation} preferences. Using default settings.`;
    }

    this.onError?.(message);
    return message;
  }

  private clearCorruptedData(): void {
    this.logger.info('Clearing corrupted localStorage data', {
      key: this.storageKey,
    });
    try {
      localStorage.removeItem(this.storageKey);
    } catch (clearError) {
      this.logger.warn('Failed to clear corrupted localStorage data', {
        error: clearError,
        storageKey: this.storageKey,
      });
    }
  }
}
