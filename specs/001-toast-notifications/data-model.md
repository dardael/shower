# Data Model: Toast Notifications for Website Settings

## Core Entities

### ToastNotification

Represents a temporary user feedback message displayed via Chakra UI v3 toast system.

**Properties**:

- `id`: string - Unique identifier for the toast instance
- `type`: 'success' | 'error' - Toast type determining styling
- `title`: string - Bold heading text (e.g., "Success", "Error")
- `description`: string - Detailed message content
- `duration`: number - Auto-dismiss duration in milliseconds (3000ms)
- `placement`: 'bottom-end' - Screen position (from global toaster)

**Behavior**:

- Auto-dismisses after specified duration
- Supports deduplication to prevent duplicate messages
- Stacks vertically when multiple toasts are present
- Newest toast appears on top

### WebsiteSetting

Represents configurable website properties that trigger toast notifications on save operations.

**Types**:

1. **WebsiteName**: Text content for website title
2. **WebsiteIcon**: Image file for website favicon/logo
3. **ThemeColor**: Hex color code for website theme

**Save Operations**:

- Each setting type triggers appropriate toast notification
- Success toasts confirm successful save
- Error toasts display user-friendly error messages
- Rapid saves use last-save-wins with conflict notifications

## State Management

### ToastNotificationState

Manages active toast instances and prevents duplicates.

**Properties**:

- `toastMessagesRef`: Set<string> - Tracks active message descriptions
- `toastTimeoutsRef`: Map<string, NodeJS.Timeout> - Manages cleanup timeouts

**Methods**:

- `showToast()`: Displays toast with deduplication
- `cleanupToast()`: Removes toast from tracking after duration
- `clearAllToasts()`: Cleanup function for component unmount

## Integration Points

### WebsiteSettingsForm Integration

**Current State**: Uses `message` state with inline Text component
**Target State**: Uses toast notifications for all save operations

**Save Handlers**:

- `handleSaveName()`: Convert success/error to toast
- `handleSaveThemeColor()`: Convert success/error to toast
- `handleIconUpload()`: Already uses ImageManager local toasts (unchanged)

### SocialNetworksForm Pattern

**Reference Implementation**: `useSocialNetworksForm.ts`
**Key Features**:

- Toast deduplication logic
- 3-second duration consistency
- Structured message format
- Memory cleanup on unmount

## Data Flow

```
User Action → Form Handler → Toast Hook → Global Toaster → UI Display
     ↓              ↓              ↓              ↓
Save Setting → API Call → Result → Toast Notification → Auto-dismiss
```

## Validation Rules

### Toast Message Content

- Success messages: Action-oriented confirmation (e.g., "Website name updated successfully")
- Error messages: User-friendly problem description (e.g., "Failed to save website name")
- No technical jargon or stack traces in user-facing messages
- Consistent capitalization and punctuation

### Deduplication Logic

- Messages with identical descriptions are considered duplicates
- Duplicate prevention window: 3 seconds (toast duration)
- Rapid saves within window show only latest result
- Conflict notifications for overridden saves

## Performance Considerations

### Memory Management

- Automatic cleanup of toast timeouts
- Component unmount clears all active toasts
- Efficient Set/Map operations for deduplication
- No memory leaks from orphaned timeouts

### Rendering Performance

- Toast display latency: <200ms from save completion
- Minimal DOM impact with Chakra UI optimizations
- Efficient re-rendering through proper React patterns
- Smooth stacking behavior for multiple toasts
