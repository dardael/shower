'use client';

import { useRef, useCallback, useEffect } from 'react';
import { toaster } from '@/presentation/shared/components/ui/toaster';
import { useLogger } from '@/presentation/shared/hooks/useLogger';

export interface UseToastNotificationsReturn {
  showToast: (message: string, type: 'success' | 'error') => void;
  showConflictNotification: () => void;
  clearAllToasts: () => void;
}

export function useToastNotifications(): UseToastNotificationsReturn {
  const logger = useLogger();

  // Track toast messages to prevent duplicates with proper cleanup
  const toastMessagesRef = useRef<Set<string>>(new Set());
  const toastTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Cleanup function for toast deduplication
  const clearToastMessage = useCallback(
    (message: string) => {
      toastMessagesRef.current.delete(message);
      const timeouts = toastTimeoutsRef.current;
      const timeout = timeouts.get(message);
      if (timeout) {
        clearTimeout(timeout);
        timeouts.delete(message);
      }
      logger.debug('Toast message cleaned up', { message });
    },
    [logger]
  );

  // Cleanup on unmount
  useEffect(() => {
    const timeouts = toastTimeoutsRef.current;
    const messages = toastMessagesRef.current;
    return () => {
      // Clear all pending timeouts when component unmounts
      timeouts.forEach(clearTimeout);
      timeouts.clear();
      messages.clear();
      logger.debug('All toast messages cleared on component unmount');
    };
  }, [logger]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error') => {
      // Prevent duplicate messages
      if (toastMessagesRef.current.has(message)) {
        logger.debug('Duplicate toast message prevented', { message, type });
        return;
      }

      logger.info('Creating toast notification', { message, type });

      // Create toast
      toaster.create({
        title: type === 'success' ? 'Success' : 'Error',
        description: message,
        type,
        duration: 3000,
      });

      // Track message
      toastMessagesRef.current.add(message);

      // Cleanup after duration
      const timeout = setTimeout(() => {
        clearToastMessage(message);
      }, 3000);

      toastTimeoutsRef.current.set(message, timeout);

      logger.info('Toast notification created', {
        message,
        type,
        duration: 3000,
      });
    },
    [clearToastMessage, logger]
  );

  const clearAllToasts = useCallback(() => {
    // Clear all timeouts
    const timeouts = toastTimeoutsRef.current;
    timeouts.forEach(clearTimeout);
    timeouts.clear();
    toastMessagesRef.current.clear();

    logger.info('All toast notifications cleared manually');
  }, [logger]);

  const showConflictNotification = useCallback(() => {
    const conflictMessage =
      'Previous save request was superseded by a newer update';
    showToast(conflictMessage, 'error');
    logger.info('Conflict notification shown for rapid save', {
      message: conflictMessage,
    });
  }, [showToast, logger]);

  return { showToast, showConflictNotification, clearAllToasts };
}
