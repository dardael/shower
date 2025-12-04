# Feature Specification: Inline Text Color in Rich Text Editor

**Feature Branch**: `018-theme-color-text`  
**Created**: 2025-12-04  
**Status**: Draft  
**Input**: User description: "as an administrator, i want to can choose the color of the text in the page content. and i want to see this color in the public side."

## Clarifications

### Session 2025-12-04

- Q: Should text color be a global setting or inline formatting in the editor? → A: Inline formatting within the rich text editor for specific text selections.
- Q: How should the administrator select a color in the editor? → A: Both preset color palette and custom color picker for flexibility.
- Q: Should tests be included? → A: Yes, tests for adding color, removing color, and displaying color on public side.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Apply Text Color to Selected Text in Editor (Priority: P1)

As an administrator editing page content, I want to select specific text and apply a color to it so that I can highlight or style particular words, phrases, or paragraphs differently.

**Why this priority**: This is the core functionality - without the ability to select text and apply a color in the editor, the feature has no value.

**Independent Test**: Can be fully tested by opening the page editor, selecting text, choosing a color, and verifying the selected text displays in that color within the editor.

**Acceptance Scenarios**:

1. **Given** I am editing page content in the rich text editor, **When** I select a portion of text, **Then** I see a text color option available in the editor toolbar or menu.
2. **Given** I have selected text, **When** I choose a color from the color picker, **Then** the selected text immediately displays in the chosen color within the editor.
3. **Given** I have applied a color to text, **When** I save the page content, **Then** the color styling is persisted with the content.

---

### User Story 2 - Display Colored Text on Public Pages (Priority: P1)

As a public visitor, I want to see text displayed with the colors applied by the administrator so that I experience the intended visual emphasis and design.

**Why this priority**: This is equally critical - the applied colors must be visible to end users for the feature to deliver value.

**Independent Test**: Can be tested by applying a text color in the editor, saving the content, then viewing the public page and verifying the colored text appears correctly.

**Acceptance Scenarios**:

1. **Given** the administrator has applied a color to specific text, **When** a visitor views the page, **Then** that text is displayed in the applied color.
2. **Given** text has no color applied, **When** a visitor views the page, **Then** the text displays in the default content color.

---

### User Story 3 - Remove or Change Text Color (Priority: P2)

As an administrator, I want to remove or change the color of previously colored text so that I can update the styling as needed.

**Why this priority**: Extends the core functionality to allow editing and removing color formatting.

**Independent Test**: Can be tested by selecting colored text, changing or removing the color, and verifying the change persists.

**Acceptance Scenarios**:

1. **Given** I have previously colored text, **When** I select it and choose a different color, **Then** the text updates to the new color.
2. **Given** I have previously colored text, **When** I select it and remove the color formatting, **Then** the text reverts to the default color.

---

### Edge Cases

- What happens when the administrator selects a color with poor contrast against the background?
  - The system allows any color selection (administrator responsibility for accessibility).
- What happens when colored text is copied and pasted within the editor?
  - The color formatting is preserved with the pasted text.
- What happens when the administrator applies color to text that already has other formatting (bold, italic)?
  - The color is applied in addition to existing formatting; all styles are preserved.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a text color option in the rich text editor toolbar or menu.
- **FR-002**: System MUST provide a preset color palette with commonly used colors for quick selection.
- **FR-003**: System MUST provide a custom color picker option for selecting any color.
- **FR-004**: System MUST display the color change immediately in the editor (live preview).
- **FR-005**: System MUST persist the text color as part of the page content data.
- **FR-006**: System MUST render colored text correctly on public-facing pages.
- **FR-007**: System MUST allow removing color formatting from previously colored text.
- **FR-008**: System MUST preserve color formatting when combined with other text styles (bold, italic, links).
- **FR-009**: Code MUST implement only strict minimum required for current feature (YAGNI principle).
- **FR-010**: Code MUST avoid duplication through reusable functions and components (DRY principle).
- **FR-011**: Code MUST be simple, readable, and clear with straightforward implementations (KISS principle).

### Testing Requirements

- **TR-001**: Unit tests MUST verify that applying a color to selected text produces correct HTML output with inline style.
- **TR-002**: Unit tests MUST verify that removing color from text removes the color styling from HTML output.
- **TR-003**: Unit tests MUST verify that the PublicPageContent component renders colored text with the correct color style.

### Key Entities

- **PageContent**: Contains rich text content including inline color formatting. Color is stored as part of the content markup.
- **TextColorMark**: An inline formatting mark applied to text spans, storing the color value (hex format).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can apply a text color in under 5 seconds (select text, pick color).
- **SC-002**: Colored text is visible on public pages immediately after page load.
- **SC-003**: 100% of colored text displays correctly on public pages matching the editor preview.
- **SC-004**: Color formatting persists correctly across save/reload cycles.

## Assumptions

- The color picker will accept standard hex color format (#RRGGBB).
- Color is applied at the inline/span level, not at the block level.
- The existing rich text editor (Tiptap) can be extended to support text color marks.
- Administrators are responsible for choosing accessible color combinations.
- The default text color is inherited from the page/theme styling when no explicit color is applied.
