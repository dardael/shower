# API Contract: Website Font Configuration

**Feature Branch**: `014-website-font-config`  
**Date**: 2025-12-03

## Endpoints

### GET /api/settings/website-font

Retrieves the current website font configuration.

**Authentication**: Not required (public endpoint)

**Request**: None

**Response**:

```typescript
// 200 OK
{
  "websiteFont": string  // Font name, e.g., "Inter"
}
```

**Headers**:

```
Cache-Control: public, max-age=1800, stale-while-revalidate=3600, immutable
ETag: "website-font-{fontName}"
```

**Example Response**:

```json
{
  "websiteFont": "Inter"
}
```

---

### POST /api/settings/website-font

Updates the website font configuration.

**Authentication**: Required (admin only)

**Request**:

```typescript
{
  "websiteFont": string  // Font name from AVAILABLE_FONTS list
}
```

**Response**:

```typescript
// 200 OK
{
  "message": string,
  "websiteFont": string
}

// 400 Bad Request
{
  "error": "Invalid font name"
}

// 401 Unauthorized
{
  "error": "Unauthorized"
}
```

**Example Request**:

```json
{
  "websiteFont": "Roboto"
}
```

**Example Response**:

```json
{
  "message": "Website font updated successfully",
  "websiteFont": "Roboto"
}
```

---

### GET /api/settings/available-fonts

Retrieves the list of available fonts.

**Authentication**: Not required (public endpoint)

**Request**: None

**Response**:

```typescript
// 200 OK
{
  "fonts": FontMetadata[]
}

interface FontMetadata {
  name: string;           // Display name
  family: string;         // CSS font-family value
  category: FontCategory; // serif, sans-serif, display, handwriting, monospace
  weights: number[];      // Available weights
}

type FontCategory = 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
```

**Headers**:

```
Cache-Control: public, max-age=86400, immutable
```

**Example Response**:

```json
{
  "fonts": [
    {
      "name": "Inter",
      "family": "'Inter', sans-serif",
      "category": "sans-serif",
      "weights": [400, 500, 600, 700]
    },
    {
      "name": "Roboto",
      "family": "'Roboto', sans-serif",
      "category": "sans-serif",
      "weights": [400, 500, 700]
    }
  ]
}
```

## TypeScript Types

```typescript
// src/app/api/settings/website-font/types.ts

export interface GetWebsiteFontResponse {
  websiteFont: string;
}

export interface UpdateWebsiteFontRequest {
  websiteFont: string;
}

export interface UpdateWebsiteFontResponse {
  message: string;
  websiteFont: string;
}

export interface GetAvailableFontsResponse {
  fonts: FontMetadata[];
}

export interface FontMetadata {
  name: string;
  family: string;
  category: FontCategory;
  weights: number[];
}

export type FontCategory =
  | 'serif'
  | 'sans-serif'
  | 'display'
  | 'handwriting'
  | 'monospace';
```

## Error Responses

| Status | Error                 | Description                       |
| ------ | --------------------- | --------------------------------- |
| 400    | Invalid font name     | Font not in AVAILABLE_FONTS list  |
| 401    | Unauthorized          | Missing or invalid authentication |
| 500    | Internal server error | Database or server error          |

## Caching Strategy

| Endpoint             | Cache Duration | Strategy                |
| -------------------- | -------------- | ----------------------- |
| GET /website-font    | 30 minutes     | stale-while-revalidate  |
| GET /available-fonts | 24 hours       | immutable (static list) |
| POST /website-font   | N/A            | Invalidates GET cache   |
