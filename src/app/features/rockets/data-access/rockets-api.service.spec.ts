import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../../../core/config/api.config';
import { RocketsApiService } from './rockets-api.service';

describe('RocketsApiService', () => {
  let service: RocketsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://localhost:3000' },
      ],
    });

    service = TestBed.inject(RocketsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads rockets with GET /rockets', () => {
    const expected = [{ id: 'r1', name: 'Falcon', range: 'orbital', capacity: 4 }] as const;

    service.getRockets().subscribe((rockets) => {
      expect(rockets).toEqual(expected);
    });

    const req = httpMock.expectOne('http://localhost:3000/rockets');
    expect(req.request.method).toBe('GET');
    req.flush(expected);
  });

  it('loads one rocket with GET /rockets/:id', () => {
    const expected = { id: 'r1', name: 'Falcon', range: 'orbital', capacity: 4 } as const;

    service.getRocketById('r1').subscribe((rocket) => {
      expect(rocket).toEqual(expected);
    });

    const req = httpMock.expectOne('http://localhost:3000/rockets/r1');
    expect(req.request.method).toBe('GET');
    req.flush(expected);
  });

  it('creates rocket with POST /rockets and handles 201', () => {
    const payload = { name: 'Nova', range: 'moon', capacity: 3 } as const;
    const persisted = { id: 'r2', ...payload };

    service.createRocket(payload).subscribe((rocket) => {
      expect(rocket).toEqual(persisted);
    });

    const req = httpMock.expectOne('http://localhost:3000/rockets');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(persisted, { status: 201, statusText: 'Created' });
  });

  it('updates rocket with PUT /rockets/:id and handles 200', () => {
    const payload = { capacity: 8 };
    const updated = { id: 'r1', name: 'Falcon', range: 'orbital', capacity: 8 } as const;

    service.updateRocket('r1', payload).subscribe((rocket) => {
      expect(rocket).toEqual(updated);
    });

    const req = httpMock.expectOne('http://localhost:3000/rockets/r1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(updated, { status: 200, statusText: 'OK' });
  });

  it('deletes rocket with DELETE /rockets/:id and handles 204', () => {
    service.deleteRocket('r1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:3000/rockets/r1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
