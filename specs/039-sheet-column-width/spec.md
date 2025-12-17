# Feature Specification: Sheet Column Width Configuration

**Feature Branch**: `039-sheet-column-width`  
**Created**: 2025-12-17  
**Status**: Draft  
**Input**: User description: "As an administrator, when I'm configuring a page content, and more specifically a sheet, I want to be able to fix the size of a column. In my case I have 5 sheets with one row and two columns. The first column contains an image of the same size in the 5 sheets. But the text length in the second column is different, so the alignment is not the same for each sheet in my page content. I want to be able to do it."

## Clarifications

### Session 2025-12-17

- Q: What is the preferred method for setting column width? → A: Numeric input field in the table toolbar (not drag-resize).
- Q: Where should the width input appear? → A: In the table toolbar alongside existing controls.
- Q: What happens to adjacent columns when one is resized? → A: Adjacent columns adjust proportionally to maintain total table width.
- Q: What happens when the column width input is empty? → A: Column width auto-adapts to the table width (default/auto behavior).

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Set Column Width via Numeric Input (Priority: P1)

As an administrator editing a page with multiple sheets (tables), I want to enter a specific pixel width for a column in an input field so that I can precisely align content across different sheets on the same page.

**Why this priority**: This is the core functionality requested. The administrator needs to fix column widths to ensure visual consistency across multiple sheets with varying text lengths.

**Independent Test**: Can be fully tested by selecting a cell in a sheet, entering a pixel value in the column width input in the toolbar, and verifying the column width updates immediately and persists on the public page.

**Acceptance Scenarios**:

1. **Given** I am editing a page with a 2-column sheet and I select a cell, **When** I look at the table toolbar, **Then** I see a column width input field showing the current column's width.
2. **Given** I am in a cell and I type a pixel value in the column width input, **When** I enter the value, **Then** the column width updates immediately with visual feedback.
3. **Given** I have set a specific column width, **When** I save the page and view it publicly, **Then** the column maintains the exact width I configured.

---

### User Story 2 - Consistent Column Widths Across Multiple Sheets (Priority: P1)

As an administrator with multiple sheets on a single page, I want each sheet to remember its column widths independently so that I can align the first columns of all sheets to the same width.

**Why this priority**: This addresses the core problem described - having 5 sheets with images in the first column that need to align visually despite varying text lengths in the second column.

**Independent Test**: Can be tested by creating two sheets, setting the first column of both to the same width, adding different amounts of text to the second column, and verifying alignment on the public page.

**Acceptance Scenarios**:

1. **Given** I have 5 sheets on a page, **When** I set the first column of each sheet to 200 pixels, **Then** all first columns align perfectly regardless of second column content.
2. **Given** I resize a column in one sheet, **When** I check other sheets on the same page, **Then** their column widths remain unchanged.
3. **Given** multiple sheets with identical first-column widths, **When** viewed on the public page, **Then** the images in the first columns align vertically across all sheets.

---

### User Story 3 - Visual Feedback During Width Input (Priority: P1)

As an administrator entering a column width value, I want to see the column resize in real-time as I type so that I can see the effect immediately.

**Why this priority**: The user explicitly requested visual feedback while typing. This is essential for the intended workflow of adjusting widths precisely.

**Independent Test**: Can be tested by selecting a cell, typing a pixel value in the column width input, and verifying the column resizes in real-time as each digit is entered.

**Acceptance Scenarios**:

1. **Given** I am typing a pixel value in the column width input, **When** I enter each digit, **Then** the column width visually updates in real-time to show the new size.
2. **Given** I am entering a width value, **When** the value changes, **Then** the table layout adjusts dynamically to reflect the change.

---

### Edge Cases

- What happens when a column is resized to be very narrow (minimum width)? The column should have a minimum width (50 pixels) when an explicit value is set to prevent content from becoming unreadable.
- What happens when a column is resized to take the entire table width? The system should ensure at least a minimum width for other columns.
- How does the system handle column widths on mobile/responsive views? Column widths are maintained but the table becomes horizontally scrollable on smaller screens.
- What happens when a new column is added to a sheet with custom widths? New columns receive an equal share of the remaining space.
- What happens when a column is deleted from a sheet with custom widths? Remaining columns expand proportionally to fill the space.
- What happens when the column width input is empty or cleared? The column auto-adapts to the table width (default behavior), distributing space proportionally.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a column width input field in the table toolbar when a cell is selected.
- **FR-002**: System MUST show the current column's width (in pixels) in the input field when a cell is selected, or show empty if no explicit width is set.
- **FR-003**: System MUST update the column width in real-time as the administrator types a value in the input field.
- **FR-004**: System MUST persist column width values when the page content is saved.
- **FR-005**: System MUST render the configured column widths on the public page exactly as set in the editor.
- **FR-006**: System MUST enforce a minimum column width of 50 pixels when an explicit value is set.
- **FR-007**: System MUST ensure that when one column is resized, adjacent columns adjust to maintain the total table width.
- **FR-008**: System MUST maintain independent column width settings for each sheet on a page.
- **FR-009**: System MUST ensure proper contrast ratios for the input field in both light and dark modes.
- **FR-010**: System MUST auto-adapt column width to table width when the input field is empty (no explicit width set).
- **FR-011**: Code MUST implement only strict minimum required for current feature (YAGNI principle).
- **FR-012**: Code MUST avoid duplication through reusable functions and components (DRY principle).
- **FR-013**: Code MUST be simple, readable, and clear with straightforward implementations (KISS principle).

### Key Entities

- **TableColumn**: Represents a column within a sheet/table. Key attributes: width (in pixels), position (column index).
- **Sheet/Table**: A tabular content element containing rows and columns. Stores column width configuration as part of its data structure.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can set column widths and see them persist correctly on the public page 100% of the time.
- **SC-002**: Column resize operation completes in under 100 milliseconds from drag release to visual confirmation.
- **SC-003**: Multiple sheets on the same page can each have independently configured column widths.
- **SC-004**: 90% of administrators can successfully resize a column on their first attempt without external guidance.
- **SC-005**: Column alignment across multiple sheets is pixel-perfect when the same width value is set.

## Assumptions

- The existing Tiptap table extension infrastructure supports column width attributes (confirmed: `colwidth` attribute exists but is disabled).
- Column widths are stored as pixel values.
- The table uses fixed layout mode to respect explicit column widths.
- The column width input appears in the existing TableToolbar component alongside other table controls.
- Column widths apply equally to all rows in a column (standard table behavior).
- The input field accepts only positive numeric values.
