# Research: Mobile Footer for Public Side

**Feature**: 032-mobile-footer  
**Date**: 2025-12-14  
**Status**: Complete

## Research Tasks

### 1. Mobile Touch Target Standards

**Decision**: Use 44x44 pixels as minimum touch target size

**Rationale**:

- Apple iOS Human Interface Guidelines recommend 44x44 points minimum
- Google Material Design recommends 48x48dp, but 44x44 is acceptable
- WCAG 2.1 Success Criterion 2.5.5 (AAA) specifies 44x44 CSS pixels
- Existing mobile header menu (031) already uses 44x44px, ensuring consistency

**Alternatives Considered**:

- 48x48px (Material Design): Rejected for consistency with existing 44x44px pattern
- 40x40px: Rejected as below accessibility guidelines

### 2. Responsive Breakpoint Strategy

**Decision**: Use 768px (md) as the mobile/desktop breakpoint

**Rationale**:

- Consistent with existing codebase (mobile header menu uses same breakpoint)
- Chakra UI default `md` breakpoint is 768px
- Standard tablet/phone boundary in responsive design
- Matches PublicHeaderMenu implementation

**Alternatives Considered**:

- 640px (sm): Too early transition, tablets would get mobile layout
- 1024px (lg): Too late, many tablets would get cramped mobile layout

### 3. Mobile Layout Pattern

**Decision**: Use stacked vertical layout with wrapped flex items on mobile

**Rationale**:

- Current implementation uses flexbox with wrap, which works but needs spacing adjustments
- Stacking social icons vertically on mobile provides better touch targets
- Maintains visual hierarchy with adequate spacing between items
- Follows KISS principle - minimal changes to existing flex layout

**Alternatives Considered**:

- Grid layout with fixed columns: More complex, requires additional responsive logic
- Horizontal scroll: Poor UX, requires additional swipe indication
- Collapsible/expandable footer: Over-engineered for current scope (YAGNI)

### 4. Touch Target Implementation

**Decision**: Add minimum dimensions to clickable wrapper, not just content

**Rationale**:

- Current SocialNetworkItem has no explicit touch target sizing
- Adding `minW="44px" minH="44px"` to the link wrapper ensures accessibility
- Icon size can remain at 28px for visual consistency, touch area is larger
- Matches implementation pattern from MobileMenuToggle

**Alternatives Considered**:

- Increase icon size to 44px: Would look oversized, breaks visual design
- Add padding only: Inconsistent, padding doesn't guarantee minimum size

### 5. Responsive Icon Sizing

**Decision**: Keep icon size consistent at 28px across all breakpoints

**Rationale**:

- Current 28px icon size is visually appropriate
- Touch target is achieved through wrapper sizing, not icon enlargement
- Maintains visual consistency with desktop view
- Follows KISS principle

**Alternatives Considered**:

- Larger icons on mobile (32px): Unnecessary if touch target is properly sized
- Smaller icons on desktop: Would reduce visual impact

### 6. Spacing Adjustments

**Decision**: Increase gap between items on mobile for easier touch interaction

**Rationale**:

- Current `gap={3}` (12px) may be tight for touch
- Mobile should use `gap={{ base: 4, md: 3 }}` (16px on mobile, 12px on desktop)
- Provides visual breathing room and reduces accidental taps

**Alternatives Considered**:

- Keep same spacing: Touch targets would be too close together
- Much larger spacing (24px+): Wastes valuable mobile screen space

## Resolved Clarifications

No NEEDS CLARIFICATION items from Technical Context - all requirements are clear based on:

- Existing mobile header menu patterns (031)
- Chakra UI responsive patterns already in codebase
- Standard accessibility guidelines (WCAG 2.1)
- Current SocialNetworksFooter implementation

## Dependencies

| Dependency   | Version  | Purpose                             |
| ------------ | -------- | ----------------------------------- |
| Chakra UI v3 | Existing | Responsive props, layout components |
| react-icons  | Existing | Social network icons                |
| Next.js 15   | Existing | App Router, React 19                |

## Implementation Approach

1. **SocialNetworkItem.tsx**: Add touch target sizing with `minW="44px" minH="44px"` on the link wrapper
2. **SocialNetworksFooter.tsx**: Adjust responsive spacing with mobile-optimized gaps
3. **Accessibility**: Ensure focus indicators are visible, semantic `<footer>` already in use
4. **No new components**: Enhancement only, following YAGNI principle
