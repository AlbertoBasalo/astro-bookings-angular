import { RocketRange } from './rockets.models';

export const ROCKET_RANGE_OPTIONS: readonly RocketRange[] = [
  'suborbital',
  'orbital',
  'moon',
  'mars',
] as const;

export const ROCKET_CAPACITY_MIN = 1;
export const ROCKET_CAPACITY_MAX = 10;
