# API Contracts: Logo Home Redirect

**Feature**: 021-logo-home-redirect  
**Date**: 2025-01-04

## Summary

This feature requires **no API changes**. The implementation is purely a presentation layer modification.

## No New Endpoints

No new API endpoints are required.

## No Modified Endpoints

No existing API endpoints are modified.

## Existing Endpoints (Unchanged)

The following endpoints remain unchanged and continue to work as expected:

- `GET /api/public/menu` - Returns menu items and logo data (no changes)
- `GET /api/settings/logo` - Returns logo configuration (no changes)

The frontend simply uses the existing logo data and wraps it in a navigational link.
