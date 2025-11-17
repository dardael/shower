# API Contracts: Toast Notifications Feature

## Overview

This feature does not introduce new API endpoints but modifies existing website settings API responses to support toast notification patterns. The contracts below document the expected response formats that will drive toast notifications.

## Existing API Endpoints (Referenced)

### Website Settings APIs

All endpoints maintain existing signatures but response handling will be updated for toast integration.

#### GET /api/settings

- **Purpose**: Fetch current website settings
- **Response**: WebsiteSettings object
- **Toast Integration**: Error responses trigger error toasts

#### PUT /api/settings/name

- **Purpose**: Update website name
- **Request**: `{ name: string }`
- **Success Response**: `{ message: "Website name updated successfully" }`
- **Error Response**: `{ error: "Failed to update website name" }`
- **Toast Integration**: Both success and error responses trigger appropriate toasts

#### PUT /api/settings/theme-color

- **Purpose**: Update theme color
- **Request**: `{ themeColor: string }`
- **Success Response**: `{ message: "Theme color updated successfully" }`
- **Error Response**: `{ error: "Invalid theme color provided" }`
- **Toast Integration**: Both success and error responses trigger appropriate toasts

#### PUT /api/settings/icon

- **Purpose**: Update website icon
- **Request**: FormData with icon file
- **Success Response**: `{ message: "Website icon updated successfully" }`
- **Error Response**: `{ error: "Failed to upload icon" }`
- **Toast Integration**: Handled by ImageManager component (existing behavior)

## Toast Notification Contracts

### Toast Message Schema

```typescript
interface ToastNotification {
  id: string;
  type: 'success' | 'error';
  title: string;
  description: string;
  duration: number; // 3000ms
  placement: 'bottom-end';
}
```

### Success Toast Messages

```typescript
interface SuccessToastMessage {
  title: 'Success';
  description:
    | 'Website name updated successfully'
    | 'Theme color updated successfully'
    | 'Website icon updated successfully';
  type: 'success';
}
```

### Error Toast Messages

```typescript
interface ErrorToastMessage {
  title: 'Error';
  description:
    | 'Failed to update website name'
    | 'Invalid theme color provided'
    | 'Failed to upload icon'
    | 'Network error occurred'
    | 'Unauthorized access';
  type: 'error';
}
```

## Client-Side Contracts

### Toast Hook Interface

```typescript
interface UseToastNotifications {
  showToast: (message: string, type: 'success' | 'error') => void;
  clearAllToasts: () => void;
}
```

### Form Handler Integration

```typescript
interface FormSaveHandler {
  (data: any): Promise<void>;
}

// Expected behavior:
// 1. Call API endpoint
// 2. On success: trigger success toast
// 3. On error: trigger error toast
// 4. Handle deduplication for rapid calls
```

## Error Handling Contracts

### API Error Response Format

```typescript
interface ApiErrorResponse {
  error: string;
  details?: any;
  statusCode: number;
}
```

### Toast Error Mapping

```typescript
const ERROR_MESSAGE_MAP = {
  'website name': {
    success: 'Website name updated successfully',
    error: 'Failed to update website name',
  },
  'theme color': {
    success: 'Theme color updated successfully',
    error: 'Invalid theme color provided',
  },
  icon: {
    success: 'Website icon updated successfully',
    error: 'Failed to upload icon',
  },
};
```

## Performance Contracts

### Toast Display Requirements

- **Display Latency**: <200ms from API response completion
- **Duration**: 3000ms auto-dismiss
- **Deduplication Window**: 3 seconds
- **Stacking**: Vertical, newest on top
- **Maximum Concurrent**: 5 toasts (older toasts auto-dismiss)

### Memory Management

- **Timeout Cleanup**: Automatic after duration
- **Component Unmount**: Clear all active toasts
- **Memory Leak Prevention**: No orphaned timeouts or references

## Testing Contracts

### Unit Test Scenarios

```typescript
describe('useToastNotifications', () => {
  it('should show success toast with correct message');
  it('should show error toast with correct message');
  it('should prevent duplicate toast messages');
  it('should cleanup toasts after duration');
  it('should clear all toasts on unmount');
});
```

### Integration Test Scenarios

```typescript
describe('WebsiteSettingsForm Toast Integration', () => {
  it('should show toast on successful name save');
  it('should show toast on failed name save');
  it('should show toast on successful theme color save');
  it('should show toast on failed theme color save');
  it('should handle rapid saves with deduplication');
});
```

### E2E Test Scenarios

```typescript
describe('Website Settings Toast Notifications', () => {
  it('should display success toast for website name save');
  it('should display error toast for failed save operations');
  it('should auto-dismiss toast after 3 seconds');
  it('should stack multiple toasts correctly');
  it('should prevent duplicate toasts for rapid saves');
});
```
