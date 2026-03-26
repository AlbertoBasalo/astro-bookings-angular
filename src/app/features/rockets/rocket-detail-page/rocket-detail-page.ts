import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';

import { RocketsApiService } from '../data-access/rockets-api.service';
import { Rocket } from '../data-access/rockets.models';
import { presentRocketsError } from '../ui/rockets-error.presenter';

const MISSING_ROUTE_ID_MESSAGE = 'Rocket id is missing from the route. Return to the rockets list.';
const LOAD_ROCKET_ERROR_MESSAGE = 'We could not load this rocket right now. Please try again.';
const DELETE_ROCKET_ERROR_MESSAGE = 'We could not delete this rocket right now. Please try again.';

interface DeleteUiState {
  pageError: string | null;
  notFoundMessage: string | null;
  hideRocket: boolean;
}

@Component({
  selector: 'app-rocket-detail-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './rocket-detail-page.html',
  styleUrl: './rocket-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RocketDetailPage {
  private readonly router = inject(Router);
  private readonly rocketsApi = inject(RocketsApiService);

  protected readonly rocketId = input<string | null>(null, { alias: 'id' });
  private readonly deleteUiState = linkedSignal<string | null, DeleteUiState>({
    source: this.rocketId,
    computation: () => ({
      pageError: null,
      notFoundMessage: null,
      hideRocket: false,
    }),
  });

  private readonly rocketResource = rxResource<Rocket | null, { id: string | null }>({
    params: () => ({ id: this.rocketId() }),
    stream: ({ params }) => {
      if (!params.id) {
        return of(null);
      }

      return this.rocketsApi.getRocketById(params.id);
    },
  });

  private readonly loadPresentedError = computed(() => {
    if (!this.rocketId()) {
      return null;
    }

    const error = this.rocketResource.error();
    if (!error) {
      return null;
    }

    return presentRocketsError(error, LOAD_ROCKET_ERROR_MESSAGE);
  });

  protected readonly isLoading = computed(() => {
    if (!this.rocketId()) {
      return false;
    }

    return this.rocketResource.isLoading();
  });

  protected readonly rocket = computed<Rocket | null>(() => {
    if (!this.rocketId() || this.deleteUiState().hideRocket) {
      return null;
    }

    if (!this.rocketResource.hasValue()) {
      return null;
    }

    return this.rocketResource.value() ?? null;
  });

  protected readonly notFoundMessage = computed(() => {
    if (!this.rocketId()) {
      return MISSING_ROUTE_ID_MESSAGE;
    }

    const loadError = this.loadPresentedError();
    if (loadError?.kind === 'not-found') {
      return loadError.message;
    }

    return this.deleteUiState().notFoundMessage;
  });

  protected readonly pageError = computed(() => {
    const loadError = this.loadPresentedError();
    if (loadError && loadError.kind !== 'not-found') {
      return loadError.message;
    }

    return this.deleteUiState().pageError;
  });

  protected async deleteRocket(): Promise<void> {
    const currentRocket = this.rocket();

    if (!currentRocket) {
      return;
    }

    const shouldDelete = window.confirm(`Delete rocket "${currentRocket.name}"? This cannot be undone.`);

    if (!shouldDelete) {
      return;
    }

    this.deleteUiState.update((state) => ({
      ...state,
      pageError: null,
      notFoundMessage: null,
    }));

    try {
      await firstValueFrom(this.rocketsApi.deleteRocket(currentRocket.id));
      await this.router.navigate(['/rockets']);
    } catch (error: unknown) {
      const presented = presentRocketsError(error, DELETE_ROCKET_ERROR_MESSAGE);

      if (presented.kind === 'not-found') {
        this.deleteUiState.update((state) => ({
          ...state,
          notFoundMessage: presented.message,
          hideRocket: true,
        }));
        return;
      }

      this.deleteUiState.update((state) => ({
        ...state,
        pageError: presented.message,
      }));
    }
  }
}
