## Implementation Plan for feat-rockets-crud-management-range-capacity-validation.spec

### Scope and sequencing
Deliver FR1 only: Rockets list, detail, create, update, and delete with client pre-validation for `range` and `capacity`, deterministic 400/404 handling, and no cross-feature behavior changes.

### Step 1: Define Rockets contracts and feature boundaries
Establish strict, reusable rockets domain types and keep API contract-first alignment.
- [x] Add rockets domain models in `src/app/features/rockets/data-access/rockets.models.ts`:
  `Rocket`, `RocketRange`, `CreateRocketRequest`, `UpdateRocketRequest`.
- [x] Add validation constants in `src/app/features/rockets/data-access/rockets.constants.ts`:
  `ROCKET_RANGE_OPTIONS`, `ROCKET_CAPACITY_MIN`, `ROCKET_CAPACITY_MAX`.
- [x] Add lightweight mapper/helper utilities in `src/app/features/rockets/data-access/rockets.mappers.ts` if DTO normalization is needed.
- [x] Confirm contracts match `project/api/api.models.md` and endpoint behavior in `project/api/api.endpoint.md`.

### Step 2: Implement typed Rockets API data access
Create a feature-local service that handles all Rockets CRUD operations.
- [x] Create `src/app/features/rockets/data-access/rockets-api.service.ts` using `HttpClient` and `environment.apiBaseUrl`.
- [x] Implement methods: `getRockets()`, `getRocketById(id)`, `createRocket(payload)`, `updateRocket(id, payload)`, `deleteRocket(id)`.
- [x] Keep return types strongly typed and narrow update payload fields to API-supported properties.
- [x] Add central response/error mapping hook points so 400 validation arrays and 404 not-found can be consumed by UI state.

### Step 3: Add reusable Rockets form validation
Implement pre-submission validators that block invalid requests before API calls.
- [x] Create `src/app/features/rockets/validation/rockets-form.validators.ts` with:
  `rocketRangeValidator(allowedRanges)` and `rocketCapacityValidator(min,max)`.
- [x] Build `src/app/features/rockets/rockets-form/rockets-form.factory.ts` to create the typed `FormGroup` for create/update.
- [x] Enforce `name` required, `range` one of `suborbital|orbital|moon|mars`, `capacity` integer in inclusive range 1..10.
- [x] Ensure validation messages are field-specific and compatible with accessible error rendering (`aria-describedby`, live region summary).

### Step 4: Build list and detail UI flows
Replace the placeholder Rockets page with list/detail interactions tied to API state.
- [x] Refactor `src/app/features/rockets/rockets-page/rockets-page.ts` to load list state (loading, empty, error, success).
- [x] Update `src/app/features/rockets/rockets-page/rockets-page.html` to render columns `id`, `name`, `range`, `capacity` and row actions.
- [x] Add routes in `src/app/app.routes.ts` for Rockets children or dedicated pages:
  list, create, detail by id, and edit by id.
- [x] Create detail view component(s) under `src/app/features/rockets/rocket-detail/` with deterministic 404 recovery back to list.

### Step 5: Build create and update flows with pre-validation
Implement form-driven create/edit behavior with submit blocking and value preservation.
- [x] Create Rockets create/edit components under `src/app/features/rockets/rocket-form-page/` using reactive forms.
- [x] Block submit when invalid and show field messages for invalid `range` and `capacity` before any API call.
- [x] On valid create submit call `POST /rockets`; on valid edit submit call `PUT /rockets/:id`.
- [x] On 400, map server errors to field/form UI without clearing user-entered values.
- [x] On 404 during edit load/submit, show actionable not-found state with navigation back to Rockets list.

### Step 6: Build delete flow and post-write synchronization
Support safe deletion and consistent visible state updates.
- [x] Add delete affordance with confirmation context in list/detail views.
- [x] On confirmation call `DELETE /rockets/:id` and, on 204, remove the record from visible list state.
- [x] Ensure selection/detail state is reset or rerouted when the deleted rocket is currently open.
- [x] On delete 404, present clear recovery messaging and reload list state to re-sync.

### Step 7: Implement deterministic error and feedback model for Rockets
Apply ADD error-handling and accessibility guidance to all FR1 flows.
- [x] Add a Rockets-scoped error adapter in `src/app/features/rockets/ui/rockets-error.presenter.ts` (or shared mapper if introduced by team).
- [x] Map 400 `ErrorResponse.errors[]` to field-level messages when `field` matches form controls.
- [x] Map 404 responses to page-level not-found messaging for detail/edit/delete.
- [x] Provide fallback generic message for unexpected statuses and keep console diagnostics non-blocking.

### Step 8: Cover FR1 behavior with tests
Add focused tests for validators, service integration boundaries, and component UX.
- [x] Unit tests for validators in `src/app/features/rockets/validation/rockets-form.validators.spec.ts`:
  allowed/disallowed range values, integer checks, and 1..10 boundaries.
- [x] Unit tests for API service in `src/app/features/rockets/data-access/rockets-api.service.spec.ts` using `HttpTestingController` to verify methods and URLs.
- [x] Component tests for form/list/detail/delete flows (new `*.spec.ts` under Rockets feature) covering:
  invalid submit blocking, 400 error mapping, 404 recovery, and delete success synchronization.
- [x] Update or add route-level tests to ensure Rockets navigation reaches list/create/detail/edit flows.

### Step 9: Validate acceptance criteria and finalize FR1 readiness
Execute quality gates and verify each acceptance criterion is covered.
- [x] Run `npm run build` and fix any strict typing/template issues introduced by FR1 changes.
- [x] Run `npm test -- --watch=false --browsers=ChromeHeadless` and ensure Rockets tests are stable.
- [x] Manually verify FR1 flows against API on `http://localhost:3000` (list, detail, create, update, delete, 400/404 handling).
- [x] Cross-check all FR1 acceptance criteria in `project/specs/feat-rockets-crud-management-range-capacity-validation.spec.md` and mark implementation evidence in PR/review notes.

## File-level change targets summary
- `src/app/app.routes.ts` (Rockets route expansion for CRUD flow entry points)
- `src/app/features/rockets/rockets-page/rockets-page.ts`
- `src/app/features/rockets/rockets-page/rockets-page.html`
- `src/app/features/rockets/rockets-page/rockets-page.scss`
- `src/app/features/rockets/data-access/rockets.models.ts` (new)
- `src/app/features/rockets/data-access/rockets.constants.ts` (new)
- `src/app/features/rockets/data-access/rockets.mappers.ts` (optional new)
- `src/app/features/rockets/data-access/rockets-api.service.ts` (new)
- `src/app/features/rockets/validation/rockets-form.validators.ts` (new)
- `src/app/features/rockets/rockets-form/rockets-form.factory.ts` (new)
- `src/app/features/rockets/rocket-detail/*` (new)
- `src/app/features/rockets/rocket-form-page/*` (new)
- `src/app/features/rockets/ui/rockets-error.presenter.ts` (new, or shared equivalent)
- Rockets feature test files under `src/app/features/rockets/**/*.spec.ts` (new/updated)

## Validation and error-handling strategy (FR1)
- Client pre-validation first: block submit for invalid `range` and non-integer/out-of-range `capacity`.
- API as source of truth second: reconcile server 400 errors into field/form messages.
- Deterministic status handling:
  - 200/201: render persisted values and synchronize list/detail state.
  - 204: remove deleted item from UI and reroute if needed.
  - 400: preserve user-entered form values and present actionable corrections.
  - 404: show not-found recovery UI with navigation back to Rockets list.

## Test scope (FR1 only)
- Unit: validators and rockets service HTTP contract behavior.
- Component: Rockets list/detail/create/update/delete user flows, including invalid input blocking and API error rendering.
- Route/app shell: Rockets path accessibility and navigation continuity.
- Out of scope in this plan: launches/customers/bookings feature behavior changes.

## Data model impact (ER alignment)
- No new entities or relationships for FR1.
- Existing `Rocket` entity attributes used by this feature:
  - `id: string`
  - `name: string`
  - `range: 'suborbital' | 'orbital' | 'moon' | 'mars'`
  - `capacity: number (integer 1..10)`

## Current blockers
- None identified for planning.

## Release Linkage
- Release notes: `project/release-notes.md` (Rockets CRUD Release v0.2.0)
- PRD status source: `project/PRD.md` (FR1 -> Implemented)
