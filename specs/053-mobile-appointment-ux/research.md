# Research: Mobile Appointment Booking UX Improvements

**Feature**: 053-mobile-appointment-ux  
**Date**: 2025-06-26  
**Status**: Complete

## Research Questions

### RQ-001: How to implement responsive step indicator with Chakra UI v3?

**Decision**: Use Chakra UI v3 Steps component with `useBreakpointValue` hook for orientation switching

**Rationale**:

- Chakra UI v3 provides a native `Steps` component with built-in `orientation` prop supporting 'horizontal' | 'vertical'
- The `useBreakpointValue` hook allows dynamic switching between vertical (mobile) and horizontal (desktop) layouts
- This approach follows Chakra UI patterns and maintains accessibility features

**Implementation**:

```tsx
import { useBreakpointValue } from '@chakra-ui/react';

const orientation = useBreakpointValue({
  base: 'vertical', // mobile < 768px
  md: 'horizontal', // desktop >= 768px
});

<Steps.Root orientation={orientation} step={currentStep}>
  <Steps.List>
    <Steps.Item>
      <Steps.Trigger onClick={() => handleStepClick(index)}>
        <Steps.Indicator />
        <Steps.Title />
      </Steps.Trigger>
      <Steps.Separator />
    </Steps.Item>
  </Steps.List>
</Steps.Root>;
```

**Alternatives Considered**:

1. Custom CSS media queries - Rejected: More verbose, doesn't leverage Chakra UI components
2. Show/hide different components - Rejected: Code duplication, violates DRY principle
3. CSS flexbox direction change - Rejected: Less semantic, accessibility concerns

---

### RQ-002: How to implement responsive date picker with horizontal scrolling?

**Decision**: Use horizontal scroll container with `overflow: auto` and `scrollSnapType` for smooth mobile experience

**Rationale**:

- Chakra UI supports `overflow`, `overflowX` props on Box component
- `scrollSnapType` enables smooth snap scrolling on touch devices
- Native touch scrolling behavior avoids custom gesture handlers (per spec Out of Scope)

**Implementation**:

```tsx
// Mobile: 3-4 days visible with horizontal scroll
// Desktop: 7 days in single row (no scroll needed)
<Box
  overflowX={{ base: 'auto', md: 'visible' }}
  scrollSnapType={{ base: 'x mandatory', md: 'none' }}
  css={{
    WebkitOverflowScrolling: 'touch', // iOS smooth scrolling
    scrollbarWidth: 'none', // Firefox
    '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
  }}
>
  <HStack gap={2} minW={{ base: '200%', md: 'auto' }}>
    {weekDays.map((day) => (
      <Box
        flexShrink={0}
        w={{ base: 'calc(100% / 3)', sm: 'calc(100% / 4)', md: 'auto' }}
        scrollSnapAlign="start"
      >
        {/* Day content */}
      </Box>
    ))}
  </HStack>
</Box>
```

**Alternatives Considered**:

1. External carousel library (Swiper, Embla) - Rejected: Adds dependency, overkill for simple week view
2. Custom swipe gestures - Rejected: Explicitly out of scope per spec
3. Paginated week view (arrows only) - Rejected: Less intuitive on mobile

---

### RQ-003: How to handle responsive SimpleGrid columns for time slots?

**Decision**: Use Chakra UI SimpleGrid responsive column syntax

**Rationale**:

- SimpleGrid already used in SlotPicker with `columns={{ base: 3, md: 4, lg: 6 }}`
- Need to adjust for mobile: 2-3 columns with larger touch targets

**Implementation**:

```tsx
<SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} gap={2}>
  {slots.map((slot) => (
    <Button
      minH="44px" // WCAG touch target requirement
      minW="44px"
      size={{ base: 'md', md: 'sm' }}
    >
      {slot.time}
    </Button>
  ))}
</SimpleGrid>
```

**Alternatives Considered**:

1. Fixed 3 columns always - Rejected: Doesn't adapt to different mobile screen sizes
2. Grid with auto-fill/auto-fit - Rejected: Less predictable column count

---

### RQ-004: What are the Chakra UI v3 default breakpoints?

**Decision**: Use default Chakra UI breakpoints, aligned with spec requirements

**Findings**:

```javascript
const breakpoints = {
  base: '0rem', // 0px - Mobile first (< 480px)
  sm: '30rem', // 480px - Large mobile
  md: '48rem', // 768px - Tablet/Desktop (spec threshold)
  lg: '62rem', // 992px - Desktop
  xl: '80rem', // 1280px - Large desktop
  '2xl': '96rem', // 1536px - Extra large
};
```

**Spec Alignment**:

- FR-006: Screen < 400px → Use `base` breakpoint (3 days)
- FR-007: Screen 400px-767px → Use `sm` breakpoint (4 days)
- FR-008: Screen ≥ 768px → Use `md` breakpoint (7 days)
- Custom breakpoint for 400px may be needed via theme extension

**Custom Breakpoint Solution**:

```tsx
// If needed, add custom breakpoint in theme
const breakpoints = {
  base: '0em',
  xs: '25em', // 400px - for FR-006/FR-007 boundary
  sm: '30em', // 480px
  md: '48em', // 768px
  lg: '62em', // 992px
  xl: '80em', // 1280px
  '2xl': '96em', // 1536px
};
```

---

### RQ-005: How to ensure minimum 44px touch targets?

**Decision**: Use Chakra UI sizing props with responsive adjustments

**Rationale**:

- WCAG 2.1 AAA recommends 44×44px minimum touch targets
- Chakra UI Button default sizes may be smaller on mobile
- Use `minH` and `minW` props for explicit sizing

**Implementation**:

```tsx
// Step indicator circles
<Box
  w={{ base: 10, md: 8 }}  // 40px/32px
  h={{ base: 10, md: 8 }}
  minW="44px"
  minH="44px"
  {...}
/>

// Time slot buttons
<Button
  minH="44px"
  size={{ base: "md", md: "sm" }}
  {...}
/>

// Navigation buttons
<Button
  size={{ base: "lg", md: "sm" }}
  minH="44px"
  minW="44px"
  {...}
/>
```

---

### RQ-006: Form input mobile optimization for iOS

**Decision**: Use 16px minimum font size to prevent iOS auto-zoom

**Rationale**:

- iOS Safari auto-zooms when focusing inputs with font-size < 16px
- This disrupts user experience and layout

**Implementation**:

```tsx
<Input
  fontSize={{ base: "16px", md: "14px" }}
  h={{ base: "48px", md: "40px" }}
  {...}
/>
```

---

## Technical Stack Confirmation

| Component  | Current Version | Compatible                                        |
| ---------- | --------------- | ------------------------------------------------- |
| Next.js    | 15.5.4          | ✓                                                 |
| React      | 19.1.0          | ✓                                                 |
| Chakra UI  | 3.27.1          | ✓ Has useBreakpointValue, Steps, responsive props |
| TypeScript | 5.x             | ✓                                                 |

## Files to Modify

1. **BookingWidget.tsx** - Replace custom step indicator with Chakra Steps + responsive orientation
2. **SlotPicker.tsx** - Add horizontal scroll container for date picker, adjust SimpleGrid columns

## Dependencies

No new dependencies required. All features achievable with existing Chakra UI v3 components.

## Risks and Mitigations

| Risk                                               | Mitigation                                        |
| -------------------------------------------------- | ------------------------------------------------- |
| Steps component may have different API             | Verify v3 API before implementation               |
| Horizontal scroll may not be smooth on all devices | Use CSS scroll-snap and webkit-overflow-scrolling |
| Theme color contrast issues in dark mode           | Test all color combinations, use semantic tokens  |

## Context7 Verification (2025-06-26)

All key assumptions have been verified against official Chakra UI documentation via Context7 MCP:

### ✅ Verified Assumptions

| Assumption                                     | Status      | Context7 Documentation                                                                                                |
| ---------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------- |
| Steps component exists in v3                   | ✅ VERIFIED | Steps.Root, Steps.List, Steps.Item, Steps.Trigger, Steps.Indicator, Steps.Title, Steps.Separator components available |
| Steps supports `orientation` prop              | ✅ VERIFIED | Accepts 'horizontal' \| 'vertical' values                                                                             |
| Steps supports `colorPalette` prop             | ✅ VERIFIED | Theme color integration confirmed                                                                                     |
| Steps supports controlled `step` prop          | ✅ VERIFIED | Number index for current step                                                                                         |
| Steps supports `onStepChange` callback         | ✅ VERIFIED | For handling navigation                                                                                               |
| Steps.Trigger supports `onClick`               | ✅ VERIFIED | Individual step click handlers supported                                                                              |
| Steps has `linear` prop for enforcement        | ✅ VERIFIED | Can enforce sequential completion                                                                                     |
| useBreakpointValue hook exists                 | ✅ VERIFIED | Returns dynamic values based on current breakpoint                                                                    |
| useBreakpointValue accepts object syntax       | ✅ VERIFIED | `{ base: 'vertical', md: 'horizontal' }` pattern confirmed                                                            |
| Box supports `overflowX` responsive prop       | ✅ VERIFIED | Accepts responsive object syntax                                                                                      |
| Box supports `scrollSnapType` prop             | ✅ VERIFIED | Native CSS scroll-snap support                                                                                        |
| Box `css` prop supports webkit prefixes        | ✅ VERIFIED | WebkitOverflowScrolling, ::-webkit-scrollbar confirmed                                                                |
| SimpleGrid `columns` accepts responsive object | ✅ VERIFIED | `{ base: 2, sm: 3, md: 4, lg: 6 }` pattern documented                                                                 |
| Default breakpoints: base(0), sm(480), md(768) | ✅ VERIFIED | Matches Chakra UI v3 defaults                                                                                         |

### 📋 Implementation Confidence

- **Steps Component**: HIGH - All required features verified in official docs
- **Responsive Utilities**: HIGH - Object syntax for breakpoints confirmed
- **Horizontal Scrolling**: HIGH - CSS properties supported via Box component
- **Touch Targets**: HIGH - minH/minW props work with responsive sizing

### ⚠️ Known Limitations

1. **Steps Navigation**: Steps.Trigger requires manual logic to prevent forward navigation (use onClick with conditional logic)
2. **Custom Breakpoint**: May need to extend theme if exact 400px boundary is critical (current sm=480px may be acceptable)

## Conclusion

All research questions resolved and **verified with Context7**. Implementation can proceed using Chakra UI v3 native components and responsive utilities without additional dependencies. Zero assumptions remain unverified.
