export const featureRoutePaths = {
  rockets: 'rockets',
  launches: 'launches',
  customers: 'customers',
  bookings: 'bookings',
} as const;

export const navigationItems = [
  { path: `/${featureRoutePaths.rockets}`, label: 'Rockets' },
  { path: `/${featureRoutePaths.launches}`, label: 'Launches' },
  { path: `/${featureRoutePaths.customers}`, label: 'Customers' },
  { path: `/${featureRoutePaths.bookings}`, label: 'Bookings' },
] as const;
