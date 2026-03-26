# AstroBookings Angular Client Product Requirements Document

A greenfield Angular web client that enables reliable rocket launch booking operations and self-service flows using the AstroBookings API.

## Vision and Scope

AstroBookings Angular Client will provide a practical, API-driven interface for managing rockets, launches, customers, and bookings from a single frontend. The MVP goal is to deliver complete CRUD coverage for all core entities with strong validation feedback and accessible interactions, so internal teams and customers can complete booking tasks accurately and confidently.

Primary users are internal booking agents, operations/admin staff, and end customers using a self-service portal.

In scope for MVP: full CRUD for Rockets, Launches, Customers, and Bookings; user-facing validation and error messaging; accessible baseline interactions.

Out of scope for MVP: authentication/authorization, payments UI integration, role-based permissions, advanced analytics/reporting, and real-time updates/websockets.

## Functional Requirements

### FR1 Rockets CRUD management
- The product shall provide list, detail, create, update, and delete flows for rockets mapped to the API contracts, including range and capacity inputs with client-side pre-validation before submission.
- **Status**: NotStarted

### FR2 Launches CRUD with launch rule validation
- The product shall provide full CRUD for launches and enforce input validation for rocket linkage, future ISO datetime, price, and minimum passenger constraints before and after API responses.
- **Status**: InProgress

### FR3 Customers CRUD with email-as-identifier UX
- The product shall provide full CRUD for customers using email as the primary identifier in navigation and edit/delete flows, handling URL-encoded email routes and clear duplicate/invalid email feedback.
- **Status**: InProgress

### FR4 Bookings CRUD with booking creation validation
- The product shall provide full CRUD for bookings and validate booking creation/update rules for customer existence, launch existence, and seats not exceeding available capacity, while displaying computed total price returned by the API.
- **Status**: InProgress

### FR5 Error clarity and recovery UX
- The product shall translate API validation and not-found errors into actionable field and page-level messages, including retry/recovery affordances for failed operations.
- **Status**: NotStarted

### FR6 Cross-entity navigation and consistency
- The product shall support consistent navigation between entity modules (rockets, launches, customers, bookings) and keep displayed records synchronized with successful API writes and deletes.
- **Status**: NotStarted

## Technical Requirements

### TR1 API contract adherence and typed data services
- The frontend shall treat http://localhost:3000 and the API docs under project/api as source of truth, implementing strict TypeScript models and typed Angular data services per endpoint and DTO contract.
- **Status**: NotStarted

### TR2 Accessibility baseline (WCAG)
- The frontend shall meet an MVP WCAG baseline for semantic structure, keyboard accessibility, focus visibility, label associations, and readable validation/error messaging.
- **Status**: NotStarted

### TR3 Reliability and deterministic error handling
- The frontend shall implement deterministic handling for HTTP 200/201/204/400/404 responses, preserving form state where appropriate and avoiding silent failures across CRUD workflows.
- **Status**: NotStarted

### TR4 Greenfield delivery sequencing
- Implementation shall prioritize the initial spec sequence: booking creation validation, launch management validation, then customer management with email-as-identifier UX, while maintaining compatibility with the full MVP CRUD scope.
- **Status**: NotStarted
