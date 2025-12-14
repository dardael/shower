# Feature Specification: Custom Color Palette

**Feature Branch**: `030-custom-color-palette`  
**Created**: 2025-12-14  
**Status**: Draft  
**Input**: User description: "As an administrator, I want to add new colors to configure my website. I will give you the color I want in light mode in the public side where they will be used. At you to compute the colors to add in the existing inputs to select colors. I want to add this color as the theme color: #cdb99d. This color as background color: #ede6dd. This color for font color in public page content: #642e2a. Add a square to select the colors in the existing inputs (theme colors, background colors and color picker in the rich text editor to configure page content)"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Add New Theme Color Option (Priority: P1)

As an administrator, I want to select a new warm beige theme color (#cdb99d in light mode) from the theme color selector so that my website has a distinctive brand identity that matches my business aesthetic.

**Why this priority**: The theme color is the primary branding element that affects the overall look and feel of the website. Adding this option enables the administrator to achieve their desired brand identity.

**Independent Test**: Can be fully tested by navigating to admin settings, selecting the new beige theme color, and verifying it applies correctly to the public website header, buttons, and accent elements in both light and dark modes.

**Acceptance Scenarios**:

1. **Given** I am logged in as an administrator on the settings page, **When** I view the theme color selector, **Then** I see a new clickable color square displaying the beige color (#cdb99d) alongside existing color options
2. **Given** I am on the theme color selector, **When** I click the beige color square, **Then** the color is selected and visually highlighted as the active choice
3. **Given** I have selected the beige theme color and saved settings, **When** I view the public website in light mode, **Then** accent elements display using #cdb99d
4. **Given** I have selected the beige theme color and saved settings, **When** I view the public website in dark mode, **Then** accent elements display using an appropriately computed dark mode variant

---

### User Story 2 - Add New Background Color Option (Priority: P1)

As an administrator, I want to select a new warm cream background color (#ede6dd in light mode) from the background color selector so that my website pages have a warm, inviting appearance.

**Why this priority**: Background color significantly impacts the overall visual experience and readability of the website. This is equally important as theme color for achieving the desired aesthetic.

**Independent Test**: Can be fully tested by navigating to admin settings, selecting the new cream background color, and verifying the public website displays with the cream background in light mode and an appropriate dark variant in dark mode.

**Acceptance Scenarios**:

1. **Given** I am logged in as an administrator on the settings page, **When** I view the background color selector, **Then** I see a new clickable color square displaying the cream color alongside existing color options
2. **Given** I am on the background color selector, **When** I click the cream color square, **Then** the color is selected and the preview updates to show the cream background
3. **Given** I have selected the cream background color and saved settings, **When** I view the public website in light mode, **Then** the page background displays as #ede6dd
4. **Given** I have selected the cream background color and saved settings, **When** I view the public website in dark mode, **Then** the page background displays using an appropriately computed dark mode variant

---

### User Story 3 - Add New Font Color in Rich Text Editor (Priority: P2)

As an administrator editing page content, I want to select a new burgundy font color (#642e2a) from the text color picker so that I can use this color for text in my page content to match my brand palette.

**Why this priority**: While important for brand consistency in content, font color in the editor is used on a per-content basis rather than site-wide, making it slightly lower priority than theme and background colors.

**Independent Test**: Can be fully tested by opening the page content editor, accessing the text color picker, selecting the burgundy color swatch, and verifying the selected text changes to #642e2a.

**Acceptance Scenarios**:

1. **Given** I am editing page content in the rich text editor, **When** I open the text color picker, **Then** I see a new clickable color square displaying the burgundy color (#642e2a) in the color swatch grid
2. **Given** I have selected some text in the editor, **When** I click the burgundy color square, **Then** the selected text changes to #642e2a and the color picker closes
3. **Given** I have applied the burgundy color to text and saved the page, **When** I view the page on the public website, **Then** the text displays in burgundy (#642e2a)

---

### Edge Cases

- What happens when the administrator switches between light and dark mode preview while the new colors are selected? The preview should correctly show the mode-appropriate color variant.
- How does the system handle the new colors if browser does not support the specific hex values? Standard CSS fallback behavior applies; all major browsers support hex colors.
- What happens if the color squares overflow the available horizontal space on smaller screens? The selector should wrap or remain scrollable to accommodate all color options.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST add a new color token "beige" to the theme color palette with light mode value #cdb99d and a computed dark mode variant
- **FR-002**: System MUST add a new color token "cream" to the background color palette with light mode value #ede6dd and a computed dark mode variant
- **FR-003**: System MUST add burgundy (#642e2a) to the preset colors in the rich text editor color picker
- **FR-004**: Theme color selector MUST display clickable color squares for all available colors including the new beige option
- **FR-005**: Background color selector MUST display clickable color squares for all available colors including the new cream option
- **FR-006**: Rich text editor color picker MUST display clickable color squares for all preset colors including the new burgundy option
- **FR-007**: All color squares MUST be visually consistent in size and styling across theme, background, and editor color selectors
- **FR-008**: System MUST ensure proper contrast ratios for text and UI elements when new colors are applied in both light and dark modes
- **FR-009**: Code MUST implement only strict minimum required for current feature (YAGNI principle)
- **FR-010**: Code MUST avoid duplication through reusable functions and components (DRY principle)
- **FR-011**: Code MUST be simple, readable, and clear with straightforward implementations (KISS principle)

### Color Value Specifications

**New Theme Color - Beige**:

- Token name: `beige`
- Light mode accent: #cdb99d
- Dark mode accent: #a89070 (computed darker variant for dark backgrounds)

**New Background Color - Cream**:

- Token name: `cream`
- Light mode background: #ede6dd
- Dark mode background: #3d3830 (computed dark variant maintaining warmth)

**New Editor Font Color - Burgundy**:

- Hex value: #642e2a
- Added to preset color array in ColorPicker component

### Key Entities

- **ThemeColorPalette**: Extended to include "beige" token with light/dark mode hex values
- **BackgroundColorMap**: Extended to include "cream" token with light/dark mode hex mappings
- **ColorPickerPresets**: Extended array to include burgundy (#642e2a) in the preset color grid

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrator can select and apply the new beige theme color in under 10 seconds from the settings page
- **SC-002**: Administrator can select and apply the new cream background color in under 10 seconds from the settings page
- **SC-003**: Administrator can apply the new burgundy font color to selected text in under 5 seconds from the editor toolbar
- **SC-004**: All three new colors are visually distinguishable as clickable squares in their respective selectors
- **SC-005**: New colors render correctly on the public website in both light and dark modes
- **SC-006**: Color selection UI maintains visual consistency with existing color squares (same size, spacing, interaction states)

## Assumptions

- The computed dark mode variants for beige (#a89070) and cream (#3d3830) provide acceptable contrast and aesthetics; these values can be adjusted during implementation if visual testing reveals issues
- The existing color selector UI patterns (horizontal button row for theme/background, grid for editor) are retained; no layout redesign is required
- The rich text editor color picker grid can accommodate one additional color without layout changes (current 12 colors in 4x3 grid becomes 13 colors)
- All existing color validation logic will be extended to recognize new color tokens
