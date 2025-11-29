# Data Model: Header Logo Configuration

**Feature**: 008-header-logo  
**Date**: 2025-11-29

## Entities and Value Objects

### HeaderLogo (Value Object)

Represents the header logo image with metadata. Similar to WebsiteIcon but semantically distinct.

| Field        | Type   | Description                    | Validation                                                                    |
| ------------ | ------ | ------------------------------ | ----------------------------------------------------------------------------- |
| url          | string | Full URL path to the logo file | Required, valid URL format, must end with valid image extension               |
| filename     | string | Generated unique filename      | Required, non-empty                                                           |
| originalName | string | Original uploaded filename     | Required, non-empty                                                           |
| size         | number | File size in bytes             | Required, > 0, <= 2MB (2,097,152 bytes)                                       |
| format       | string | File extension                 | Required, one of: png, jpg, jpeg, svg, gif, webp                              |
| mimeType     | string | MIME type                      | Required, one of: image/png, image/jpeg, image/svg+xml, image/gif, image/webp |
| uploadedAt   | Date   | Upload timestamp               | Required, valid date, not in future                                           |

**Relationships**:

- Stored in WebsiteSettings collection with key `header-logo`
- Displayed in PublicHeaderMenu before MenuItem list

### WebsiteSetting (Existing Entity - Extended)

The existing WebsiteSetting entity will store the HeaderLogo data.

| Key           | Value Type       | Description                  |
| ------------- | ---------------- | ---------------------------- |
| `header-logo` | LogoValue (JSON) | Header logo metadata and URL |

**LogoValue Structure**:

```typescript
interface LogoValue {
  url: string;
  metadata: {
    filename: string;
    originalName: string;
    size: number;
    format: string;
    mimeType: string;
    uploadedAt: Date;
  };
}
```

## State Transitions

### Logo Upload Flow

```
[No Logo] --upload--> [Logo Configured]
[Logo Configured] --replace--> [Logo Configured] (new file)
[Logo Configured] --delete--> [No Logo]
```

### Logo Display States

| State              | Admin View                          | Public View                             |
| ------------------ | ----------------------------------- | --------------------------------------- |
| No logo configured | Upload area (empty state)           | Header without logo                     |
| Logo uploading     | Upload progress indicator           | N/A                                     |
| Logo configured    | Preview with replace/delete buttons | Logo displayed left of menu             |
| Logo load error    | Error message with retry            | Header without logo (graceful fallback) |

## File Storage

### Directory Structure

```
public/
└── icons/
    └── logo-{timestamp}-{random}.{ext}
```

**Note**: Reuses existing icons directory from website icon feature.

### File Naming Convention

Pattern: `logo-{timestamp}-{6-char-random}.{extension}`

Example: `logo-1732892400000-a3b2c1.png`

## Database Schema

Uses existing WebsiteSettingsModel (MongoDB/Mongoose):

```typescript
// Existing schema - no changes needed
{
  key: 'header-logo',
  value: {
    type: 'logo',
    content: {
      url: 'http://localhost:3000/api/icons/logo-1732892400000-a3b2c1.png',
      metadata: {
        filename: 'logo-1732892400000-a3b2c1.png',
        originalName: 'company-logo.png',
        size: 45678,
        format: 'png',
        mimeType: 'image/png',
        uploadedAt: '2025-11-29T12:00:00.000Z'
      }
    }
  }
}
```

## Validation Rules

### File Upload Validation

| Rule          | Constraint               | Error Message                                                               |
| ------------- | ------------------------ | --------------------------------------------------------------------------- |
| File type     | PNG, JPG, SVG, GIF, WebP | "Invalid file type. Only PNG, JPG, SVG, GIF, and WebP formats are allowed." |
| File size     | Max 2MB                  | "File size too large. Maximum size is 2MB."                                 |
| File presence | Required for upload      | "No file provided"                                                          |

### Value Object Validation

| Rule          | Constraint            | Error Message                                                                   |
| ------------- | --------------------- | ------------------------------------------------------------------------------- |
| URL format    | Valid URL             | "Header logo URL must be a valid URL"                                           |
| URL extension | Valid image extension | "Header logo must have a valid extension: .png, .jpg, .jpeg, .svg, .gif, .webp" |
| Filename      | Non-empty             | "Header logo filename cannot be empty"                                          |
| Original name | Non-empty             | "Header logo original name cannot be empty"                                     |
| Size          | > 0 and <= 2MB        | "Header logo size must be between 0 and 2MB"                                    |
| Format        | Valid format          | "Header logo format must be one of: png, jpg, jpeg, svg, gif, webp"             |
| MIME type     | Valid MIME            | "Header logo MIME type must be valid"                                           |
| Upload date   | Valid, not future     | "Header logo upload date must be valid"                                         |

## API Response Types

### Logo Response (GET /api/settings/logo, GET /api/public/logo)

```typescript
// Success with logo
{
  logo: {
    url: string;
    filename: string;
    originalName: string;
    size: number;
    format: string;
    mimeType: string;
    uploadedAt: string; // ISO date
  }
}

// No logo configured
{
  logo: null;
}
```

### Upload Response (POST /api/settings/logo)

```typescript
{
  message: 'Header logo updated successfully';
  logo: {
    url: string;
    filename: string;
    originalName: string;
    size: number;
    format: string;
    mimeType: string;
    uploadedAt: string;
  }
}
```

### Delete Response (DELETE /api/settings/logo)

```typescript
{
  message: 'Header logo removed successfully';
}
```
