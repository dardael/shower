# Implementation Tasks: Mobile Appointment Booking UX Improvements

**Feature**: 053-mobile-appointment-ux  
**Branch**: `053-mobile-appointment-ux`  
**Status**: Ready for Implementation

## Task Overview

| Phase                                          | User Story         | Task Count   | Estimated Time     |
| ---------------------------------------------- | ------------------ | ------------ | ------------------ |
| Phase 1: Setup                                 | N/A                | 3            | 15 min             |
| Phase 2: US1 - Mobile-Friendly Step Navigation | P1                 | 6            | 1 hour             |
| Phase 3: US2 - Mobile-Optimized Date Selection | P1                 | 7            | 1.5 hours          |
| Phase 4: US3 - Responsive Layout Adaptation    | P2                 | 4            | 30 min             |
| Phase 5: Testing & Polish                      | N/A                | 5            | 1 hour             |
| **TOTAL**                                      | **3 User Stories** | **25 Tasks** | **4 hours 15 min** |

## Implementation Strategy

This feature follows an **incremental delivery approach**:

1. **MVP**: User Story 1 (Mobile-Friendly Step Navigation) - Delivers immediate value by fixing the critical step indicator overflow on mobile
2. **Phase 2**: User Story 2 (Mobile-Optimized Date Selection) - Completes the core mobile booking experience
3. **Phase 3**: User Story 3 (Responsive Layout Adaptation) - Polishes remaining UI elements for complete responsive experience

Each user story is **independently testable** and delivers value on its own. Stories can be deployed incrementally if needed.

---

## Phase 1: Setup (No User Story)

**Goal**: Prepare development environment and verify dependencies

**Tasks**:

- [x] T001 Verify Chakra UI v3 Steps component is available in node_modules/@chakra-ui/react
- [x] T002 Read existing BookingWidget.tsx to understand current implementation in src/presentation/public/components/appointment/BookingWidget.tsx
- [x] T003 Read existing SlotPicker.tsx to understand current implementation in src/presentation/public/components/appointment/SlotPicker.tsx

---

## Phase 2: User Story 1 - Mobile-Friendly Step Navigation (P1)

**User Story**: Mobile users need to easily navigate through the appointment booking process without content overflowing their screen or requiring horizontal scrolling.

**Independent Test**: Access booking widget on 375px-428px mobile device and verify all step indicators are visible without horizontal scrolling, and navigation to previous steps works.

**Acceptance Criteria**:

- Step indicator displays vertically on mobile (< 768px)
- Step indicator displays horizontally on desktop (≥ 768px)
- Users can tap previous steps to navigate back
- Future steps are not clickable

**Tasks**:

- [x] T004 [P] [US1] Import useBreakpointValue hook from @chakra-ui/react in src/presentation/public/components/appointment/BookingWidget.tsx
- [x] T005 [US1] Add orientation state using useBreakpointValue with base:'vertical', md:'horizontal' in src/presentation/public/components/appointment/BookingWidget.tsx
- [x] T006 [US1] Replace custom HStack step indicator with Chakra Steps.Root component in src/presentation/public/components/appointment/BookingWidget.tsx
- [x] T007 [US1] Implement Steps.List with Steps.Item for each step (activity, slot, form, confirm) in src/presentation/public/components/appointment/BookingWidget.tsx
- [x] T008 [US1] Add Steps.Trigger with onClick handler calling handleStepClick for navigation in src/presentation/public/components/appointment/BookingWidget.tsx
- [x] T009 [US1] Configure Steps.Root with orientation prop, step prop (currentStepIndex), and colorPalette prop (themeColor) in src/presentation/public/components/appointment/BookingWidget.tsx

**Verification**:

- Run dev server and test at 375px, 414px, 768px, 1024px widths
- Verify step indicator orientation changes at 768px breakpoint
- Test step navigation (can go back, cannot go forward)
- Verify theme color is applied to active/completed steps

---

## Phase 3: User Story 2 - Mobile-Optimized Date Selection (P1)

**User Story**: Mobile users need to select appointment dates from a calendar that displays comfortably on their screen without cramming 7 days into a single row.

**Independent Test**: Access booking widget on mobile device, navigate to date selection, verify 3-4 days displayed per row with clear spacing, and all days accessible through horizontal scrolling.

**Acceptance Criteria**:

- Date picker shows 3 days per row on < 400px screens
- Date picker shows 4 days per row on 400px-767px screens
- Date picker shows 7 days per row on ≥ 768px screens
- Horizontal scrolling works smoothly on mobile
- Time slots display in 2-3 columns on mobile (vs 6 on desktop)

**Tasks**:

- [x] T010 [P] [US2] Replace SimpleGrid date container with Box component supporting horizontal scroll in src/presentation/public/components/appointment/SlotPicker.tsx
- [x] T011 [US2] Add overflowX responsive prop with base:'auto', md:'visible' to scroll container in src/presentation/public/components/appointment/SlotPicker.tsx
- [x] T012 [US2] Add css prop with scrollSnapType:'x mandatory', WebkitOverflowScrolling:'touch', scrollbar hiding in src/presentation/public/components/appointment/SlotPicker.tsx
- [x] T013 [US2] Wrap weekDays in HStack with responsive minW for scroll width calculation in src/presentation/public/components/appointment/SlotPicker.tsx
- [x] T014 [US2] Update day Box components with responsive width: base:'calc(100%/3)', sm:'calc(100%/4)', md:'auto' in src/presentation/public/components/appointment/SlotPicker.tsx
- [x] T015 [US2] Add flexShrink={0} and scrollSnapAlign:'start' to day Box components in src/presentation/public/components/appointment/SlotPicker.tsx
- [x] T016 [US2] Update time slot SimpleGrid with responsive columns: base:2, sm:3, md:4, lg:6 in src/presentation/public/components/appointment/SlotPicker.tsx

**Verification**:

- Test date picker at 375px (3 days visible), 414px (4 days), 768px+ (7 days)
- Verify smooth horizontal scrolling on mobile with snap behavior
- Test time slot grid displays correct column count per breakpoint
- Verify all 7 days of week are accessible through scrolling

---

## Phase 4: User Story 3 - Responsive Layout Adaptation (P2)

**User Story**: Users need the entire booking widget to adapt seamlessly to different screen sizes, ensuring all form fields, buttons, and content remain accessible and readable.

**Independent Test**: Access booking widget on devices from 375px to 1920px width and verify all UI elements are properly sized and readable without horizontal scrolling.

**Acceptance Criteria**:

- All form inputs are full-width with minimum 16px font size on mobile
- All buttons have minimum 44px × 44px touch targets
- Confirmation summary displays in single column on mobile
- Success screen elements are centered on mobile
- No horizontal scrolling at container level

**Tasks**:

- [x] T017 [P] [US3] Add minH='44px' and size responsive props to all time slot Button components in src/presentation/public/components/appointment/SlotPicker.tsx
- [x] T018 [P] [US3] Add minH='44px' minW='44px' to navigation buttons (previous/next week) in src/presentation/public/components/appointment/SlotPicker.tsx
- [x] T019 [P] [US3] Add responsive fontSize base:'16px', md:'14px' to form Input components in src/presentation/public/components/appointment/BookingWidget.tsx (if form is rendered in BookingWidget or in separate BookingForm component)
- [x] T020 [US3] Verify confirmation summary uses single-column layout on mobile with proper spacing in src/presentation/public/components/appointment/BookingWidget.tsx

**Verification**:

- Test touch target sizes on mobile (measure in DevTools, minimum 44×44px)
- Test form inputs on iOS device to verify no auto-zoom occurs
- Verify confirmation and success screens at mobile widths
- Test rotation from portrait to landscape on mobile device

---

## Phase 5: Testing & Polish (No User Story)

**Goal**: Comprehensive testing across all breakpoints and edge cases, final polish

**Tasks**:

- [x] T021 [P] Test booking widget at 320px width (very small mobile) - verify all content fits without horizontal overflow
- [x] T022 [P] Test booking widget at 375px, 414px, 768px, 1024px, 1920px widths - verify responsive behavior at each breakpoint
- [x] T023 [P] Test device rotation from portrait to landscape - verify layout adapts correctly mid-booking
- [x] T024 [P] Test theme color integration in both light and dark modes - verify proper contrast ratios (FR-019)
- [x] T025 Verify all visible text is in French (FR-020) - check step labels, button text, error messages

**Final Verification Checklist**:

- [x] FR-001: Step indicator displays vertically on mobile (< 768px)
- [x] FR-002: Step indicator displays horizontally on desktop (≥ 768px)
- [x] FR-003: Step indicator allows navigation to previous steps
- [x] FR-004: Step indicator prevents navigation to future steps
- [x] FR-006: Date picker shows 3 days per row on < 400px screens
- [x] FR-007: Date picker shows 4 days per row on 400px-767px screens
- [x] FR-008: Date picker shows 7 days per row on ≥ 768px screens
- [x] FR-009: Date picker supports horizontal scrolling on mobile
- [x] FR-011: Time slots display in 2-3 columns on mobile
- [x] FR-012: Form inputs are full-width with 16px font size on mobile
- [x] FR-013: All buttons have 44px × 44px touch targets
- [x] FR-014: No horizontal scrolling at container level
- [x] FR-017: Theme color used for active/completed steps
- [x] FR-018: Theme color used for selected date
- [x] FR-019: Proper contrast ratios in light and dark modes
- [x] FR-020: All text in French

---

## Dependencies & Execution Order

### User Story Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (US1: Step Navigation) ──┐
    ↓                            │
Phase 3 (US2: Date Selection) ───┼──→ Phase 5 (Testing & Polish)
    ↓                            │
Phase 4 (US3: Layout Polish) ────┘
```

**Execution Notes**:

- Phase 1 must complete before any user story work
- User Stories 1, 2, 3 can be implemented sequentially or in parallel by different developers
- Each user story is independently testable before moving to the next
- Phase 5 should be executed after all user stories are complete

### Parallel Execution Opportunities

**Within Each Phase**:

- **Phase 2 (US1)**: Tasks T004 can be done in parallel with T003 completion, but T005-T009 must be sequential
- **Phase 3 (US2)**: Tasks T010-T016 modify the same file but different sections, recommend sequential execution
- **Phase 4 (US3)**: Tasks T017, T018, T019 can be done in parallel as they modify different components/sections
- **Phase 5**: Tasks T021-T024 are all parallel testing tasks

**Cross-Phase**:

- US1 (Phase 2) and US2 (Phase 3) modify different files - can be implemented in parallel if desired
- US3 (Phase 4) adds polish to both files - should wait for US1 and US2 to complete

---

## File Modification Summary

| File                                                               | Phases | Changes                                                                             |
| ------------------------------------------------------------------ | ------ | ----------------------------------------------------------------------------------- |
| `src/presentation/public/components/appointment/BookingWidget.tsx` | 2, 4   | Replace step indicator with Chakra Steps component, add responsive form styling     |
| `src/presentation/public/components/appointment/SlotPicker.tsx`    | 3, 4   | Add horizontal scroll container for dates, responsive time slot grid, touch targets |

---

## MVP Recommendation

**MVP Scope**: User Story 1 only (Phase 1 + Phase 2 + minimal Phase 5 testing)

**Rationale**:

- Fixes the most critical mobile UX issue (step indicator overflow)
- Can be deployed independently
- Provides immediate value to mobile users
- ~1 hour 15 min implementation time

**Full Feature**: All 3 user stories (recommended for complete mobile experience)

- Total implementation time: ~4 hours 15 min
- Delivers complete responsive mobile booking experience
