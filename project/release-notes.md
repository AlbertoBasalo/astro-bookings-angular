# Release Notes

## 2026-03-26 - Rockets CRUD Release (v0.2.0)

### Scope
- Feature spec: project/specs/feat-rockets-crud-management-range-capacity-validation.spec.md
- Feature plan: project/specs/feat-rockets-crud-management-range-capacity-validation.plan.md
- Release state: Released

### What was integrated
- Rockets CRUD coverage aligned with API contracts for list, detail, create, update, and delete flows.
- Client-side pre-validation coverage documented for allowed `range` values and integer `capacity` bounds.
- Deterministic handling documented for expected 400/404 outcomes and user recovery messaging.

### Status trail alignment
- PRD FR1 status updated to Implemented.
- FR1 specification status updated from Verified to Released.
- FR1 implementation plan checklist marked complete.

### Notes
- This release completes FR1 and preserves sequence continuity for remaining MVP feature releases.

## 2026-03-26 - Baseline Scaffolding Release (v0.1.0)

### Scope
- Feature spec: project/specs/feat-angular-app-setup-baseline-scaffolding.spec.md
- Release state: Released

### What was integrated
- Angular 21 standalone app baseline with strict TypeScript workspace setup.
- Base shell and navigation routes for Home, Rockets, Launches, Customers, and Bookings.
- Feature placeholder pages and foundational routing for incremental domain implementation.
- API base URL configuration aligned to http://localhost:3000.

### Status trail alignment
- PRD TR1 status updated to Implemented.
- PRD TR5 status updated to InProgress to reflect sequence progression.
- Implementation plan checklist marked complete and blockers resolved.

### Notes
- This release establishes the foundation for subsequent feature specs in the planned sequence.
