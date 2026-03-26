import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ROCKET_CAPACITY_MAX, ROCKET_CAPACITY_MIN, ROCKET_RANGE_OPTIONS } from '../data-access/rockets.constants';
import { Rocket, RocketRange } from '../data-access/rockets.models';
import {
  requiredTrimmedValidator,
  rocketCapacityValidator,
  rocketRangeValidator,
} from '../validation/rockets-form.validators';

export interface RocketFormModel {
  name: FormControl<string>;
  range: FormControl<RocketRange | ''>;
  capacity: FormControl<number | null>;
}

export type RocketFormGroup = FormGroup<RocketFormModel>;

export function createRocketForm(rocket?: Rocket): RocketFormGroup {
  return new FormGroup<RocketFormModel>({
    name: new FormControl(rocket?.name ?? '', {
      nonNullable: true,
      validators: [Validators.required, requiredTrimmedValidator()],
    }),
    range: new FormControl<RocketRange | ''>(rocket?.range ?? '', {
      nonNullable: true,
      validators: [Validators.required, rocketRangeValidator(ROCKET_RANGE_OPTIONS)],
    }),
    capacity: new FormControl<number | null>(rocket?.capacity ?? null, {
      validators: [Validators.required, rocketCapacityValidator(ROCKET_CAPACITY_MIN, ROCKET_CAPACITY_MAX)],
    }),
  });
}
