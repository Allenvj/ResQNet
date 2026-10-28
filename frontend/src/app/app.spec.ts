import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { IncidentService } from './services/incident.service';
import { IncidentSeverity, IncidentStatus } from './models/incident.model';

describe('App', () => {
  const mockApiIncidents: any[] = [
    {
      id: '#RN-8821',
      title: 'Sector 4 Industrial Chemical Fire',
      description: 'Storage Tank #04 ruptured after seismic jolt.',
      location: 'Pier 42 Chemical Warehouse, Docklands',
      severity: IncidentSeverity.CRITICAL,
      status: IncidentStatus.ACTIVE
    },
    {
      id: '#RN-8819',
      title: 'Interstate 90 Multi-Collision',
      description: 'Chain-reaction collision involving 14 passenger vehicles.',
      location: 'Mile Marker 142 Eastbound Corridor',
      severity: IncidentSeverity.CRITICAL,
      status: IncidentStatus.ACTIVE
    }
  ];

  let mockIncidentService: { getAllIncidents: () => any; reportIncident: (inc: any) => any };

  beforeEach(async () => {
    mockIncidentService = {
      getAllIncidents: () => of(mockApiIncidents),
      reportIncident: (inc: any) => of(inc)
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: IncidentService, useValue: mockIncidentService }
      ]
    }).compileComponents();
  });

  it('should create the app and fetch incidents via IncidentService in ngOnInit', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    expect(app).toBeTruthy();
    expect(app.incidents().length).toBe(2);
    expect(app.incidents()[0].id).toBe('#RN-8821');
  });

  it('should render Active Incident Roster header in tracker view', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Active Incident Roster');
  });

  it('should have responding units available', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.units().length).toBeGreaterThan(0);
  });

  it('should switch between tracker and dispatch view', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.setView('dispatch');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('SUBMIT EMERGENCY DISPATCH REQUEST');
  });

  it('should filter incidents by search query', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    const initialCount = app.filteredIncidents().length;
    
    // Search for 8821
    app.searchQuery.set('8821');
    expect(app.filteredIncidents().length).toBe(1);
    expect(app.filteredIncidents()[0].id).toBe('#RN-8821');

    // Reset search
    app.searchQuery.set('');
    expect(app.filteredIncidents().length).toBe(initialCount);
  });
});
