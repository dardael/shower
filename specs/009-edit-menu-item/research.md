# Research: Edit Menu Item

**Feature**: 009-edit-menu-item  
**Date**: 2025-01-30

## Research Summary

This feature adds edit functionality to existing menu items. The research validates the technical approach against existing codebase patterns.

---

## 1. Domain Entity Update Pattern

**Question**: How should MenuItem entity handle text updates while preserving immutability?

**Decision**: Add `withText(text: MenuItemText): MenuItem` method to MenuItem entity

**Rationale**:

- Existing pattern: `withId(id: string)` already returns a new MenuItem instance
- Immutable entity pattern: Create new instance with updated field rather than mutating
- Preserves position, createdAt, updates updatedAt timestamp

**Alternatives Considered**:

- Mutable setter: Rejected - violates immutability pattern used in entity
- Factory method: Rejected - `withText()` follows existing `withId()` convention

---

## 2. Repository Pattern for Updates

**Question**: Does existing `save()` method handle updates, or is a separate `update()` needed?

**Decision**: Use existing `save()` method - it handles both create and update

**Rationale**:

- Examining `MongoMenuItemRepository.save()` pattern in similar repositories
- MongoDB `findOneAndUpdate` with `upsert: false` for updates when ID exists
- Entity `hasId` getter distinguishes create vs update scenarios

**Alternatives Considered**:

- Separate `update()` method: Rejected - adds complexity without benefit; save() already handles this

---

## 3. API Endpoint Design

**Question**: What HTTP method and endpoint for updating menu item text?

**Decision**: `PATCH /api/settings/menu/[id]` with `{ text: string }` body

**Rationale**:

- PATCH for partial update (only text, not full resource replacement)
- Matches existing route structure: `/api/settings/menu/[id]` already has DELETE
- Consistent with RESTful conventions

**Alternatives Considered**:

- PUT: Rejected - implies full resource replacement; we only update text
- POST: Rejected - not idempotent, semantically incorrect for update
- PUT /api/settings/menu with id in body: Rejected - already used for reorder

---

## 4. UI Inline Editing Pattern

**Question**: How to implement inline editing in SortableMenuItem component?

**Decision**: Click-to-edit pattern with local edit state in SortableMenuItem

**Rationale**:

- Matches spec requirement for inline editing (not modal)
- Component already has item.text display - swap to Input when editing
- Escape to cancel, Enter or blur to save
- Minimal UI changes, maximum usability

**Alternatives Considered**:

- Modal dialog: Rejected - spec prefers inline editing, adds unnecessary complexity
- Always-editable input: Rejected - confusing UX, accidental edits possible
- Edit button revealing input: Acceptable, but click-on-text is more intuitive

---

## 5. Validation Reuse

**Question**: How to reuse existing MenuItemText validation for edits?

**Decision**: Reuse `MenuItemText.create()` in UpdateMenuItem use case

**Rationale**:

- Existing validation: non-empty (after trim), max 100 characters
- Same validation logic applies to edits as creates
- Error messages already defined in MenuItemText class
- API route returns 400 on validation errors (existing pattern in POST handler)

**Alternatives Considered**:

- Duplicate validation in route: Rejected - violates DRY principle
- Client-only validation: Rejected - server must validate; client can pre-validate for UX

---

## 6. Error Handling for Concurrent Deletion

**Question**: What happens if menu item is deleted while being edited?

**Decision**: Return 404 from PATCH handler; UI shows error toast

**Rationale**:

- Repository `findById()` returns null if item doesn't exist
- Use case throws specific error "Menu item not found"
- API route catches and returns 404
- Frontend shows error toast, refreshes list

**Alternatives Considered**:

- Optimistic locking: Rejected - YAGNI; single-admin scenario makes conflicts rare
- Real-time sync: Rejected - adds complexity; simple refresh is sufficient

---

## Research Conclusion

No NEEDS CLARIFICATION items remain. The implementation follows established patterns:

| Component      | Pattern                         | Source                       |
| -------------- | ------------------------------- | ---------------------------- |
| Entity update  | Immutable `with*()` method      | MenuItem.withId()            |
| Repository     | Existing save() handles updates | MenuItemRepository interface |
| API            | PATCH /api/settings/menu/[id]   | RESTful conventions          |
| Validation     | Reuse MenuItemText.create()     | DRY principle                |
| UI             | Click-to-edit inline pattern    | Spec requirements            |
| Error handling | 404 + toast notification        | Existing DELETE pattern      |
