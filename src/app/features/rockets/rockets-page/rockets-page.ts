import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RocketsApiService } from '../data-access/rockets-api.service';
import { Rocket } from '../data-access/rockets.models';
import { presentRocketsError } from '../ui/rockets-error.presenter';

const DELETE_CONFIRMATION_TEMPLATE = 'Delete rocket "{name}"? This cannot be undone.';

@Component({
  selector: 'app-rockets-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './rockets-page.html',
  styleUrl: './rockets-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RocketsPage implements OnInit {
  private readonly rocketsApi = inject(RocketsApiService);

  protected readonly rockets = signal<Rocket[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly pageError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadRockets();
  }

  protected loadRockets(): void {
    this.pageError.set(null);
    this.isLoading.set(true);

    this.rocketsApi.getRockets().subscribe({
      next: (rockets) => {
        this.rockets.set(rockets);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        const presented = presentRocketsError(
          error,
          'We could not load rockets right now. Please refresh and try again.',
        );
        this.pageError.set(presented.message);
        this.isLoading.set(false);
      },
    });
  }

  protected deleteRocket(rocket: Rocket): void {
    const shouldDelete = window.confirm(
      DELETE_CONFIRMATION_TEMPLATE.replace('{name}', rocket.name),
    );

    if (!shouldDelete) {
      return;
    }

    this.pageError.set(null);

    this.rocketsApi.deleteRocket(rocket.id).subscribe({
      next: () => {
        this.rockets.update((items) => items.filter((item) => item.id !== rocket.id));
      },
      error: (error: unknown) => {
        const presented = presentRocketsError(
          error,
          'We could not delete this rocket right now. Please try again.',
        );

        if (presented.kind === 'not-found') {
          this.pageError.set(presented.message);
          this.loadRockets();
          return;
        }

        this.pageError.set(presented.message);
      },
    });
  }
}
