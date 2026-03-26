# Customer management with email-as-identifier UX Specification
- **Type**: feat
- **Status**: Draft

## Problem Description

Customer records are identified by email in the API, but user flows can become confusing if the interface treats email as plain display text instead of the operational identifier. This can cause navigation errors, failed edit/delete actions, and unclear recovery paths when emails are invalid, duplicated, or not found. The product needs a clear and consistent UX where email is the primary customer identifier across list, detail, create, update, and delete workflows.

### User Stories

- As a booking agent, I want to open customer details using the customer email so that I can quickly find and manage the exact record.
- As an operations user, I want edit and delete actions to target customers by email so that customer updates and removals are reliable.
- As a self-service customer, I want clear feedback for invalid, duplicate, or missing emails so that I can correct issues and complete my action.

## Solution Overview

### User/App interface

- Present customer list and detail experiences that visibly treat email as the primary identity for navigation and actions.
- Ensure customer detail, edit, and delete routes consistently use URL-safe email values.
- Provide clear page-level and field-level error messaging for duplicate email, invalid email format, and customer-not-found scenarios.

### Model and logic

- Align customer operations with API contracts where customer retrieval and mutations are addressed by email.
- Keep create, update, and delete outcomes synchronized with visible UI state after successful API responses.
- Standardize validation and error translation so API 400 and 404 responses map to actionable user feedback.

### Persistence

- Use the existing AstroBookings API at `http://localhost:3000` as the single source of truth for customer data.
- Persist customer create, update, and delete operations through the customer endpoints keyed by email.

## Acceptance Criteria

- [ ] THE AstroBookings Angular Client SHALL provide customer list, detail, create, update, and delete user flows.
- [ ] WHEN a user opens a customer detail view THE AstroBookings Angular Client SHALL resolve the customer using the URL-encoded email identifier.
- [ ] WHEN a user submits a new customer with an email that already exists THEN THE AstroBookings Angular Client SHALL display actionable duplicate-email feedback from the API response.
- [ ] WHEN a user submits a customer form with an invalid email format THEN THE AstroBookings Angular Client SHALL display field-level email validation feedback and SHALL prevent successful submission.
- [ ] WHEN a user updates a customer THEN THE AstroBookings Angular Client SHALL send the update to the customer endpoint addressed by the selected customer email.
- [ ] WHEN a user deletes a customer THEN THE AstroBookings Angular Client SHALL call the customer delete endpoint addressed by email and SHALL remove the deleted customer from the visible UI state.
- [ ] IF the API returns 404 for a customer email THEN THE AstroBookings Angular Client SHALL display a not-found message with recovery navigation to the customer list.
- [ ] WHEN a customer create or update action succeeds THEN THE AstroBookings Angular Client SHALL display the persisted customer data returned by the API.
- [ ] WHILE a customer create, update, or delete request is in progress THE AstroBookings Angular Client SHALL prevent duplicate submissions for that action.
