## Implementation Plan for feat-angular-app-setup-baseline-scaffolding.spec

### Step 1: Bootstrap Angular 21 workspace
Create the Angular app foundation with strict TypeScript and standalone architecture.
- [x] Confirm Node.js LTS and npm are available (`node -v`, `npm -v`).
- [x] Scaffold the Angular 21 app at repository root using standalone mode and strict settings.
- [x] Ensure generated files include `angular.json`, `package.json`, `tsconfig*.json`, and `src/` baseline structure.
- [x] Install dependencies and verify initial workspace integrity.

### Step 2: Align scripts and project conventions
Ensure project scripts and baseline tooling match ADD workflow expectations.
- [x] Verify `package.json` contains working `start`, `build`, and `test` scripts.
- [x] Confirm scripts map to Angular CLI commands (`ng serve`, `ng build`, `ng test`) without custom blockers.
- [x] Keep strict TypeScript configuration enabled in app and template checks.
- [x] Validate workspace uses standalone bootstrap (`bootstrapApplication`) and app config providers.

### Step 3: Build app shell and top-level navigation
Provide a stable shell for incremental feature integration.
- [x] Implement base layout in app shell with header/main structure and accessible navigation.
- [x] Add navigation entries for rockets, launches, customers, and bookings.
- [x] Add a landing/home placeholder route and default redirect behavior.
- [x] Ensure route links expose clear active states and keyboard accessibility.

### Step 4: Create route placeholders by feature boundary
Prepare route skeletons so each feature can be developed independently.
- [x] Define router configuration for `/rockets`, `/launches`, `/customers`, and `/bookings`.
- [x] Add standalone placeholder components for each feature route.
- [x] Add optional wildcard route fallback to the landing route.
- [x] Keep feature files under a feature-oriented folder structure for future CRUD modules.

### Step 5: Add API base configuration
Configure baseline environment integration with the local API source of truth.
- [x] Add environment configuration for `apiBaseUrl` targeting `http://localhost:3000`.
- [x] Ensure environment import pattern is ready for typed data services.
- [x] Add a minimal API config token/service (if needed) to centralize URL usage.
- [x] Verify no hardcoded API URLs are spread through components.

### Step 6: Add baseline tests for shell and routing
Create a minimal, passing test suite validating scaffold behavior.
- [x] Update/create app-level tests to verify shell renders and navigation links are present.
- [x] Add route-level tests verifying each configured path resolves to its placeholder view.
- [x] Keep tests deterministic and independent from backend availability.
- [x] Ensure `npm test` executes the baseline suite successfully.

### Step 7: Verify acceptance criteria end-to-end
Run required commands and capture evidence that all baseline criteria are satisfied.
- [x] Run `npm start` and verify local dev server launches without blocking errors.
- [x] Run `npm run build` and verify production build succeeds.
- [x] Run `npm test` and verify baseline tests pass.
- [x] Manually validate navigation to each feature route shows its placeholder view.

## Prerequisite Setup Commands
```bash
# From repository root
node -v
npm -v
npx @angular/cli@21 new astro-bookings-angular --standalone --strict --routing --style=scss --skip-git --package-manager=npm --directory .
npm install
```

## Verification Commands
```bash
npm start
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```

## Data Modeling Impact
- No ER model changes are required for this baseline scaffolding feature.
- Domain entities (rocket, launch, customer, booking) are represented as route placeholders only at this stage.

## Current Blockers
- None.
