import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
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

  protected rocket: Rocket | null = null;
  protected isLoading = true;
  protected pageError: string | null = null;
  protected notFoundMessage: string | null = null;

  ngOnInit(): void {
    this.loadRocket();
  }

  protected loadRocket(): void {
    const rocketId = this.route.snapshot.paramMap.get('id');

    if (!rocketId) {
      this.notFoundMessage = MISSING_ROUTE_ID_MESSAGE;
      this.isLoading = false;
      return;
    }

    this.pageError = null;
    this.notFoundMessage = null;
    this.isLoading = true;

    this.rocketsApi.getRocketById(rocketId).subscribe({
      next: (rocket) => {
        this.rocket = rocket;
        this.isLoading = false;
      },
      error: (error: unknown) => {
        const presented = presentRocketsError(
          error,
          'We could not load this rocket right now. Please try again.',
        );

        if (presented.kind === 'not-found') {
          this.notFoundMessage = presented.message;
          this.rocket = null;
        } else {
          this.pageError = presented.message;
        }

        this.isLoading = false;
      },
    });
  }

  protected deleteRocket(): void {
    if (!this.rocket) {
      return;
    }

    const shouldDelete = window.confirm(`Delete rocket "${this.rocket.name}"? This cannot be undone.`);

    if (!shouldDelete) {
      return;
    }

    this.pageError = null;

    this.rocketsApi.deleteRocket(this.rocket.id).subscribe({
      next: () => {
        void this.router.navigate(['/rockets']);
      },
      error: (error: unknown) => {
        const presented = presentRocketsError(
          error,
          'We could not delete this rocket right now. Please try again.',
        );

        if (presented.kind === 'not-found') {
          this.notFoundMessage = presented.message;
          this.rocket = null;
          return;
        }

        this.pageError = presented.message;
      },
    });
  }
}
