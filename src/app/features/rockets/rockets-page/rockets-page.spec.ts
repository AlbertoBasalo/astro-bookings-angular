import { HttpErrorResponse } from '@angular/common/http';
import { Signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { RocketsApiService } from '../data-access/rockets-api.service';
import { RocketsPage } from './rockets-page';

describe('RocketsPage', () => {
  let fixture: ComponentFixture<RocketsPage>;
  let rocketsApi: {
    getRockets: ReturnType<typeof vi.fn>;
    deleteRocket: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    rocketsApi = {
      getRockets: vi.fn(),
      deleteRocket: vi.fn(),
    };

    rocketsApi.getRockets.mockReturnValue(
      of([{ id: 'r1', name: 'Falcon', range: 'orbital', capacity: 4 }]),
    );
    rocketsApi.deleteRocket.mockReturnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [RocketsPage],
      providers: [provideRouter([]), { provide: RocketsApiService, useValue: rocketsApi }],
    }).compileComponents();

    fixture = TestBed.createComponent(RocketsPage);
    fixture.detectChanges();
  });

  it('renders rockets returned by the API', () => {
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('r1');
    expect(html.textContent).toContain('Falcon');
    expect(html.textContent).toContain('orbital');
    expect(html.textContent).toContain('4');
    expect(html.textContent).toContain('Create Rocket');
    expect(html.textContent).toContain('Detail');
    expect(html.textContent).toContain('Edit');
    expect(html.textContent).toContain('Delete');
  });

  it('removes the deleted rocket from the visible list on successful delete', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const component = fixture.componentInstance as unknown as {
      rockets: Signal<Array<{ id: string; name: string; range: string; capacity: number }>>;
      deleteRocket: (rocket: { id: string; name: string; range: string; capacity: number }) => void;
    };

    component.deleteRocket(component.rockets()[0]);
    fixture.detectChanges();

    expect(rocketsApi.deleteRocket).toHaveBeenCalledWith('r1');
    expect(component.rockets()).toEqual([]);

  });

  it('re-syncs list when delete returns 404', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    rocketsApi.deleteRocket.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404, error: { errors: [] } })),
    );

    const component = fixture.componentInstance as unknown as {
      rockets: Signal<Array<{ id: string; name: string; range: string; capacity: number }>>;
      deleteRocket: (rocket: { id: string; name: string; range: string; capacity: number }) => void;
    };

    component.deleteRocket(component.rockets()[0]);

    expect(rocketsApi.deleteRocket).toHaveBeenCalledWith('r1');
    expect(rocketsApi.getRockets).toHaveBeenCalledTimes(2);

    const state = fixture.componentInstance as unknown as {
      pageError: Signal<string | null>;
    };
    expect(state.pageError()).toBeNull();
  });
});
