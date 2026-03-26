# AstroBookings Angular Client Briefing

AstroBookings client is an Angular frontend for rocket launch bookings.
The backend API runs at http://localhost:3000.
API docs are in project/api and define source contracts.

## Objectives

- Build a simple and reliable booking experience.
- Show rockets, launches, customers, and bookings.
- Support create, update, read, and delete flows.
- Surface validation and not found errors clearly.
- Keep seat and pricing data accurate in every flow.

## Domain Summary

- Rockets define range and seat capacity.
- Launches define rocket, datetime, price, and available seats.
- Customers are identified by unique email.
- Bookings connect customer, launch, seats, and total price.

## API Scope

- System: GET /health.
- Rockets: list, detail, create, update, delete.
- Launches: list, detail, create, update, delete.
- Customers: list, detail by email, create, update, delete.
- Bookings: list, detail, create, update, delete.

## Key Constraints

- Use URL encoded customer email in route params.
- Keep datetime values in ISO format for API I/O.
- Create launch with future datetime and valid rocketId.
- Respect launch minPassengers against rocket capacity.
- Respect booking seats against launch availableSeats.
- Handle API status codes 200, 201, 204, 400, and 404.

## Client Guidelines

- Use strict TypeScript and Angular standalone patterns.
- Keep HTTP logic in typed feature data services.
- Use reactive forms for create and edit operations.
- Validate fields before API requests.
- Keep UI messages friendly and actionable.
- Do not expose raw validation arrays to users.
- Add tests for business rules and edge cases.
