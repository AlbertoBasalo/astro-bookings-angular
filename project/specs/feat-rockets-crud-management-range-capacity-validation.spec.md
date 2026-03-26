# Rockets CRUD management with range and capacity pre-validation Specification
- **Type**: feat
- **Status**: Verified

## Problem Description

Rockets are a core entity used by launch planning and booking operations, but the product currently lacks a complete and consistent management workflow for rocket records. Users need reliable list, detail, create, update, and delete flows that align with API contracts, including client-side pre-validation of `range` and `capacity` before submission. Without these flows and validations, users face avoidable submission failures, inconsistent data entry, and poor recovery when API errors occur.

### User Stories

- As an operations user, I want to view rocket lists and details so that I can verify current fleet configuration before scheduling launches.
- As an operations user, I want to create and edit rockets with clear range and capacity validation so that I can submit valid data in one attempt.
- As an operations user, I want to delete obsolete rockets and see the UI reflect the result so that fleet data remains accurate.

## Solution Overview

### User/App interface

- Provide a dedicated rockets feature entry from the app shell navigation, with predictable access to list, detail, create, update, and delete flows.
- Provide rocket list and detail experiences that expose key fields: `id`, `name`, `range`, and `capacity`.
- Provide rocket create and update forms with explicit input requirements and clear validation feedback for invalid `range` and `capacity` values.
- Provide clear delete confirmation context and deterministic post-delete user outcomes.

### Model and logic

- Treat rocket API contracts as source of truth for required create fields and allowed values.
- Enforce pre-submission validation for `range` using only allowed values: `suborbital`, `orbital`, `moon`, `mars`.
- Enforce pre-submission validation for `capacity` as an integer in the inclusive range 1 to 10.
- Preserve user-entered values when API returns validation errors so users can correct and retry efficiently.
- Ensure validation and error feedback remains understandable through semantic labels and accessible error messaging.

### Persistence

- Use `GET /rockets` and `GET /rockets/:id` for list and detail retrieval.
- Use `POST /rockets` and `PUT /rockets/:id` for create and update submissions when validation passes.
- Use `DELETE /rockets/:id` for delete operations and keep visible rocket state synchronized with successful API responses.

## Acceptance Criteria

- [ ] WHEN a user navigates to Rockets from the application shell THEN THE AstroBookings Angular Client SHALL provide list, detail, create, update, and delete user flows for rockets.
- [ ] WHEN Rockets list data is requested THEN THE AstroBookings Angular Client SHALL retrieve and display rocket records from `GET /rockets` including `id`, `name`, `range`, and `capacity`.
- [ ] WHEN a user opens a rocket detail for a valid rocket id THEN THE AstroBookings Angular Client SHALL retrieve and display that rocket from `GET /rockets/:id`.
- [ ] WHEN a user submits create or update data with a `range` value outside `suborbital|orbital|moon|mars` THEN THE AstroBookings Angular Client SHALL block submission and SHALL display a field-level `range` validation message.
- [ ] WHEN a user submits create or update data with `capacity` that is non-integer or outside 1 to 10 THEN THE AstroBookings Angular Client SHALL block submission and SHALL display a field-level `capacity` validation message.
- [ ] WHEN a user submits valid create data containing required `name`, valid `range`, and valid `capacity` THEN THE AstroBookings Angular Client SHALL submit to `POST /rockets` and SHALL show the persisted rocket on success.
- [ ] WHEN a user submits valid update data for an existing rocket THEN THE AstroBookings Angular Client SHALL submit to `PUT /rockets/:id` and SHALL show updated persisted values on success.
- [ ] WHEN a user confirms deletion of an existing rocket THEN THE AstroBookings Angular Client SHALL call `DELETE /rockets/:id` and SHALL remove the deleted rocket from the visible rockets list after a successful response.
- [ ] IF the API returns HTTP 400 or HTTP 404 during rocket detail, create, update, or delete flows THEN THE AstroBookings Angular Client SHALL present actionable and accessible error feedback and SHALL preserve entered form values for correction where applicable.
