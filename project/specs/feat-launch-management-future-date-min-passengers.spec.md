# Launch management with future-date and minPassengers rules Specification
- **Type**: feat
- **Status**: Draft

## Problem Description
Launch creation and update flows need clear and consistent validation for `launchDateTime` and `minPassengers` so users can schedule only valid launches and correct errors quickly. Without explicit future-date and minimum-passenger rule handling, users can submit invalid launch data, receive unclear feedback, and lose confidence in launch management reliability.

### User Stories
- As an operations user, I want to create a launch only when the launch datetime is in the future so that past launches are not scheduled by mistake.
- As an operations user, I want `minPassengers` to be constrained by the selected rocket capacity so that launch requirements are realistic and valid.
- As an operations user, I want clear field-level feedback for invalid launch inputs so that I can fix issues in one attempt.

## Solution Overview

### User/App interface
- Provide launch create and edit forms that collect `rocketId`, `launchDateTime`, `price`, and `minPassengers`.
- Show immediate, explicit validation feedback for invalid `launchDateTime` and `minPassengers` values.
- Display API validation responses as actionable field or form messages when server-side checks fail.

### Model and logic
- Treat launch contracts in API documentation as the source of truth for required fields and value constraints.
- Enforce that `launchDateTime` is a valid ISO datetime and represents a future moment.
- Enforce that `minPassengers` is an integer within allowed bounds and does not exceed the selected rocket capacity.

### Persistence
- Persist launch data through the Launches API endpoints at `http://localhost:3000`.
- Keep launch list/detail views synchronized with successful create and update responses.
- Preserve entered values on failed submissions to support user correction and retry.

## Acceptance Criteria
- [ ] WHEN a user submits launch create data with `launchDateTime` in the past THEN THE AstroBookings Angular Client SHALL block submission and present a field error for `launchDateTime`.
- [ ] WHEN a user submits launch create data with a non-ISO `launchDateTime` value THEN THE AstroBookings Angular Client SHALL block submission and present a field error for `launchDateTime`.
- [ ] WHEN a user submits launch create or update data with `minPassengers` less than 1 THEN THE AstroBookings Angular Client SHALL block submission and present a field error for `minPassengers`.
- [ ] WHEN a user submits launch create or update data with `minPassengers` greater than the selected rocket capacity THEN THE AstroBookings Angular Client SHALL block submission and present a field error for `minPassengers`.
- [ ] WHEN launch create data satisfies required field rules and validation constraints THEN THE AstroBookings Angular Client SHALL submit the request to `POST /launches` and display the created launch on success.
- [ ] WHEN launch update data satisfies required field rules and validation constraints THEN THE AstroBookings Angular Client SHALL submit the request to `PUT /launches/:id` and display updated launch data on success.
- [ ] WHEN the API returns HTTP 400 with `ErrorResponse` validation items for launch create or update THEN THE AstroBookings Angular Client SHALL map errors to the related fields or form-level message without clearing user-entered values.
- [ ] IF the API returns HTTP 404 for launch update THEN THE AstroBookings Angular Client SHALL present a not-found state with recovery navigation to the launches list.
