import { renderHook, act } from '@testing-library/react';
import { useFormState } from '@/presentation/admin/hooks/useFormState';

describe('useFormState', () => {
  beforeEach(() => {
    // Mock console methods to prevent test output pollution
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    // Restore console methods
    jest.restoreAllMocks();
  });

  it('should not show changes before initialization', () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { name: 'test', email: 'test@example.com' },
      })
    );

    expect(result.current.hasChanges).toBe(false);
    expect(result.current.hasUnsavedChanges).toBe(false);
    expect(result.current.confirmNavigation()).toBe(true);
  });

  it('should not track changes during initialization phase', () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { name: 'test', email: 'test@example.com' },
      })
    );

    // Update field before initialization - should not mark as dirty
    act(() => {
      result.current.updateFieldValue('name', 'updated');
    });

    expect(result.current.hasChanges).toBe(false);
    expect(result.current.hasUnsavedChanges).toBe(false);
    expect(result.current.confirmNavigation()).toBe(true);
  });

  it('should track changes after initialization', () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { name: 'test', email: 'test@example.com' },
      })
    );

    // Mark as initialized
    act(() => {
      result.current.markAsInitialized();
    });

    // Update field after initialization - should mark as dirty
    act(() => {
      result.current.updateFieldValue('name', 'updated');
    });

    expect(result.current.hasChanges).toBe(true);
    expect(result.current.hasUnsavedChanges).toBe(true);
    expect(result.current.confirmNavigation()).toBe(false);
  });

  it('should mark as clean when markAsClean is called', () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { name: 'test', email: 'test@example.com' },
      })
    );

    // Mark as initialized and make changes
    act(() => {
      result.current.markAsInitialized();
      result.current.updateFieldValue('name', 'updated');
    });

    expect(result.current.hasChanges).toBe(true);

    // Mark as clean
    act(() => {
      result.current.markAsClean();
    });

    expect(result.current.hasChanges).toBe(false);
    expect(result.current.hasUnsavedChanges).toBe(false);
    expect(result.current.confirmNavigation()).toBe(true);
  });

  it('should update initial values properly', () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { name: 'test', email: 'test@example.com' },
      })
    );

    const newValues = { name: 'new', email: 'new@example.com' };

    // Update initial values
    act(() => {
      result.current.updateInitialValues(newValues);
    });

    // Should not be dirty after updating initial values
    expect(result.current.hasChanges).toBe(false);
    expect(result.current.hasUnsavedChanges).toBe(false);
    expect(result.current.confirmNavigation()).toBe(true);
  });

  it('should handle multiple field changes correctly', () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { name: 'test', email: 'test@example.com' },
      })
    );

    // Mark as initialized
    act(() => {
      result.current.markAsInitialized();
    });

    // Update multiple fields
    act(() => {
      result.current.updateFieldValue('name', 'updated');
      result.current.updateFieldValue('email', 'updated@example.com');
    });

    expect(result.current.hasChanges).toBe(true);
    expect(result.current.hasUnsavedChanges).toBe(true);
    expect(result.current.confirmNavigation()).toBe(false);

    // Revert one field
    act(() => {
      result.current.updateFieldValue('name', 'test');
    });

    // Still dirty because email is changed
    expect(result.current.hasChanges).toBe(true);
    expect(result.current.hasUnsavedChanges).toBe(true);
    expect(result.current.confirmNavigation()).toBe(false);

    // Revert second field
    act(() => {
      result.current.updateFieldValue('email', 'test@example.com');
    });

    // Now clean
    expect(result.current.hasChanges).toBe(false);
    expect(result.current.hasUnsavedChanges).toBe(false);
    expect(result.current.confirmNavigation()).toBe(true);
  });
});
