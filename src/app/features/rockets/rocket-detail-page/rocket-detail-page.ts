import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { RocketsApiService } from '../data-access/rockets-api.service';
import { Rocket } from '../data-access/rockets.models';
import { presentRocketsError } from '../ui/rockets-error.presenter';

const MISSING_ROUTE_ID_MESSAGE = 'Rocket id is missing from the route. Return to the rockets list.';

@Component({
  selector: 'app-rocket-detail-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './rocket-detail-page.html',
  styleUrl: './rocket-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RocketDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly rocketsApi = inject(RocketsApiService);

  protected readonly rocket = signal<Rocket | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly pageError = signal<string | null>(null);
  protected readonly notFoundMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadRocket();
  }

  protected loadRocket(): void {
    const rocketId = this.route.snapshot.paramMap.get('id');

    if (!rocketId) {
      this.notFoundMessage.set(MISSING_ROUTE_ID_MESSAGE);
      this.isLoading.set(false);
      return;
    }

    this.pageError.set(null);
    this.notFoundMessage.set(null);
    this.isLoading.set(true);

    this.rocketsApi.getRocketById(rocketId).subscribe({
      next: (rocket) => {
        this.rocket.set(rocket);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        const presented = presentRocketsError(
          error,
          'We could not load this rocket right now. Please try again.',
        );

        if (presented.kind === 'not-found') {
          this.notFoundMessage.set(presented.message);
          this.rocket.set(null);
        } else {
          this.pageError.set(presented.message);
        }

        this.isLoading.set(false);
      },
    });
  }

  protected deleteRocket(): void {
    const currentRocket = this.rocket();

    if (!currentRocket) {
      return;
    }

    const shouldDelete = window.confirm(`Delete rocket "${currentRocket.name}"? This cannot be undone.`);

    if (!shouldDelete) {
      return;
    }

    this.pageError.set(null);

    this.rocketsApi.deleteRocket(currentRocket.id).subscribe({
      next: () => {
        void this.router.navigate(['/rockets']);
      },
      error: (error: unknown) => {
        const presented = presentRocketsError(
          error,
          'We could not delete this rocket right now. Please try again.',
        );

        if (presented.kind === 'not-found') {
          this.notFoundMessage.set(presented.message);
          this.rocket.set(null);
          return;
        }

        this.pageError.set(presented.message);
      },
    });
  }
}
