# API Contracts: Admin Logout Button

**Feature**: 004-logout-button  
**Date**: 2025-11-27  
**Status**: Complete

## Overview

This feature uses existing BetterAuth API endpoints. No new API endpoints are created. This document describes the existing logout endpoint used by the LogoutButton component.

## Existing API Endpoints

### POST /api/auth/sign-out

**Description**: Terminates the current user session and clears authentication tokens

**Provider**: BetterAuth (via `/src/app/api/auth/[...all]/route.ts`)

**Authentication**: Required (user must have valid session)

**Authorization**: Any authenticated user can logout

---

#### Request

**Method**: POST

**URL**: `/api/auth/sign-out`

**Headers**:

```http
Content-Type: application/json
Cookie: better-auth-session=<session-token>
```

**Body**: Empty or minimal configuration

```json
{}
```

**Optional Body Parameters** (BetterAuth features, not used in this implementation):

```json
{
  "revokeAllSessions": false
}
```

---

#### Response - Success

**Status Code**: 200 OK

**Headers**:

```http
Content-Type: application/json
Set-Cookie: better-auth-session=; Max-Age=0; Path=/; HttpOnly
```

**Body**:

```json
{
  "data": {},
  "error": null
}
```

**Side Effects**:

- Session document deleted from MongoDB
- Session cookies cleared (Set-Cookie with Max-Age=0)
- Authentication state invalidated

---

#### Response - Error (Network Failure)

**Status Code**: 500 Internal Server Error or Network Error

**Body**:

```json
{
  "data": null,
  "error": {
    "message": "Failed to sign out",
    "status": 500,
    "statusText": "Internal Server Error"
  }
}
```

**Client Handling**:

- Log error with context
- Proceed with local session clearing
- Redirect to `/admin` (which redirects to login)
- Router refresh to clear cached data

---

#### Response - Error (Invalid Session)

**Status Code**: 401 Unauthorized

**Body**:

```json
{
  "data": null,
  "error": {
    "message": "No active session",
    "status": 401,
    "statusText": "Unauthorized"
  }
}
```

**Client Handling**:

- Already logged out (no-op)
- Redirect to `/admin` (which redirects to login)

---

## Client-Side API Usage

### BetterAuth Client Adapter

**File**: `/src/infrastructure/auth/adapters/BetterAuthClientAdapter.ts`

**Method**: `signOut(): Promise<void>`

**Implementation Pattern**:

```typescript
async signOut(): Promise<void> {
  try {
    const client = this.getClient();
    await client.signOut();
  } catch (error) {
    throw error;
  }
}
```

**Usage in LogoutButton**:

```typescript
const authClient = new BetterAuthClientAdapter();

const handleSignOut = async () => {
  setIsLoading(true);

  try {
    await authClient.signOut();
    logger.info('User logged out successfully');
  } catch (error) {
    logger.error('Logout failed, clearing local session', error);
  } finally {
    router.push('/admin');
    router.refresh();
  }
};
```

---

## API Flow Diagram

```
Client (LogoutButton)
    ↓
    | Click Event
    ↓
authClient.signOut()
    ↓
    | HTTP POST Request
    ↓
/api/auth/sign-out
    ↓
    | Route Handler
    ↓
BetterAuth Backend
    ↓
    | Session Validation
    ↓
MongoDB Session Delete
    ↓
    | Clear Cookies
    ↓
Response (200 OK)
    ↓
    | Success Callback
    ↓
Client Router Redirect
    ↓
    | Navigate to /admin
    ↓
Admin Guard Check
    ↓
    | No Session Found
    ↓
Redirect to Login Page
```

---

## Error Handling Strategy

### Network Errors

**Scenario**: Request fails due to network connectivity issues

**Client Behavior**:

1. Catch error in try-catch block
2. Log error: `logger.error('Logout failed, clearing local session', error)`
3. Proceed with redirect: `router.push('/admin')`
4. Clear client cache: `router.refresh()`

**Rationale**: Users must always be able to logout locally even if server-side logout fails

### Session Already Invalid

**Scenario**: User session expired or already logged out

**API Response**: 401 Unauthorized or success (no-op)

**Client Behavior**:

1. Treat as success (user is logged out)
2. Proceed with redirect to login page

### Multiple Logout Requests

**Scenario**: User clicks logout button multiple times rapidly

**Prevention**: Loading state disables button during logout

**Implementation**:

```typescript
const [isLoading, setIsLoading] = useState(false);

<IconButton
  onClick={handleSignOut}
  disabled={isLoading}
  loading={isLoading}
>
```

---

## Security Considerations

### CSRF Protection

BetterAuth includes CSRF protection for all authenticated endpoints:

- CSRF token validated in session
- Requests from unauthorized origins rejected

### Cookie Security

Session cookies use secure settings:

- `HttpOnly`: true (prevents XSS access)
- `SameSite`: Lax (CSRF protection)
- `Secure`: true (HTTPS only in production)
- `Path`: / (app-wide)

### Session Validation

Before logout:

1. Session cookie validated
2. Session exists in MongoDB
3. Session not expired

After logout:

1. Session document deleted
2. Cookies cleared with Max-Age=0
3. Authentication state invalidated

---

## Testing Contracts

### Unit Tests (when requested)

**Mock API Responses**:

Success Response:

```typescript
const mockSuccessResponse = {
  data: {},
  error: null,
};

jest.spyOn(authClient, 'signOut').mockResolvedValue(mockSuccessResponse);
```

Error Response:

```typescript
const mockErrorResponse = {
  data: null,
  error: {
    message: 'Network error',
    status: 500,
    statusText: 'Internal Server Error',
  },
};

jest.spyOn(authClient, 'signOut').mockRejectedValue(mockErrorResponse);
```

### Integration Tests (when requested)

1. **Successful Logout Flow**:
   - Authenticate user
   - Click logout button
   - Verify POST to `/api/auth/sign-out`
   - Verify session cleared
   - Verify redirect to login page

2. **Error Handling Flow**:
   - Mock network failure
   - Click logout button
   - Verify error logged
   - Verify redirect still occurs
   - Verify user cannot access admin pages

---

## API Rate Limiting

**Current Status**: Not implemented for logout endpoint

**Recommendation**: Not needed because:

- Logout is not a sensitive operation (ends session)
- Loading state prevents rapid duplicate requests
- Server-side logout is idempotent (multiple calls have same effect)
- No security risk from repeated logout attempts

---

## Summary

This feature uses the existing `/api/auth/sign-out` endpoint provided by BetterAuth. No new API contracts are defined. The endpoint is well-documented, follows REST conventions, and includes proper error handling. Client-side usage is abstracted through the BetterAuthClientAdapter, maintaining clean architecture separation.

All API interactions are handled through the existing infrastructure with no modifications required to the backend API layer.
