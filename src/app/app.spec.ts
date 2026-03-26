import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { App } from './app';
import { navigationItems } from './app.navigation';
import { routes } from './app.routes';
import { API_BASE_URL } from './core/config/api.config';

const expectedNavigationLabels = navigationItems.map(({ label }) => label);

const expectedRouteContent = navigationItems.map(({ path, label }) => ({
  path,
  heading: label,
}));

describe('App', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://localhost:3000' },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders navigation links for all top-level feature routes', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const navText = Array.from(compiled.querySelectorAll('.nav-link')).map((link) =>
      link.textContent?.trim(),
    );

    expect(navText).toEqual(expectedNavigationLabels);
  });

  for (const routeCase of expectedRouteContent) {
    it(`renders placeholder content for ${routeCase.path}`, async () => {
      const harness = await RouterTestingHarness.create();
      const component = await harness.navigateByUrl(routeCase.path);

      if (routeCase.path === '/rockets') {
        const req = httpMock.expectOne('http://localhost:3000/rockets');
        req.flush([]);
      }

      expect(component).toBeTruthy();
      expect(harness.routeNativeElement?.textContent).toContain(routeCase.heading);
    });
  }

  it('redirects unknown routes to home', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/unknown-path');
    expect(harness.routeNativeElement?.textContent).toContain('Welcome to AstroBookings');
  });
});
