# Quickstart: Testing Mobile Appointment Booking UX

**Feature**: 053-mobile-appointment-ux  
**Date**: 2025-06-26

## Prerequisites

1. Development server running: `npm run dev`
2. Browser with DevTools for responsive testing
3. (Optional) Physical mobile device or mobile emulator

## Testing URLs

| Page                  | URL            | Purpose                |
| --------------------- | -------------- | ---------------------- |
| Public booking widget | `/appointment` | Main booking interface |

## Testing Scenarios

### Scenario 1: Mobile Step Indicator (375px width)

1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Set viewport to 375×667 (iPhone SE)
4. Navigate to `/appointment`
5. Verify:
   - [ ] Step indicator displays **vertically**
   - [ ] All 4 step labels visible without horizontal scrolling
   - [ ] Step numbers are clearly visible
   - [ ] Current step is highlighted with theme color

6. Complete step 1 (select an activity)
7. Verify:
   - [ ] Can tap on step 1 to go back
   - [ ] Cannot tap on step 3 or 4 (not yet accessible)

### Scenario 2: Mobile Date Picker (375px width)

1. Continue from Scenario 1 or navigate to slot selection step
2. Verify:
   - [ ] Date picker shows **3 days per row**
   - [ ] Can swipe/scroll horizontally to see remaining days
   - [ ] Scroll is smooth with snap behavior
   - [ ] Selected date highlighted with theme color

3. Select a date with available slots
4. Verify:
   - [ ] Time slots appear in **2-3 columns**
   - [ ] Each slot button is at least 44×44px
   - [ ] Easy to tap without mis-taps

### Scenario 3: Larger Mobile (414px width)

1. Set viewport to 414×896 (iPhone 11/12/13)
2. Navigate to `/appointment`
3. Verify:
   - [ ] Step indicator still **vertical**
   - [ ] Date picker shows **4 days per row**
   - [ ] Time slots in **2-3 columns**

### Scenario 4: Desktop (768px+ width)

1. Set viewport to 1024×768
2. Navigate to `/appointment`
3. Verify:
   - [ ] Step indicator displays **horizontally**
   - [ ] All 4 steps in single row with arrows between
   - [ ] Date picker shows **7 days in single row**
   - [ ] No horizontal scroll needed
   - [ ] Time slots in **4-6 columns**

### Scenario 5: Form Input Testing (Mobile)

1. Set viewport to 375×667
2. Navigate to booking form step (step 3)
3. Verify:
   - [ ] All form inputs are full-width
   - [ ] Input font size is at least 16px
   - [ ] Tapping input does NOT trigger iOS auto-zoom
   - [ ] Form is readable without horizontal scrolling

### Scenario 6: Confirmation Screen (Mobile)

1. Complete form and proceed to confirmation
2. Verify:
   - [ ] Booking summary displays in single column
   - [ ] Activity name, date, time all readable
   - [ ] Confirm button is full-width with adequate padding

### Scenario 7: Success Screen (Mobile)

1. Confirm the booking
2. Verify:
   - [ ] Success icon is centered
   - [ ] Confirmation text is readable
   - [ ] "Book another" button is centered and tappable

### Scenario 8: Device Rotation

1. On mobile device or emulator
2. Start booking in portrait orientation
3. Rotate to landscape mid-booking
4. Verify:
   - [ ] Layout adapts appropriately
   - [ ] No content lost or broken
   - [ ] Can continue booking process

### Scenario 9: Edge Case - Very Small Screen (320px)

1. Set viewport to 320×568 (iPhone 5/SE)
2. Navigate through entire booking flow
3. Verify:
   - [ ] All content fits without horizontal scrolling
   - [ ] Text wraps appropriately
   - [ ] Buttons remain tappable

## Common Issues to Watch For

| Issue                        | What to Check                                             |
| ---------------------------- | --------------------------------------------------------- |
| Horizontal scrollbar appears | Container has `overflow: hidden` or content fits viewport |
| Dates too small to tap       | Minimum 44×44px touch target                              |
| iOS auto-zoom on input focus | Font size ≥ 16px on inputs                                |
| Step indicator overflows     | Vertical orientation on mobile                            |
| Theme color not applied      | Using `themeColor` from context                           |

## Browser Testing Matrix

| Browser | Test On          |
| ------- | ---------------- |
| Chrome  | Desktop, Android |
| Safari  | macOS, iOS       |
| Firefox | Desktop, Android |
| Edge    | Desktop          |

## Reporting Issues

For each issue found, note:

1. Device/viewport size
2. Browser and version
3. Step in booking flow
4. Screenshot if applicable
5. Expected vs actual behavior
