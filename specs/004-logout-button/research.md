# Research: Admin Logout Button

**Feature**: 004-logout-button  
**Date**: 2025-11-27  
**Status**: Complete

## Overview

Research phase for implementing admin logout button functionality. Investigation reveals that core logout functionality already exists in the codebase and follows clean architecture patterns.

## Research Areas

### 1. BetterAuth Logout Implementation

**Decision**: Use existing `BetterAuthClientAdapter.signOut()` method

**Rationale**:

- BetterAuth client adapter already exists at `/src/infrastructure/auth/adapters/BetterAuthClientAdapter.ts`
- Follows hexagonal architecture with proper interface segregation
- Automatically handles session clearing and token management
- Configured with MongoDB persistence for session management

**Implementation Pattern**:

```typescript
await authClient.signOut();
router.push('/admin');
router.refresh();
```

**Alternatives Considered**:

- Manual session clearing: Rejected because BetterAuth handles this automatically and more reliably
- Custom logout API endpoint: Rejected because BetterAuth provides `/api/auth/sign-out` endpoint automatically
- Direct cookie manipulation: Rejected because violates encapsulation and may miss session cleanup

**Key Findings**:

- BetterAuth automatically clears session cookies (prefixed with `better-auth`)
- Server-side session records removed from MongoDB on logout
- Session configuration: 7-day expiration, cookie cache enabled
- No manual token clearing needed

### 2. Logout Button Component

**Decision**: LogoutButton component already exists at `/src/presentation/shared/components/LogoutButton.tsx`

**Current Implementation**:

- Uses `BetterAuthClientAdapter` for logout
- Redirects to `/admin` (which redirects unauthenticated users to login)
- Styled with Chakra UI Button component
- Uses `FiLogOut` icon from react-icons/fi

**Rationale for Existing Implementation**:

- Follows DDD and hexagonal architecture patterns
- Uses dependency injection through adapter pattern
- Graceful error handling with fallback redirect
- Consistent with codebase styling patterns

**Enhancements Needed**:

- Add loading state during logout operation
- Enhance error logging for security monitoring
- Convert to IconButton for sidebar placement (matching DarkModeToggle)
- Position next to DarkModeToggle in admin sidebar

**Alternatives Considered**:

- Building from scratch: Rejected because existing component follows architecture correctly
- Using custom logout logic: Rejected because adapter pattern already implemented
- Different icon libraries: Rejected because Feather Icons (fi) already used consistently in sidebar

### 3. Icon Selection

**Decision**: Use `FiLogOut` from `react-icons/fi` (already implemented)

**Rationale**:

- Feather Icons are the primary icon set for UI controls in the codebase
- `FiLogOut` already used in existing LogoutButton component
- Matches AdminSidebar icon style (FiMenu, FiX)
- Universally recognized logout symbol
- Clean outline style consistent with DarkModeToggle aesthetic

**Icon Details**:

- Import: `import { FiLogOut } from 'react-icons/fi';`
- Visual: Minimalist outline arrow pointing right through door/rectangle
- Size: Use `size={16-18}` to match sidebar controls

**Alternatives Considered**:

- `LuLogOut` from Lucide: Similar style, matches DarkModeToggle icon set but less consistent with sidebar
- `FiPower` power button: Rejected because implies "shutdown" not "logout"
- `LuDoorOpen` open door: Rejected because less immediately recognizable

### 4. Error Handling Strategy

**Decision**: Graceful fallback with local session clearing

**Rationale**:

- Aligns with spec requirement for network failure handling
- Ensures users can always log out locally
- Admin authentication guard prevents re-access to admin pages
- Logging provides security audit trail

**Implementation Pattern**:

```typescript
try {
  await authClient.signOut();
  logger.info('User logged out successfully');
} catch (error) {
  logger.error('Logout failed, clearing local session', error);
} finally {
  router.push('/admin');
  router.refresh();
}
```

**Edge Cases Handled**:

- Network failures: Always redirect to clear local state
- Multiple rapid clicks: Loading state prevents duplicate requests
- Browser back button: Admin guard redirects unauthenticated users
- Unsaved form changes: Not handled (per spec, no confirmation dialog)

**Alternatives Considered**:

- Block logout on error: Rejected because users must always be able to logout
- Show error modal: Rejected because adds complexity without user value (they still logout locally)
- Retry logic: Rejected because single attempt with fallback is simpler and sufficient

### 5. Placement and Visual Consistency

**Decision**: Position LogoutButton as IconButton next to DarkModeToggle in admin sidebar

**Rationale**:

- Spec requirement: "next to the toggle dark mode button"
- Spec requirement: "round button with an icon like the dark mode toggle"
- Follows existing sidebar control pattern
- Visually groups related admin controls

**Implementation Pattern** (from DarkModeToggle):

```typescript
<IconButton
  aria-label="Sign out"
  title="Sign out"
  variant="ghost"
  size="sm"
  boxSize="8"
  _hover={{ bg: 'bg.muted', borderColor: 'border.emphasized' }}
>
  <FiLogOut color="currentColor" />
</IconButton>
```

**Styling Requirements**:

- Use semantic color tokens: `bg="bg.subtle"`, `color="fg"`
- Ensure proper contrast in both light and dark modes
- Match DarkModeToggle sizing: `boxSize="8"`, `size="sm"`
- Use ghost variant for consistency

**Alternatives Considered**:

- Full button with text: Rejected because spec requires icon-only "like the dark mode toggle"
- Different placement: Rejected because spec explicitly states "next to the toggle dark mode button"
- Different styling: Rejected because spec requires visual consistency with dark mode toggle

## Dependencies and Integration Points

### Existing Components

- `/src/presentation/shared/components/LogoutButton.tsx` - Existing implementation
- `/src/presentation/shared/components/DarkModeToggle.tsx` - Visual reference for styling
- `/src/presentation/admin/components/AdminSidebar.tsx` - Target placement location

### Existing Services

- `/src/infrastructure/auth/adapters/BetterAuthClientAdapter.ts` - Logout method
- `/src/application/auth/services/IBetterAuthClientService.ts` - Service interface
- `/src/infrastructure/auth/BetterAuthInstance.ts` - Session configuration

### External Dependencies

- `better-auth/react` - Client-side authentication methods
- `react-icons/fi` - Feather Icons for logout icon
- `@chakra-ui/react` - UI component library
- `next/navigation` - Router for redirect

## Testing Strategy

**When Tests are Requested** (per constitution, only when explicitly asked):

### Unit Tests

- LogoutButton component rendering in light/dark modes
- Click handler invokes logout method
- Loading state displays during logout
- Error handling with fallback redirect
- Accessibility attributes present

### Integration Tests

- Logout flow: click button → session cleared → redirected to login
- Admin guard prevents re-access after logout
- Multiple logout attempts handled gracefully

### Mocking Strategy

- Mock `BetterAuthClientAdapter.signOut()` for component tests
- Mock `useRouter` from next/navigation
- Mock `useLogger` for logging tests
- Use real Chakra UI components (no mocking per constitution)

## Security Considerations

- Session termination clears authentication tokens automatically (BetterAuth)
- MongoDB session records removed on successful logout
- Client-side cookie clearing via BetterAuth
- Admin guard prevents unauthorized access after logout
- All logout events logged for security audit trail
- No sensitive data exposure in error messages
- Graceful failure ensures users can always logout locally

## Performance Considerations

- Session termination completes in under 2 seconds (per spec SC-002)
- No performance monitoring code (per constitution)
- Router.refresh() clears client-side cached data
- Logout is async but non-blocking with loading state

## Summary

Research reveals that core logout functionality already exists and follows architecture patterns correctly. Main work involves:

1. Converting existing LogoutButton to IconButton format
2. Positioning next to DarkModeToggle in admin sidebar
3. Adding loading state and enhanced logging
4. Ensuring visual consistency with dark mode toggle

No new infrastructure or services needed - all dependencies exist and are properly architected.
