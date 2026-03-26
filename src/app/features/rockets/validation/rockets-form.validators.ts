import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { RocketRange } from '../data-access/rockets.models';

export function rocketRangeValidator(allowedRanges: readonly RocketRange[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (typeof value !== 'string' || value.trim().length === 0) {
      return null;
    }

    return allowedRanges.includes(value as RocketRange) ? null : { rocketRange: true };
  };
}

export function rocketCapacityValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (typeof value !== 'number' || !Number.isInteger(value)) {
      return { rocketCapacityInteger: true };
    }

    if (value < min || value > max) {
      return { rocketCapacityRange: { min, max } };
    }

    return null;
  };
}

export function requiredTrimmedValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return typeof value === 'string' && value.trim().length > 0 ? null : { requiredTrimmed: true };
  };
}
