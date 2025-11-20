# Research: Dark Mode Toggle Implementation

**Feature**: Dark Mode Toggle  
**Date**: 2025-11-23  
**Research Focus**: Chakra UI v3 dark mode patterns and Next.js 15 integration

## Technology Decisions

### Chakra UI v3 Dark Mode System

**Decision**: Use Chakra UI v3's built-in color mode system with `next-themes` integration

**Rationale**:

- Chakra UI v3 provides built-in dark mode support through `next-themes`
- Automatic localStorage persistence and cross-tab synchronization
- Server-side rendering compatibility with hydration mismatch prevention
- Semantic token system for consistent theming
- Accessibility features built-in

**Alternatives considered**:

- Manual theme implementation: More complex, requires custom state management
- CSS-in-JS solutions: Less integrated with Chakra ecosystem
- Third-party theme libraries: Additional dependency, potential conflicts

### Theme Provider Architecture

**Decision**: Use Chakra UI v3's Provider component with ColorModeProvider

**Rationale**:

- Seamless integration with Next.js App Router
- Automatic hydration handling
- Built-in theme detection and persistence
- Clean separation of concerns

**Alternatives considered**:

- Custom theme context: More boilerplate, potential hydration issues
- Global state management: Overkill for simple theme toggle

### Browser Storage Strategy

**Decision**: Use `next-themes` localStorage integration with fallback handling

**Rationale**:

- Automatic localStorage persistence
- Cross-tab synchronization
- Graceful fallback when localStorage unavailable
- No additional storage logic required

**Alternatives considered**:

- Custom localStorage implementation: More code, potential edge cases
- Session storage: Doesn't persist across sessions
- Cookie-based storage: Server overhead, unnecessary for client-side preference

## Implementation Patterns

### Component Structure

**Theme Toggle Component**:

- Use `useColorMode` hook from Chakra UI v3
- Implement with `IconButton` for clean UI
- Include proper accessibility labels
- Handle hydration mismatch with `ClientOnly` or mounted state

**Theme Provider Integration**:

- Wrap admin layout with Provider component
- Ensure client-side rendering for theme-dependent components
- Use semantic tokens for automatic dark mode adaptation

### Accessibility Considerations

**Decision**: Implement full keyboard navigation and screen reader support

**Rationale**:

- WCAG compliance requirements
- Inclusive design principles
- Better user experience for all users

**Implementation**:

- Proper aria-labels on toggle button
- Keyboard navigation support (Enter, Space)
- Focus management and visual indicators
- High contrast colors in both themes

### Performance Considerations

**Decision**: Optimize for immediate theme switching and minimal re-renders

**Rationale**:

- User expectation for instant visual feedback
- Minimal performance impact on admin interface
- Efficient state management

**Implementation**:

- Use Chakra's optimized color mode system
- Minimize component re-renders during theme changes
- Leverage browser's native theme detection

## Technical Specifications

### Dependencies

```json
{
  "@chakra-ui/react": "^3.0.0",
  "@chakra-ui/icons": "^3.0.0",
  "next-themes": "^0.3.0" // Included with Chakra UI v3
}
```

### File Structure

```
src/
├── presentation/
│   ├── admin/
│   │   ├── components/
│   │   │   └── DarkModeToggle.tsx
│   │   └── hooks/
│   │       └── useTheme.ts
│   └── shared/
│       ├── components/
│       │   └── ui/
│       │       ├── color-mode.tsx
│       │       └── provider.tsx
│       └── contexts/
│           └── ThemeContext.tsx
├── domain/
│   └── settings/
│       ├── entities/
│       │   └── ThemePreference.ts
│       └── value-objects/
│           └── ThemeMode.ts
├── application/
│   └── settings/
│       ├── GetThemePreference.ts
│       ├── UpdateThemePreference.ts
│       └── services/
│           └── LocalStorageThemeService.ts
└── infrastructure/
    └── settings/
        └── adapters/
            └── BrowserStorageAdapter.ts
```

### Integration Points

1. **Admin Layout**: Integrate Provider component and theme toggle
2. **Admin Sidebar**: Add DarkModeToggle component horizontally aligned with "Admin Panel" label
3. **Theme Context**: Provide theme state to admin components
4. **Storage Service**: Handle localStorage operations with error handling

## Testing Strategy

### Unit Tests

- Theme toggle component behavior
- Theme preference entity logic
- Storage service functionality
- Hook behavior and state management

### Integration Tests

- Theme persistence across page refreshes
- Browser theme detection on first access
- localStorage unavailability handling
- Cross-tab synchronization

### Accessibility Tests

- Keyboard navigation
- Screen reader compatibility
- Focus management
- Color contrast validation

## Risk Mitigation

### Hydration Mismatch

- Use `ClientOnly` component or mounted state
- Implement proper loading states
- Test across different browsers and devices

### localStorage Unavailability

- Implement graceful degradation
- Provide user feedback when storage unavailable
- Fallback to system preference

### Browser Compatibility

- Test across modern browsers
- Implement progressive enhancement
- Provide fallback for older browsers

## Success Metrics

- Theme switching occurs within 100ms of button click
- Theme preference persists across 100% of browser sessions
- Zero hydration mismatches in production
- 100% accessibility compliance for theme toggle
- Graceful degradation when localStorage unavailable
