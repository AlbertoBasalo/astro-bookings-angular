import { HttpErrorResponse } from '@angular/common/http';
import { Signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { RocketsApiService } from '../data-access/rockets-api.service';
import { RocketDetailPage } from './rocket-detail-page';

describe('RocketDetailPage', () => {
  let fixture: ComponentFixture<RocketDetailPage>;
  let rocketsApi: {
    getRocketById: ReturnType<typeof vi.fn>;
    deleteRocket: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    rocketsApi = {
      getRocketById: vi.fn(),
      deleteRocket: vi.fn(),
    };

    rocketsApi.getRocketById.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404, error: { errors: [] } })),
    );

    await TestBed.configureTestingModule({
      imports: [RocketDetailPage],
      providers: [
        { provide: RocketsApiService, useValue: rocketsApi },
        { provide: Router, useValue: { navigate: vi.fn() } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'missing-id' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RocketDetailPage);
    fixture.detectChanges();
  });

  it('shows an actionable not-found message on 404', () => {
    const html = fixture.nativeElement as HTMLElement;

    expect(rocketsApi.getRocketById).toHaveBeenCalledWith('missing-id');
    expect(html.textContent).toContain('This rocket no longer exists. Return to the rockets list');

    const alert = html.querySelector('[role="alert"]');
    expect(alert?.getAttribute('aria-live')).toBe('assertive');
  });

  it('loads and renders rocket details for a valid id', async () => {
    rocketsApi.getRocketById.mockReturnValue(
      of({ id: 'r1', name: 'Falcon', range: 'orbital', capacity: 4 }),
    );

    await TestBed.resetTestingModule().configureTestingModule({
      imports: [RocketDetailPage],
      providers: [
        { provide: RocketsApiService, useValue: rocketsApi },
        { provide: Router, useValue: { navigate: vi.fn() } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'r1' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RocketDetailPage);
    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    expect(rocketsApi.getRocketById).toHaveBeenCalledWith('r1');
    expect(html.textContent).toContain('r1');
    expect(html.textContent).toContain('Falcon');
    expect(html.textContent).toContain('orbital');
    expect(html.textContent).toContain('4');
  });

  it('shows actionable and accessible message when delete returns 404', async () => {
    const router = { navigate: vi.fn() };
    rocketsApi.getRocketById.mockReturnValue(
      of({ id: 'r1', name: 'Falcon', range: 'orbital', capacity: 4 }),
    );
    rocketsApi.deleteRocket.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404, error: { errors: [] } })),
    );

    await TestBed.resetTestingModule().configureTestingModule({
      imports: [RocketDetailPage],
      providers: [
        { provide: RocketsApiService, useValue: rocketsApi },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'r1' }),
            },
          },
        },
      ],
    }).compileComponents();

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    fixture = TestBed.createComponent(RocketDetailPage);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      deleteRocket: () => void;
    };

    component.deleteRocket();
    fixture.detectChanges();

    expect(rocketsApi.deleteRocket).toHaveBeenCalledWith('r1');
    expect(router.navigate).not.toHaveBeenCalled();

    const state = fixture.componentInstance as unknown as {
      notFoundMessage: Signal<string | null>;
    };
    expect(state.notFoundMessage()).toContain('This rocket no longer exists. Return to the rockets list');
  });
});
