import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { RocketsApiService } from '../data-access/rockets-api.service';
import { ROCKET_RANGE_OPTIONS } from '../data-access/rockets.constants';
import { CreateRocketRequest, RocketRange, UpdateRocketRequest } from '../data-access/rockets.models';
import { createRocketForm, RocketFormGroup } from '../rockets-form/rockets-form.factory';
import { presentRocketsError } from '../ui/rockets-error.presenter';

type RocketFormControlName = 'name' | 'range' | 'capacity';

const ROCKET_FORM_CONTROL_NAMES: RocketFormControlName[] = ['name', 'range', 'capacity'];

@Component({
  selector: 'app-rocket-form-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './rocket-form-page.html',
  styleUrl: './rocket-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RocketFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly rocketsApi = inject(RocketsApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly rangeOptions = ROCKET_RANGE_OPTIONS;
  protected readonly form: RocketFormGroup = createRocketForm();

  protected mode: 'create' | 'edit' = 'create';
  protected rocketId: string | null = null;
  protected isLoading = false;
  protected isSubmitting = false;
  protected formError: string | null = null;
  protected notFoundMessage: string | null = null;

  ngOnInit(): void {
    this.mode = this.route.snapshot.routeConfig?.path === ':id/edit' ? 'edit' : 'create';
    this.rocketId = this.route.snapshot.paramMap.get('id');

    this.setupServerErrorClearing();

    if (this.mode === 'edit' && this.rocketId) {
      this.loadRocket(this.rocketId);
    }
  }

  protected get pageTitle(): string {
    return this.mode === 'create' ? 'Create Rocket' : 'Edit Rocket';
  }

  protected submit(): void {
    this.formError = null;
    this.clearServerErrors();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name = this.form.controls.name.value.trim();
    const range = this.form.controls.range.value as RocketRange;
    const capacity = this.form.controls.capacity.value as number;
    const payload: CreateRocketRequest = { name, range, capacity };

    this.isSubmitting = true;

    if (this.mode === 'create') {
      this.rocketsApi.createRocket(payload).subscribe({
        next: (rocket) => {
          void this.router.navigate(['/rockets', rocket.id]);
        },
        error: (error: unknown) => {
          this.handleSubmitError(error);
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
      return;
    }

    if (!this.rocketId) {
      this.notFoundMessage = 'Rocket id is missing from the route. Return to the rockets list.';
      this.isSubmitting = false;
      return;
    }

    const updatePayload: UpdateRocketRequest = payload;

    this.rocketsApi.updateRocket(this.rocketId, updatePayload).subscribe({
      next: (rocket) => {
        void this.router.navigate(['/rockets', rocket.id]);
      },
      error: (error: unknown) => {
        this.handleSubmitError(error);
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  protected controlError(controlName: RocketFormControlName): string | null {
    const control = this.form.controls[controlName];

    if (!(control.touched || this.form.touched)) {
      return null;
    }

    if (control.hasError('required') || control.hasError('requiredTrimmed')) {
      if (controlName === 'name') {
        return 'Name is required.';
      }

      if (controlName === 'range') {
        return 'Range is required.';
      }

      return 'Capacity is required.';
    }

    if (control.hasError('rocketRange')) {
      return 'Range must be one of: suborbital, orbital, moon, or mars.';
    }

    if (control.hasError('rocketCapacityInteger')) {
      return 'Capacity must be an integer value.';
    }

    if (control.hasError('rocketCapacityRange')) {
      return 'Capacity must be between 1 and 10.';
    }

    if (control.hasError('server')) {
      return control.getError('server') as string;
    }

    return null;
  }

  private loadRocket(id: string): void {
    this.isLoading = true;
    this.formError = null;
    this.notFoundMessage = null;

    this.rocketsApi.getRocketById(id).subscribe({
      next: (rocket) => {
        this.form.setValue({
          name: rocket.name,
          range: rocket.range,
          capacity: rocket.capacity,
        });
        this.isLoading = false;
      },
      error: (error: unknown) => {
        const presented = presentRocketsError(
          error,
          'We could not load this rocket right now. Please try again.',
        );

        if (presented.kind === 'not-found') {
          this.notFoundMessage = presented.message;
        } else {
          this.formError = presented.message;
        }

        this.isLoading = false;
      },
    });
  }

  private handleSubmitError(error: unknown): void {
    const presented = presentRocketsError(
      error,
      'We could not save this rocket right now. Please try again.',
    );

    if (presented.kind === 'validation') {
      this.formError = presented.message;
      this.applyServerFieldErrors(presented.fieldErrors);
      return;
    }

    if (presented.kind === 'not-found') {
      this.notFoundMessage = presented.message;
      return;
    }

    this.formError = presented.message;
  }

  private applyServerFieldErrors(fieldErrors: Record<string, string>): void {
    for (const fieldName of ROCKET_FORM_CONTROL_NAMES) {
      const message = fieldErrors[fieldName];

      if (!message) {
        continue;
      }

      const control = this.form.controls[fieldName];
      control.setErrors({ ...(control.errors ?? {}), server: message });
      control.markAsTouched();
    }
  }

  private clearServerErrors(): void {
    for (const fieldName of ROCKET_FORM_CONTROL_NAMES) {
      this.clearErrorForControl(fieldName, 'server');
    }
  }

  private setupServerErrorClearing(): void {
    this.form.controls.name.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.clearErrorForControl('name', 'server');
    });

    this.form.controls.range.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.clearErrorForControl('range', 'server');
    });

    this.form.controls.capacity.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.clearErrorForControl('capacity', 'server');
    });
  }

  private clearErrorForControl(controlName: RocketFormControlName, errorKey: string): void {
    const control = this.form.controls[controlName];

    if (!control.hasError(errorKey)) {
      return;
    }

    const errors = { ...(control.errors ?? {}) };
    delete errors[errorKey];
    control.setErrors(Object.keys(errors).length > 0 ? errors : null);
  }
}
