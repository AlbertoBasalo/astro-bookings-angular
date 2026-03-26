import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { CreateRocketRequest, Rocket, UpdateRocketRequest } from './rockets.models';

@Injectable({ providedIn: 'root' })
export class RocketsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getRockets(): Observable<Rocket[]> {
    return this.http.get<Rocket[]>(`${this.apiBaseUrl}/rockets`);
  }

  getRocketById(id: string): Observable<Rocket> {
    return this.http.get<Rocket>(`${this.apiBaseUrl}/rockets/${id}`);
  }

  createRocket(payload: CreateRocketRequest): Observable<Rocket> {
    return this.http
      .post<Rocket>(`${this.apiBaseUrl}/rockets`, payload, { observe: 'response' })
      .pipe(map((response) => this.requireBody(response)));
  }

  updateRocket(id: string, payload: UpdateRocketRequest): Observable<Rocket> {
    return this.http
      .put<Rocket>(`${this.apiBaseUrl}/rockets/${id}`, payload, { observe: 'response' })
      .pipe(map((response) => this.requireBody(response)));
  }

  deleteRocket(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/rockets/${id}`);
  }

  private requireBody(response: HttpResponse<Rocket>): Rocket {
    if (!response.body) {
      throw new Error('Missing response body from Rockets API.');
    }

    return response.body;
  }
}
