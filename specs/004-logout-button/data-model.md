# Data Model: Admin Logout Button

**Feature**: 004-logout-button  
**Date**: 2025-11-27  
**Status**: Complete

## Overview

This feature does not introduce new data entities or modify existing data schemas. It leverages existing session management infrastructure provided by BetterAuth and MongoDB.

## Existing Entities Used

### Admin Session (Managed by BetterAuth)

**Source**: `/src/infrastructure/auth/BetterAuthInstance.ts` (session configuration)

**Description**: Represents the authenticated state of an administrator. BetterAuth manages session data in MongoDB with the following configuration:

**Session Attributes**:

- `expiresIn`: 604800 seconds (7 days)
- `updateAge`: 86400 seconds (1 day)
- `cookieCache.enabled`: true
- `cookieCache.maxAge`: 300 seconds (5 minutes)
- `cookiePrefix`: 'better-auth'

**Storage**: MongoDB (via BetterAuth database adapter)

**Session Lifecycle**:

1. **Creation**: Session created on successful Google OAuth authentication
2. **Validation**: Session checked by `AdminPageAuthenticatorator.getSession()`
3. **Termination**: Session cleared via `authClient.signOut()` (this feature)

**Related Interfaces**:

- `IBetterAuthClientService.signOut(): Promise<void>` - Logout operation
- `IAdminPageAuthenticatorator.getSession(): Promise<Session | null>` - Session retrieval

### User (Existing Entity)

**Source**: Domain entity managed by BetterAuth

**Description**: User account information stored by BetterAuth authentication system

**Relevant Attributes** (used for authorization):

- `email`: User's email address (validated against `ADMIN_EMAIL` environment variable)
- Authentication tokens (managed internally by BetterAuth)
- Session identifiers (linked to Admin Session)

**Usage in Feature**: User email verified during logout to ensure admin authorization (though logout itself doesn't require validation)

## State Transitions

### Logout Flow State Diagram

```
[Authenticated Admin]
        ↓
    Click Logout Button
        ↓
    [Loading State]
        ↓
    Call authClient.signOut()
        ↓
    ┌─────────────┴─────────────┐
    ↓                           ↓
[Logout Success]        [Logout Failure]
    ↓                           ↓
Clear Session Data      Log Error + Clear Local State
    ↓                           ↓
    └─────────────┬─────────────┘
                  ↓
          Redirect to /admin
                  ↓
          Router Refresh
                  ↓
      [Unauthenticated User]
                  ↓
    Admin Guard Redirects to Login
                  ↓
           [Login Page]
```

### Component State Transitions

**LogoutButton Component States**:

1. **Idle**: Button ready for interaction
   - `isLoading`: false
   - User can click button

2. **Loading**: Logout in progress
   - `isLoading`: true
   - Button shows loading indicator
   - Button disabled to prevent duplicate clicks

3. **Complete**: Logout finished (success or failure)
   - `isLoading`: false (briefly before redirect)
   - Redirect to `/admin` page
   - Router refresh clears cached data

## Validation Rules

### No New Validation Required

This feature does not introduce new validation rules. Existing validation applies:

1. **Authentication Validation** (handled by middleware and admin guard):
   - User must be authenticated to access admin pages
   - Session must be valid and unexpired

2. **Authorization Validation** (handled by `AuthorizeAdminAccess`):
   - User email must match `ADMIN_EMAIL` environment variable
   - Checked before rendering admin pages (including sidebar with logout button)

3. **Logout Operation** (no validation required):
   - Any authenticated user can logout
   - Logout gracefully handles invalid or expired sessions
   - No user input to validate

## Relationships

### Component Dependencies

```
LogoutButton Component
    ↓ uses
BetterAuthClientAdapter
    ↓ implements
IBetterAuthClientService
    ↓ wraps
BetterAuth Client (better-auth/react)
    ↓ calls
BetterAuth API (/api/auth/sign-out)
    ↓ modifies
Admin Session (MongoDB)
```

### Integration Points

1. **AdminSidebar Component**:
   - Hosts LogoutButton alongside DarkModeToggle
   - Visible on all admin pages

2. **Admin Layout**:
   - Contains AdminSidebar with logout button
   - Protected by authentication guard

3. **Admin Authentication Guard**:
   - Validates session before rendering admin pages
   - Redirects unauthenticated users after logout

4. **Login Page**:
   - Target destination for unauthenticated users
   - Re-authentication entry point after logout

## Data Flow

### Logout Operation Data Flow

```
User Click Event
    ↓
LogoutButton.handleSignOut()
    ↓
setState({ isLoading: true })
    ↓
authClient.signOut()
    ↓
POST /api/auth/sign-out
    ↓
BetterAuth Backend
    ↓
Delete Session from MongoDB
    ↓
Clear Session Cookies
    ↓
Return Success/Error Response
    ↓
LogoutButton receives response
    ↓
logger.info() or logger.error()
    ↓
router.push('/admin')
    ↓
router.refresh()
    ↓
Admin Guard checks session
    ↓
No valid session found
    ↓
Redirect to Login Page
```

### Session Data Cleared on Logout

**Client-Side**:

- Session cookies (prefixed with 'better-auth')
- Cached session data in browser
- Router cache via `router.refresh()`

**Server-Side** (via BetterAuth):

- MongoDB session document deleted
- Session tokens invalidated
- Authentication state cleared

## Storage Considerations

### No New Storage Requirements

This feature does not require:

- New database collections
- New database fields
- New indexes
- Data migrations
- Schema changes

### Existing Storage Used

**MongoDB Collections** (managed by BetterAuth):

- Sessions collection (existing)
- Users collection (existing)

**Browser Storage**:

- HTTP-only session cookies (existing, cleared on logout)
- Local storage: None required for this feature
- Session storage: None required for this feature

## Performance Implications

### Data Operations

1. **Logout API Call**: Single POST request to `/api/auth/sign-out`
   - Expected duration: < 500ms
   - Network latency dependent

2. **Session Deletion**: Single MongoDB delete operation
   - Expected duration: < 100ms
   - Handled by BetterAuth automatically

3. **Cookie Clearing**: Browser operation
   - Duration: < 10ms
   - Synchronous operation

**Total Expected Logout Time**: < 2 seconds (per spec SC-002)

## Summary

This feature introduces no new data entities or data models. It operates entirely on existing session management infrastructure provided by BetterAuth. The logout operation is a simple state transition from authenticated to unauthenticated, with session cleanup handled automatically by BetterAuth's session management system.

All data operations are reads and deletes on existing entities, with no new data creation or schema modifications required.
