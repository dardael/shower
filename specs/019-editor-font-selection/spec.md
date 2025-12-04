# Feature Specification: Editor Font Selection

**Feature Branch**: `019-editor-font-selection`  
**Created**: 2025-12-04  
**Status**: Draft  
**Input**: User description: "As an administrator, in the rich text editor to configure the page content, I want to choose the font for a specific text. Use the same fonts proposed to configure the website font."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Apply Font to Selected Text (Priority: P1)

As an administrator, I want to select a portion of text in the rich text editor and apply a specific font to it so that I can create visual variety and emphasis within my page content.

**Why this priority**: This is the core functionality requested - the ability to apply different fonts to specific text selections. Without this, the feature has no value.

**Independent Test**: Can be fully tested by opening the page content editor, selecting some text, clicking the font selector, choosing a font, and verifying the selected text displays in that font.

**Acceptance Scenarios**:

1. **Given** I am editing page content in the rich text editor, **When** I select a portion of text and click on the font selector in the toolbar, **Then** I see a dropdown with all available fonts (same fonts as website font configuration).

2. **Given** I have selected text and opened the font selector, **When** I click on a font from the list, **Then** the selected text is immediately displayed in that font within the editor.

3. **Given** I have applied a font to some text and saved the page, **When** I view the public page, **Then** the text displays with the applied font.

4. **Given** I have applied a font to some text, **When** I view the raw content in the editor, **Then** the font styling is preserved when I return to edit the page.

---

### User Story 2 - Font Preview in Selector (Priority: P2)

As an administrator, I want to preview how each font looks in the font selector so that I can make an informed choice before applying it to my text.

**Why this priority**: Improves the user experience when selecting fonts, but the core functionality works without it.

**Independent Test**: Can be tested by opening the font selector and observing that each font option is displayed in its own typeface.

**Acceptance Scenarios**:

1. **Given** I am viewing the font selector dropdown, **When** I look at the font options, **Then** each font name is displayed in its own typeface so I can preview the style.

2. **Given** I am viewing the font selector dropdown, **When** I look at the font options, **Then** fonts are organized by category (sans-serif, serif, display, handwriting, monospace) for easy navigation.

---

### User Story 3 - Remove Font Formatting (Priority: P3)

As an administrator, I want to remove custom font formatting from text so that it falls back to the website's default font.

**Why this priority**: Provides users the ability to undo font changes, essential for a complete editing experience but secondary to applying fonts.

**Independent Test**: Can be tested by selecting text with a custom font, removing the font formatting, and verifying it displays in the default font.

**Acceptance Scenarios**:

1. **Given** I have text with a custom font applied, **When** I select that text and choose to remove the font (via a "default" or "remove font" option), **Then** the text displays in the website's configured default font.

2. **Given** I have text with a custom font applied, **When** I view the font selector with that text selected, **Then** the currently applied font is indicated/highlighted in the selector.

---

### Edge Cases

- What happens when a font previously applied to text is removed from the available fonts list? The text should fall back to the website's default font gracefully.
- What happens when the selected font fails to load on the public site? Standard web font fallback behavior should apply (browser default or configured fallback).
- What happens when copying and pasting text with custom fonts from external sources? Only fonts from the allowed list should be applied; others should be stripped or fall back to default.
- What happens when the user selects no text and clicks a font? The font should apply to the next text typed at the cursor position.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a font selector button in the rich text editor toolbar.
- **FR-002**: System MUST provide the same 31 fonts available in the website font configuration (Inter, Roboto, Open Sans, Lato, Montserrat, Poppins, Nunito, Raleway, Work Sans, Quicksand, Playfair Display, Merriweather, Lora, Crimson Text, Source Serif Pro, Libre Baskerville, PT Serif, Oswald, Bebas Neue, Anton, Archivo Black, Righteous, Dancing Script, Pacifico, Caveat, Satisfy, Great Vibes, Fira Code, Source Code Pro, JetBrains Mono, Roboto Mono).
- **FR-003**: System MUST organize fonts by category in the selector dropdown (sans-serif, serif, display, handwriting, monospace).
- **FR-004**: System MUST display each font option in its own typeface as a preview.
- **FR-005**: System MUST apply the selected font to the currently selected text in the editor.
- **FR-006**: System MUST apply the selected font to new text when no selection exists and the user begins typing.
- **FR-007**: System MUST persist font styling when the page content is saved.
- **FR-008**: System MUST render custom fonts correctly on the public-facing page.
- **FR-009**: System MUST indicate the currently applied font when text with a custom font is selected.
- **FR-010**: System MUST provide an option to remove custom font formatting (revert to default).
- **FR-011**: System MUST load required fonts dynamically from Google Fonts when rendering styled content.
- **FR-012**: System MUST fall back gracefully to the website's default font if a custom font fails to load.
- **FR-013**: System MUST ensure proper contrast ratios for text remain readable with any selected font.
- **FR-014**: Code MUST implement only strict minimum required for current feature (YAGNI principle).
- **FR-015**: Code MUST avoid duplication through reusable functions and components (DRY principle).
- **FR-016**: Code MUST be simple, readable, and clear with straightforward implementations (KISS principle).

### Testing Requirements

- **TR-001**: Unit tests MUST cover font selection and application logic.
- **TR-002**: Unit tests MUST cover font removal functionality.
- **TR-003**: Integration tests MUST verify font styling is saved correctly when configuring page content.
- **TR-004**: Integration tests MUST verify font styling is displayed correctly in the editor when editing saved page content.
- **TR-005**: Integration tests MUST verify fonts render correctly on the public page when viewing saved content.

### Assumptions

- The existing `AVAILABLE_FONTS` constant from `src/domain/settings/constants/AvailableFonts.ts` will be reused.
- Font styling will be stored as inline styles or appropriate HTML attributes in the content.
- The font selector will be positioned in the toolbar alongside existing formatting options (bold, italic, color, alignment).
- Google Fonts are already integrated via Next.js font optimization and will be dynamically loaded for editor preview and public display.
- The feature follows the same patterns as the existing color picker in the rich text editor.

### Key Entities

- **TextFontStyle**: Represents font styling applied to a text span. Contains the font family name from the available fonts list.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can apply a font to selected text in under 5 seconds (select text, click font selector, choose font).
- **SC-002**: 100% of font-styled text renders correctly on the public page after save.
- **SC-003**: 100% of 31 available fonts are accessible in the editor font selector.
- **SC-004**: Font changes are immediately visible in the editor without page refresh.
- **SC-005**: Font preview in the selector accurately represents how the font will appear in content.
- **SC-006**: Text with removed font formatting correctly falls back to the website's default font.
- **SC-007**: Font selection and application logic has unit test coverage.
- **SC-008**: Font persistence is verified by integration tests (save and reload in editor).
- **SC-009**: Font rendering on public page is verified by integration tests.
