# Implementation Plan: Mobile Appointment Booking UX Improvements

**Feature**: 053-mobile-appointment-ux  
**Branch**: `053-mobile-appointment-ux`  
**Date**: 2025-06-26  
**Status**: Ready for Implementation

## Technical Context

### Tech Stack

| Layer      | Technology  | Version | Notes                                 |
| ---------- | ----------- | ------- | ------------------------------------- |
| Framework  | Next.js     | 15.5.4  | App Router                            |
| UI Library | Chakra UI   | 3.27.1  | Responsive utilities, Steps component |
| React      | React       | 19.1.0  |                                       |
| Language   | TypeScript  | 5.x     | Strict mode                           |
| Icons      | react-icons | 5.5.0   | FiCheck, FiArrowRight, etc.           |

### Key Dependencies

- `@chakra-ui/react` - Responsive utilities, Steps component, SimpleGrid
- `useBreakpointValue` hook - Dynamic responsive values
- `useThemeColorContext` - Custom theme color provider

### Breakpoints

| Breakpoint | Width | Use Case                 |
| ---------- | ----- | ------------------------ |
| base       | 0px   | Mobile first (< 480px)   |
| sm         | 480px | Large mobile             |
| md         | 768px | Tablet/Desktop threshold |
| lg         | 992px | Desktop                  |

## Constitution Check

| Principle               | Status | Justification                                              |
| ----------------------- | ------ | ---------------------------------------------------------- |
| I. Architecture-First   | ✓ PASS | Presentation layer changes only, follows existing patterns |
| II. Focused Testing     | ✓ PASS | Visual/E2E testing appropriate for responsive changes      |
| III. Simplicity-First   | ✓ PASS | No new monitoring, uses existing Chakra utilities          |
| IV. Security by Default | ✓ N/A  | No security implications                                   |
| V. Clean Architecture   | ✓ PASS | No domain/infrastructure changes                           |
| VI. Accessibility-First | ✓ PASS | 44px touch targets, color contrast maintained              |
| VII. YAGNI              | ✓ PASS | Only implementing required responsive features             |
| VIII. DRY               | ✓ PASS | Reusing Chakra responsive utilities                        |
| IX. KISS                | ✓ PASS | Native Chakra components, no custom frameworks             |
| X. Config Portability   | ✓ N/A  | No configuration changes                                   |
| XI. French Localization | ✓ PASS | All labels already in French, no changes                   |

**Gate Status**: ✅ ALL GATES PASS

## File Structure

### Files to Modify

```
src/presentation/public/components/appointment/
├── BookingWidget.tsx       # Step indicator responsive layout
└── SlotPicker.tsx          # Date picker responsive layout, time slot grid
```

### No New Files Required

This feature modifies existing components only.

## Implementation Phases

### Phase 1: Setup (Estimated: 15 min)

- [ ] Verify Chakra UI v3 Steps component availability
- [ ] Review existing BookingWidget and SlotPicker implementations
- [ ] Test current responsive behavior baseline

### Phase 2: Step Indicator Refactor (Estimated: 1 hour)

**BookingWidget.tsx Changes:**

1. Import `useBreakpointValue` from Chakra UI
2. Replace custom HStack step indicator with Chakra `Steps` component
3. Add responsive orientation: vertical (mobile) / horizontal (desktop)
4. Maintain step click navigation for previous steps
5. Preserve theme color integration

```tsx
// Key implementation
const orientation = useBreakpointValue({
  base: 'vertical',
  md: 'horizontal',
});

<Steps.Root
  orientation={orientation}
  step={currentStepIndex}
  colorPalette={themeColor}
>
  <Steps.List>
    {steps.map((s, index) => (
      <Steps.Item key={s.id} index={index}>
        <Steps.Trigger
          onClick={() => handleStepClick(s.id as BookingStep)}
          cursor={index < currentStepIndex ? 'pointer' : 'default'}
        >
          <Steps.Indicator />
          <Steps.Title>{s.label}</Steps.Title>
        </Steps.Trigger>
        <Steps.Separator />
      </Steps.Item>
    ))}
  </Steps.List>
</Steps.Root>;
```

### Phase 3: Date Picker Responsive (Estimated: 1.5 hours)

**SlotPicker.tsx Changes:**

1. Replace `SimpleGrid columns={7}` with responsive scroll container
2. Add horizontal scroll with snap behavior on mobile
3. Adjust day box sizing for 3/4/7 columns based on breakpoint
4. Ensure minimum 44px touch targets

```tsx
// Mobile: horizontal scroll with 3-4 visible days
// Desktop: 7 days in row, no scroll
<Box
  overflowX={{ base: 'auto', md: 'visible' }}
  css={{
    scrollSnapType: { base: 'x mandatory', md: 'none' },
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  }}
>
  <HStack
    gap={2}
    minW={{ base: 'calc(100% * 7 / 3)', sm: 'calc(100% * 7 / 4)', md: 'auto' }}
    flexWrap={{ md: 'nowrap' }}
  >
    {weekDays.map((day) => (
      <Box
        flexShrink={0}
        w={{ base: 'calc(100% / 3)', sm: 'calc(100% / 4)', md: 'auto' }}
        flex={{ md: 1 }}
        minH="44px"
        scrollSnapAlign="start"
        {...dayProps}
      />
    ))}
  </HStack>
</Box>
```

### Phase 4: Time Slot Grid (Estimated: 30 min)

**SlotPicker.tsx Changes:**

1. Adjust SimpleGrid columns for mobile
2. Ensure 44px minimum touch targets on buttons

```tsx
<SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} gap={2}>
  {slots.map((slot) => (
    <Button minH="44px" size={{ base: 'md', md: 'sm' }} {...slotProps}>
      {slot.time}
    </Button>
  ))}
</SimpleGrid>
```

### Phase 5: Form and Confirmation Responsive (Estimated: 30 min)

**BookingWidget.tsx Changes:**

1. Ensure form inputs have 16px font size on mobile
2. Add responsive padding and spacing
3. Verify confirmation summary is single-column on mobile
4. Center success screen elements

### Phase 6: Testing and Polish (Estimated: 1 hour)

- [ ] Test at 320px, 375px, 414px, 768px, 1024px widths
- [ ] Test device rotation handling
- [ ] Verify theme color integration
- [ ] Check dark mode compatibility
- [ ] Validate WCAG touch target requirements

## Dependencies Graph

```
[Phase 1: Setup]
       ↓
[Phase 2: Step Indicator] ──────┐
       ↓                        │
[Phase 3: Date Picker] ─────────┼──→ [Phase 6: Testing]
       ↓                        │
[Phase 4: Time Slots] ──────────┤
       ↓                        │
[Phase 5: Form/Confirm] ────────┘
```

Phases 2-5 can be partially parallelized but should be tested together.

## Risks and Mitigations

| Risk                                   | Probability | Impact | Mitigation                              |
| -------------------------------------- | ----------- | ------ | --------------------------------------- |
| Chakra Steps API differs from research | Low         | Medium | Fallback to custom vertical layout      |
| Horizontal scroll not smooth on iOS    | Medium      | Medium | Add webkit-overflow-scrolling touch     |
| Theme color tokens differ in v3        | Low         | Low    | Test and adjust token names             |
| Edge cases at breakpoint boundaries    | Medium      | Low    | Test extensively at 400px, 480px, 768px |

## Success Criteria Mapping

| Requirement                     | Implementation                 | Verification        |
| ------------------------------- | ------------------------------ | ------------------- |
| FR-001 Vertical steps mobile    | useBreakpointValue orientation | Visual test 375px   |
| FR-002 Horizontal steps desktop | useBreakpointValue orientation | Visual test 768px+  |
| FR-006 3 days < 400px           | Responsive scroll container    | Visual test 375px   |
| FR-007 4 days 400-767px         | Responsive scroll container    | Visual test 414px   |
| FR-011 2-3 slot columns mobile  | SimpleGrid responsive          | Visual test 375px   |
| FR-013 44px touch targets       | minH/minW props                | Measure in DevTools |

## Artifacts

| Artifact      | Path                                          | Status                      |
| ------------- | --------------------------------------------- | --------------------------- |
| research.md   | specs/053-mobile-appointment-ux/research.md   | ✓ Complete                  |
| data-model.md | specs/053-mobile-appointment-ux/data-model.md | ✓ Complete                  |
| contracts/    | specs/053-mobile-appointment-ux/contracts/    | ✓ Complete (no API changes) |
| quickstart.md | specs/053-mobile-appointment-ux/quickstart.md | ✓ Complete                  |
| plan.md       | specs/053-mobile-appointment-ux/plan.md       | ✓ Complete                  |
