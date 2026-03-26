# AstroBookings API Model

These TypeScript interfaces define the contracts for API clients.

### Rocket DTOs

```typescript
/** Enum for rocket travel range */
type RocketRange = 'suborbital' | 'orbital' | 'moon' | 'mars';

/** Full Rocket resource as returned by the API */
interface Rocket {
  id: string;
  name: string;
  range: RocketRange;
  capacity: number;
}

/** Payload to create a new Rocket */
interface CreateRocketRequest {
  name: string;           // Required, non-empty
  range: RocketRange;     // Required, must be valid enum value
  capacity: number;       // Required, integer 1–10
}

/** Payload to partially update a Rocket */
interface UpdateRocketRequest {
  name?: string;
  range?: RocketRange;
  capacity?: number;
}
```

### Launch DTOs

```typescript
/** Full Launch resource as returned by the API */
interface Launch {
  id: string;
  rocketId: string;
  launchDateTime: string; // ISO 8601 datetime string
  price: number;          // Price per seat (USD)
  minPassengers: number;  // Minimum passengers required
  availableSeats: number; // Remaining bookable seats (server-managed)
}

/** Payload to create a new Launch */
interface CreateLaunchRequest {
  rocketId: string;       // Required, must reference existing Rocket
  launchDateTime: string; // Required, ISO 8601, must be in the future
  price: number;          // Required, positive number
  minPassengers: number;  // Required, integer 1..rocket.capacity
}

/** Payload to partially update a Launch */
interface UpdateLaunchRequest {
  launchDateTime?: string;
  price?: number;
  minPassengers?: number;
  availableSeats?: number;
}
```

### Customer DTOs

```typescript
/** Full Customer resource as returned by the API */
interface Customer {
  email: string;  // PK — unique, valid email format
  name: string;   // 2–100 characters
  phone: string;  // International phone format
}

/** Payload to create a new Customer */
interface CreateCustomerRequest {
  email: string;  // Required, unique, valid email format
  name: string;   // Required, 2–100 characters
  phone: string;  // Required, international phone format
}

/** Payload to partially update a Customer */
interface UpdateCustomerRequest {
  name?: string;
  phone?: string;
}
```

### Booking DTOs

```typescript
/** Full Booking resource as returned by the API */
interface Booking {
  id: string;
  customerEmail: string;  // References Customer.email
  launchId: string;       // References Launch.id
  seats: number;          // Integer 1–10
  totalPrice: number;     // Calculated: seats × launch.price
}

/** Payload to create a new Booking */
interface CreateBookingRequest {
  customerEmail: string;  // Required, must reference existing Customer
  launchId: string;       // Required, must reference existing Launch
  seats: number;          // Required, integer 1–10, ≤ launch.availableSeats
}

/** Payload to update an existing Booking */
interface UpdateBookingRequest {
  seats?: number;  // Updated seat count, re-validates against availability
}
```

### Shared DTOs

```typescript
/** Validation error item returned in 400 responses */
interface ValidationError {
  field: string;    // Name of the invalid field
  message: string;  // Human-readable description of the error
}

/** Standard error response body */
interface ErrorResponse {
  errors: ValidationError[];
}
```

