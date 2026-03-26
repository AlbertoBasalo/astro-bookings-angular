import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { RocketsApiService } from '../data-access/rockets-api.service';
import { RocketFormPage } from './rocket-form-page';

describe('RocketFormPage', () => {
  let fixture: ComponentFixture<RocketFormPage>;
  let rocketsApi: {
    getRocketById: ReturnType<typeof vi.fn>;
    createRocket: ReturnType<typeof vi.fn>;
    updateRocket: ReturnType<typeof vi.fn>;
  };
  let router: { navigate: ReturnType<typeof vi.fn> };

  async function setupPage(path: 'new' | ':id/edit', id?: string): Promise<void> {
    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [RocketFormPage],
        providers: [
          { provide: RocketsApiService, useValue: rocketsApi },
          { provide: Router, useValue: router },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                routeConfig: { path },
                paramMap: convertToParamMap(id ? { id } : {}),
              },
            },
          },
        ],
      })
      .compileComponents();

    fixture = TestBed.createComponent(RocketFormPage);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    rocketsApi = {
      getRocketById: vi.fn(),
      createRocket: vi.fn(),
      updateRocket: vi.fn(),
    };
    router = { navigate: vi.fn() };

    rocketsApi.createRocket.mockReturnValue(
      of({ id: 'r1', name: 'Falcon', range: 'orbital', capacity: 4 }),
    );
    rocketsApi.getRocketById.mockReturnValue(
      of({ id: 'r1', name: 'Falcon', range: 'orbital', capacity: 4 }),
    );
    rocketsApi.updateRocket.mockReturnValue(
      of({ id: 'r1', name: 'Falcon Heavy', range: 'moon', capacity: 6 }),
    );
    router.navigate.mockResolvedValue(true);

    await setupPage('new');
  });

  it('blocks submit and shows field errors for invalid range and capacity', () => {
    const component = fixture.componentInstance as unknown as {
      form: {
        controls: {
          name: { setValue: (value: string) => void };
          range: { setValue: (value: string) => void };
          capacity: { setValue: (value: number) => void };
        };
      };
      submit: () => void;
    };

    component.form.controls.name.setValue('Nova');
    component.form.controls.range.setValue('invalid-range');
    component.form.controls.capacity.setValue(11);

    component.submit();
    fixture.detectChanges();

    expect(rocketsApi.createRocket).not.toHaveBeenCalled();

    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Range must be one of');
    expect(html.textContent).toContain('Capacity must be between 1 and 10.');

    const rangeControl = html.querySelector('#rocket-range');
    const rangeError = html.querySelector('#rocket-range-error');
    expect(rangeControl?.getAttribute('aria-invalid')).toBe('true');
    expect(rangeControl?.getAttribute('aria-describedby')).toBe('rocket-range-error');
    expect(rangeError?.getAttribute('role')).toBe('alert');
  });

  it('maps 400 validation errors and preserves entered form values', () => {
    rocketsApi.createRocket.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: {
              errors: [{ field: 'capacity', message: 'Capacity must be lower than 10.' }],
            },
          }),
      ),
    );

    const component = fixture.componentInstance as unknown as {
      form: {
        controls: {
          name: { setValue: (value: string) => void; value: string };
          range: { setValue: (value: string) => void };
          capacity: { setValue: (value: number) => void; value: number | null };
        };
      };
      submit: () => void;
    };

    component.form.controls.name.setValue('Nova');
    component.form.controls.range.setValue('moon');
    component.form.controls.capacity.setValue(10);

    component.submit();
    fixture.detectChanges();

    expect(component.form.controls.capacity.value).toBe(10);

    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Please correct the highlighted fields and try again.');
    expect(html.textContent).toContain('Capacity must be lower than 10.');

    const statusAlert = html.querySelector('.status.error[role="alert"]');
    expect(statusAlert?.getAttribute('aria-live')).toBe('assertive');
  });

  it('submits valid create data and navigates to the persisted rocket detail', () => {
    const component = fixture.componentInstance as unknown as {
      form: {
        controls: {
          name: { setValue: (value: string) => void };
          range: { setValue: (value: string) => void };
          capacity: { setValue: (value: number) => void };
        };
      };
      submit: () => void;
    };

    component.form.controls.name.setValue('Nova');
    component.form.controls.range.setValue('moon');
    component.form.controls.capacity.setValue(3);

    component.submit();

    expect(rocketsApi.createRocket).toHaveBeenCalledWith({
      name: 'Nova',
      range: 'moon',
      capacity: 3,
    });
    expect(router.navigate).toHaveBeenCalledWith(['/rockets', 'r1']);
  });

  it('submits valid update data in edit mode and navigates to updated rocket detail', async () => {
    await setupPage(':id/edit', 'r1');

    const component = fixture.componentInstance as unknown as {
      form: {
        controls: {
          name: { setValue: (value: string) => void };
          range: { setValue: (value: string) => void };
          capacity: { setValue: (value: number) => void };
        };
      };
      submit: () => void;
    };

    component.form.controls.name.setValue('Falcon Heavy');
    component.form.controls.range.setValue('moon');
    component.form.controls.capacity.setValue(6);

    component.submit();

    expect(rocketsApi.getRocketById).toHaveBeenCalledWith('r1');
    expect(rocketsApi.updateRocket).toHaveBeenCalledWith('r1', {
      name: 'Falcon Heavy',
      range: 'moon',
      capacity: 6,
    });
    expect(router.navigate).toHaveBeenCalledWith(['/rockets', 'r1']);
  });

  it('shows accessible not-found feedback and preserves entered values when update returns 404', async () => {
    rocketsApi.updateRocket.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404, error: { errors: [] } })),
    );

    await setupPage(':id/edit', 'r1');

    const component = fixture.componentInstance as unknown as {
      form: {
        controls: {
          name: { setValue: (value: string) => void; value: string };
          range: { setValue: (value: string) => void; value: string };
          capacity: { setValue: (value: number) => void; value: number | null };
        };
      };
      submit: () => void;
    };

    component.form.controls.name.setValue('Falcon Heavy');
    component.form.controls.range.setValue('moon');
    component.form.controls.capacity.setValue(6);

    component.submit();
    fixture.detectChanges();

    expect(component.form.controls.name.value).toBe('Falcon Heavy');
    expect(component.form.controls.range.value).toBe('moon');
    expect(component.form.controls.capacity.value).toBe(6);

    const html = fixture.nativeElement as HTMLElement;
    const statusAlert = html.querySelector('.status.error[role="alert"]');
    expect(statusAlert?.textContent).toContain('This rocket no longer exists. Return to the rockets list');
    expect(statusAlert?.getAttribute('aria-live')).toBe('assertive');
  });
});
