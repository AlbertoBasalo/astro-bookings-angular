# AstroBookings Angular Client Architectural Design Document

Angular 21 frontend architecture for reliable and accessible CRUD operations across rockets, launches, customers, and bookings, using the AstroBookings API as the source of truth.

### Table of Contents
- [AstroBookings Angular Client Architectural Design Document](#astrobookings-angular-client-architectural-design-document)
    - [Table of Contents](#table-of-contents)
  - [1. Stack and tooling](#1-stack-and-tooling)
    - [1.1 Technology stack](#11-technology-stack)
    - [1.2 Development tools](#12-development-tools)
    - [1.3 Development workflow](#13-development-workflow)
  - [2. Systems architecture](#2-systems-architecture)
  - [3. Software architecture](#3-software-architecture)
    - [3.1 Frontend module boundaries](#31-frontend-module-boundaries)
    - [3.2 Data flow and reliability model](#32-data-flow-and-reliability-model)
    - [3.3 Accessibility baseline (WCAG)](#33-accessibility-baseline-wcag)
    - [3.4 Error handling model](#34-error-handling-model)
    - [3.5 Testing strategy](#35-testing-strategy)
    - [3.6 Out of scope](#36-out-of-scope)
  - [4. Architecture Decisions Record (ADR)](#4-architecture-decisions-record-adr)
    - [ADR 1: Angular 21 with standalone components and strict TypeScript](#adr-1-angular-21-with-standalone-components-and-strict-typescript)
    - [ADR 2: Contract-first API integration with typed feature data services](#adr-2-contract-first-api-integration-with-typed-feature-data-services)
    - [ADR 3: Deterministic HTTP status handling model](#adr-3-deterministic-http-status-handling-model)
    - [ADR 4: Reactive forms with layered validation](#adr-4-reactive-forms-with-layered-validation)
    - [ADR 5: Feature-sliced routing by rockets/launches/customers/bookings](#adr-5-feature-sliced-routing-by-rocketslaunchescustomersbookings)
    - [ADR 6: WCAG baseline as a non-functional acceptance criterion](#adr-6-wcag-baseline-as-a-non-functional-acceptance-criterion)

## 1. Stack and tooling

### 1.1 Technology stack
- Language: TypeScript (strict mode)
- Frontend framework: Angular 21
- UI architecture: standalone components, lazy feature routes
- Forms: Angular Reactive Forms for create/edit flows
- Data access: Angular HttpClient with typed DTOs and adapters
- State approach: feature-local reactive state (signals or RxJS) plus API source-of-truth refresh on writes
- API source: http://localhost:3000
- Domain modules: rockets, launches, customers, bookings

### 1.2 Development tools
- Package/runtime: Node.js LTS, npm
- Build/dev: Angular CLI
- Testing: Angular unit/component tests (Karma/Jasmine or configured runner)
- Lint/format: ESLint + Prettier (project standard)
- Documentation source contracts: project/api/api.endpoint.md and project/api/api.models.md

### 1.3 Development workflow
- Install dependencies:
```bash
npm install
```
- Run app locally:
```bash
npm start
```
- Build production bundle:
```bash
npm run build
```
- Execute tests:
```bash
npm test
```

Recommended local workflow:
1. Implement feature in one module (component + form + data service).
2. Validate against API contracts before UI polishing.
3. Add/adjust unit and component tests for validation and error mapping.
4. Verify keyboard and screen-reader baseline interactions.

## 2. Systems architecture

The system is a browser-based Angular SPA that consumes a local REST API. The frontend owns presentation, form validation, accessibility behaviors, and deterministic error translation. The backend remains authoritative for business validation, persistence, seat availability, and computed totals.

```mermaid
flowchart LR
    U[User]\nKeyboard and Pointer --> A[Angular 21 SPA]

    subgraph FE[Frontend: AstroBookings Angular Client]
      R[Router + App Shell]
      RC[Rockets Module]
      LC[Launches Module]
      CC[Customers Module]
      BC[Bookings Module]
      DS[Typed Data Services]
      EH[HTTP Error Mapper]\nField/Page Messages
      AX[Accessibility Layer]\nFocus + ARIA + Semantics
      R --> RC
      R --> LC
      R --> CC
      R --> BC
      RC --> DS
      LC --> DS
      CC --> DS
      BC --> DS
      DS --> EH
      RC --> AX
      LC --> AX
      CC --> AX
      BC --> AX
    end

    FE -->|HTTP/JSON| API[(AstroBookings API\nhttp://localhost:3000)]
    API --> DB[(Server Persistence)]
```

## 3. Software architecture

Architecture style: feature-sliced Angular SPA with contract-first API integration.

Key qualities:
- Reliability: deterministic handling of 200/201/204/400/404, explicit loading/error/success states, no silent failures.
- Error clarity: API validation arrays translated into user-friendly field and page messages.
- Accessibility: WCAG baseline embedded into component templates and form UX.

### 3.1 Frontend module boundaries
- Core:
  - app shell, global routing, HTTP interceptors, error translation utilities.
- Shared:
  - reusable form controls, validation message components, loading/empty/error states.
- Features:
  - rockets: list/detail/create/edit/delete, capacity and range validation.
  - launches: list/detail/create/edit/delete, future datetime and minPassengers constraints.
  - customers: list/detail/create/edit/delete, URL-encoded email identity flows.
  - bookings: list/detail/create/edit/delete, seat availability checks and server totalPrice rendering.

### 3.2 Data flow and reliability model
1. User submits reactive form.
2. Client validators run first (required, ranges, format, cross-field checks where needed).
3. Feature data service sends typed request DTO to API.
4. Response handling:
   - 200/201: normalize to view model and refresh or patch local list/detail state.
   - 204: remove resource from local state and route safely.
   - 400: map validation errors to field or form-level messages.
   - 404: show entity-not-found view with clear recovery navigation.
5. UI preserves user input on failed writes whenever possible.

### 3.3 Accessibility baseline (WCAG)
- Semantic landmarks and heading hierarchy per page.
- Fully keyboard-operable flows for CRUD actions and dialogs.
- Visible focus indicators and logical tab order.
- Programmatic label-input associations and helpful hint text.
- Error messages linked to controls with aria-describedby and announced via aria-live where appropriate.
- Color usage that maintains contrast and does not encode meaning by color alone.

### 3.4 Error handling model
- Centralized HTTP error mapper converts backend ErrorResponse into:
  - Field errors: shown inline for actionable correction.
  - Form/page errors: shown in summary regions with retry options.
- Unknown/unexpected failures use a safe generic message plus optional diagnostic logging in console.
- Route-level not-found scenarios produce explicit not-found views, not blank states.

### 3.5 Testing strategy
- Unit tests:
  - validators for datetime, seats, minPassengers/capacity rules.
  - error mapper behavior for 400/404 and fallback cases.
  - DTO-to-view-model mapping where applicable.
- Component tests:
  - form validation rendering, disabled submit behavior, retry affordances.
  - accessibility checks for labels, focus movement, and error announcements.
- Integration-level UI tests (as project evolves):
  - create/update/delete happy paths and key failure paths per feature module.

### 3.6 Out of scope
- Authentication and authorization.
- Payment UI integration.
- Role-based access control.
- Advanced analytics/reporting.
- Real-time updates (websockets/SSE).

## 4. Architecture Decisions Record (ADR)

### ADR 1: Angular 21 with standalone components and strict TypeScript
- Decision: Use Angular 21, standalone APIs, and strict typing across app, forms, and services.
- Status: Accepted
- Context: MVP needs maintainability and correctness while integrating with defined API contracts.
- Consequences: Better compile-time safety and modularity; requires strict discipline in DTO and model definitions.

### ADR 2: Contract-first API integration with typed feature data services
- Decision: Build one typed data service per domain module and treat API docs/contracts as source of truth.
- Status: Accepted
- Context: API behavior and DTOs are fixed and must be reflected exactly in frontend logic.
- Consequences: Lower integration drift; additional upfront mapping/typing effort.

### ADR 3: Deterministic HTTP status handling model
- Decision: Explicitly handle 200/201/204/400/404 in reusable error and response handlers.
- Status: Accepted
- Context: PRD emphasizes reliability and clear recovery from API failures.
- Consequences: More predictable UX and easier testing; slight increase in boilerplate.

### ADR 4: Reactive forms with layered validation
- Decision: Use Reactive Forms with client pre-validation plus server error reconciliation.
- Status: Accepted
- Context: CRUD-heavy workflows require robust validation feedback and preserved user input on failure.
- Consequences: Stronger UX and fewer invalid submissions; requires consistent validator reuse.

### ADR 5: Feature-sliced routing by rockets/launches/customers/bookings
- Decision: Organize app by four domain features with lazy routes and shared UI primitives.
- Status: Accepted
- Context: Domain boundaries are explicit in requirements and API structure.
- Consequences: Clear ownership and scalability; requires shared conventions for cross-feature consistency.

### ADR 6: WCAG baseline as a non-functional acceptance criterion
- Decision: Treat accessibility baseline as required architecture quality, not post-processing.
- Status: Accepted
- Context: PRD mandates semantic structure, keyboard support, and readable error messaging.
- Consequences: Better usability and quality; requires ongoing a11y checks in code reviews and tests.
