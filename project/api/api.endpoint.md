# API Endpoints

> Backend API at https://github.com/AlbertoBasalo/astro-bookings-express
> Will run locally on http://localhost:3000

## System
- `GET /health` - Health check endpoint

## Rockets
- `GET /rockets` - Retrieve all rockets
- `GET /rockets/:id` - Retrieve a specific rocket by ID
- `POST /rockets` - Create a new rocket (requires: name, range, capacity)
- `PUT /rockets/:id` - Update an existing rocket
- `DELETE /rockets/:id` - Delete a rocket

## Launches
- `GET /launches` - Retrieve all launches
- `GET /launches/:id` - Retrieve a specific launch by ID
- `POST /launches` - Create a new launch (requires: rocketId, launchDateTime, price, minPassengers)
- `PUT /launches/:id` - Update an existing launch
- `DELETE /launches/:id` - Delete a launch

## Customers
- `GET /customers` - Retrieve all customers
- `GET /customers/:email` - Retrieve a specific customer by email (URL-encoded)
- `POST /customers` - Create a new customer (requires: email, name, phone)
- `PUT /customers/:email` - Update an existing customer
- `DELETE /customers/:email` - Delete a customer

## Bookings
- `GET /bookings` - Retrieve all bookings
- `GET /bookings/:id` - Retrieve a specific booking by ID
- `POST /bookings` - Create a new booking (requires: customerEmail, launchId, seats)
- `PUT /bookings/:id` - Update an existing booking
- `DELETE /bookings/:id` - Delete a booking

### HTTP Status Code Reference

| Status | Meaning       | Used when                                           |
|--------|---------------|-----------------------------------------------------|
| 200    | OK            | Successful GET or PUT                               |
| 201    | Created       | Successful POST (resource created)                  |
| 204    | No Content    | Successful DELETE                                   |
| 400    | Bad Request   | Validation errors (returns `ErrorResponse` in body) |
| 404    | Not Found     | Resource not found by ID/email                      |
