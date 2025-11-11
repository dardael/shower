'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseFormStateOptions<T extends Record<string, unknown>> {
  initialValues: T;
  onBeforeUnload?: (hasChanges: boolean) => void;
}

interface UseFormStateReturn<T extends Record<string, unknown>> {
  updateFieldValue: (field: string, value: unknown) => void;
  updateInitialValues: (values: T) => void;
  markAsClean: () => void;
  markAsInitialized: () => void;
  hasChanges: boolean;
  isDirty: boolean;
  hasUnsavedChanges: boolean;
  confirmNavigation: () => boolean;
}

export function useFormState<T extends Record<string, unknown>>({
  initialValues,
  onBeforeUnload,
}: UseFormStateOptions<T>): UseFormStateReturn<T> {
  const currentValuesRef = useRef<T>(initialValues);
  const initialValuesRef = useRef<T>(initialValues);
  const hasChangesRef = useRef(false);
  const isInitializedRef = useRef(false);
  const [, forceUpdate] = useState({});

  const updateFieldValue = useCallback((field: string, value: unknown) => {
    currentValuesRef.current = {
      ...currentValuesRef.current,
      [field]: value,
    };

    // Only check for changes if form is initialized
    if (isInitializedRef.current) {
      const hasChanges = Object.keys(currentValuesRef.current).some(
        (key) =>
          currentValuesRef.current[key as keyof T] !==
          initialValuesRef.current[key as keyof T]
      );
      hasChangesRef.current = hasChanges;
      forceUpdate({});
    }
  }, []);

  const updateInitialValues = useCallback((values: T) => {
    initialValuesRef.current = { ...values };
    currentValuesRef.current = { ...values };
    hasChangesRef.current = false;
  }, []);

  const markAsClean = useCallback(() => {
    initialValuesRef.current = { ...currentValuesRef.current };
    hasChangesRef.current = false;
    forceUpdate({});
  }, []);

  const markAsInitialized = useCallback(() => {
    isInitializedRef.current = true;
    // Set initial values to current values at initialization time
    initialValuesRef.current = { ...currentValuesRef.current };
    hasChangesRef.current = false;
  }, []);

  const hasChanges = isInitializedRef.current ? hasChangesRef.current : false;

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Only show warning if form is initialized and has changes
      if (isInitializedRef.current && hasChangesRef.current && onBeforeUnload) {
        onBeforeUnload(hasChangesRef.current);
        event.preventDefault();
        // Modern browsers require this to show beforeunload dialog
        if (typeof event.returnValue === 'string') {
          event.returnValue = '';
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [onBeforeUnload]);

  return {
    updateFieldValue,
    updateInitialValues,
    markAsClean,
    markAsInitialized,
    hasChanges,
    isDirty: hasChanges,
    hasUnsavedChanges: hasChanges,
    confirmNavigation: () => !hasChanges,
  };
}
