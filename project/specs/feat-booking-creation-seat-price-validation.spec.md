# Booking creation with seat and price validation Specification
- **Type**: feat
- **Status**: Draft

## Problem Description

Booking creation needs consistent validation and outcome clarity before and after submission. Users must only be able to create bookings that reference existing customers and launches, request a valid seat count within availability limits, and receive a trustworthy total price derived from launch price and selected seats. Without this, booking attempts can fail unexpectedly, produce unclear error recovery paths, or show inconsistent pricing expectations.

### User Stories

- As a booking agent, I want booking creation to validate customer, launch, and seat inputs so that I can submit valid bookings with fewer retries.
- As an operations user, I want to prevent seat requests that exceed launch availability so that overbooking is avoided.
- As a customer, I want to see the computed booking total price after creation so that I can confirm the final cost.

## Solution Overview

### User/App interface

- Provide a booking creation flow that captures customer email, launch selection, and seat count.
- Show clear field-level and form-level validation feedback before submission and after API responses.
- Present booking confirmation details including returned total price on successful creation.

### Model and logic

- Treat booking creation contracts as authoritative: `customerEmail`, `launchId`, and `seats` are required.
- Enforce booking rules aligned with API contracts: referenced customer and launch must exist, seats must be integer in allowed range, and seats must not exceed launch available seats.
- Use API response data as source of truth for computed `totalPrice` and persisted booking details.

### Persistence

- Submit booking creation requests to `POST /bookings`.
- Use API responses to populate created booking state and surface validation/not-found errors deterministically.
- Keep booking views synchronized with successful booking creation outcomes from the API.

## Acceptance Criteria

- [ ] WHEN a user submits booking creation with valid `customerEmail`, valid `launchId`, and valid `seats` THEN THE System SHALL create the booking through `POST /bookings` and return a created booking result.
- [ ] IF `customerEmail` does not reference an existing customer THEN THE System SHALL prevent successful booking creation and SHALL present an actionable error message.
- [ ] IF `launchId` does not reference an existing launch THEN THE System SHALL prevent successful booking creation and SHALL present an actionable error message.
- [ ] IF `seats` is not an integer between 1 and 10 THEN THE System SHALL prevent successful booking creation and SHALL present an actionable seat validation message.
- [ ] IF requested `seats` exceeds launch `availableSeats` THEN THE System SHALL prevent successful booking creation and SHALL present an over-capacity validation message.
- [ ] WHEN booking creation succeeds THEN THE System SHALL display the created booking including `totalPrice` returned by the API.
- [ ] WHEN the API returns a 400 validation response for booking creation THEN THE System SHALL map each returned validation item to clear field-level or form-level feedback.
- [ ] WHEN the API returns a 404 response for referenced booking dependencies THEN THE System SHALL present a clear not-found recovery message and SHALL preserve user-entered form values.