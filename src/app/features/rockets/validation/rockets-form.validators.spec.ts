import { FormControl } from '@angular/forms';

import { ROCKET_RANGE_OPTIONS } from '../data-access/rockets.constants';
import { rocketCapacityValidator, rocketRangeValidator } from './rockets-form.validators';

describe('rockets-form validators', () => {
  it('accepts valid range values and rejects invalid values', () => {
    const control = new FormControl<string>('orbital');
    const validator = rocketRangeValidator(ROCKET_RANGE_OPTIONS);

    expect(validator(control)).toBeNull();

    control.setValue('deep-space');
    expect(validator(control)).toEqual({ rocketRange: true });
  });

  it('requires capacity to be an integer in range 1..10', () => {
    const control = new FormControl<number | null>(5);
    const validator = rocketCapacityValidator(1, 10);

    expect(validator(control)).toBeNull();

    control.setValue(2.5);
    expect(validator(control)).toEqual({ rocketCapacityInteger: true });

    control.setValue(11);
    expect(validator(control)).toEqual({ rocketCapacityRange: { min: 1, max: 10 } });

    control.setValue(1);
    expect(validator(control)).toBeNull();
  });
});
