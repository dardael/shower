# Research: Admin Background Color Preview

**Feature**: 026-admin-bgcolor-preview  
**Date**: 2025-12-12

## Research Summary

All technical decisions are resolved based on existing codebase patterns.

### Decision 1: Color Value Source

**Decision**: Reuse existing `BACKGROUND_COLOR_MAP` from `provider.tsx`

**Rationale**: The map already contains accurate light/dark hex values used by the public site. Reusing it ensures 100% accuracy (FR-007) and follows DRY principle.

**Alternatives considered**:

- Create separate preview color map: Rejected - would duplicate data and risk inconsistency
- Compute colors dynamically: Rejected - adds complexity, existing map is sufficient

### Decision 2: Color Mode Detection

**Decision**: Use existing `useColorMode()` hook from `color-mode.tsx`

**Rationale**: Already integrated with next-themes, provides reliable real-time mode detection. Returns `colorMode: 'light' | 'dark'` which directly maps to BACKGROUND_COLOR_MAP keys.

**Alternatives considered**:

- Read from system preferences directly: Rejected - app may override system preference
- Create custom detection: Rejected - unnecessary duplication of existing functionality

### Decision 3: Preview Location

**Decision**: Add preview element within BackgroundColorSelector component, positioned below color options

**Rationale**: Keeps preview contextually close to color selection. Follows existing component patterns. Minimal change footprint.

**Alternatives considered**:

- Separate preview component: Rejected - adds unnecessary abstraction for simple feature
- Preview in WebsiteSettingsForm: Rejected - tightly couples preview to form structure

### Decision 4: Test Strategy

**Decision**: Create unit tests for BackgroundColorSelector preview functionality and integration tests for color mode switching

**Rationale**: User explicitly requested tests for displayed color and light/dark mode switch. Follows constitution principle II (tests only when requested).

**Alternatives considered**:

- E2E tests: Rejected - overkill for component-level feature
- No tests: Rejected - user explicitly requested tests

## Technical Findings

### BACKGROUND_COLOR_MAP Structure

```typescript
const BACKGROUND_COLOR_MAP: Record<
  ThemeColorToken,
  { light: string; dark: string }
> = {
  blue: { light: '#eff6ff', dark: '#1e3a5f' },
  red: { light: '#fef2f2', dark: '#450a0a' },
  green: { light: '#f0fdf4', dark: '#14532d' },
  purple: { light: '#faf5ff', dark: '#3b0764' },
  orange: { light: '#fff7ed', dark: '#431407' },
  teal: { light: '#f0fdfa', dark: '#134e4a' },
  pink: { light: '#fdf2f8', dark: '#500724' },
  cyan: { light: '#ecfeff', dark: '#164e63' },
};
```

### useColorMode Hook Usage

```typescript
import { useColorMode } from '@/presentation/shared/components/ui/color-mode';
const { colorMode } = useColorMode(); // 'light' | 'dark'
```

### Existing Test Patterns

- File naming: `[ComponentName].test.tsx`
- Wrapper: `renderWithChakra(ui)`
- Selectors: `data-testid` attributes
- Integration tests in: `test/integration/`

## Unresolved Items

None - all technical decisions resolved.
