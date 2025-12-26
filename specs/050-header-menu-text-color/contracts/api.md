# API Contracts: Header Menu Text Color Configuration

**Feature**: 050-header-menu-text-color  
**Date**: 2025-12-26

## Endpoints

### GET /api/settings/header-menu-text-color

Retrieve the current header menu text color setting.

**Request**:

- Method: `GET`
- Authentication: None required (public)
- Headers: None required

**Response**:

| Status | Body                                   | Description                     |
| ------ | -------------------------------------- | ------------------------------- |
| 200    | `{ "value": "#000000" }`               | Success - returns current color |
| 500    | `{ "error": "Internal server error" }` | Server error                    |

**Example Response**:

```json
{
  "value": "#000000"
}
```

---

### POST /api/settings/header-menu-text-color

Update the header menu text color setting.

**Request**:

- Method: `POST`
- Authentication: Required (admin only)
- Headers:
  - `Content-Type: application/json`
- Body:
  ```json
  {
    "value": "#ffffff"
  }
  ```

**Validation**:

- `value`: Required, must be valid hex color (`#[0-9a-fA-F]{6}`)

**Response**:

| Status | Body                                      | Description                |
| ------ | ----------------------------------------- | -------------------------- |
| 200    | `{ "success": true, "value": "#ffffff" }` | Success - color updated    |
| 400    | `{ "error": "Invalid color format" }`     | Invalid hex color          |
| 401    | `{ "error": "Non autorisé" }`             | Not authenticated          |
| 403    | `{ "error": "Accès refusé" }`             | Not authorized (not admin) |
| 500    | `{ "error": "Internal server error" }`    | Server error               |

**Example Request**:

```json
{
  "value": "#ffffff"
}
```

**Example Response**:

```json
{
  "success": true,
  "value": "#ffffff"
}
```

## Error Messages (French)

| Code | Message                      |
| ---- | ---------------------------- |
| 401  | "Non autorisé"               |
| 403  | "Accès refusé"               |
| 400  | "Format de couleur invalide" |
| 500  | "Erreur interne du serveur"  |

## Integration Notes

- Follows same pattern as `/api/settings/theme-color`
- Uses `SettingsServiceLocator` for dependency injection
- Includes proper logging via BackendLog
- Public GET for rendering, protected POST for admin updates
