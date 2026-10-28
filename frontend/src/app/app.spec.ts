import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { IncidentSeverity } from './models/incident.model';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render Active Incident Roster header in tracker view', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Active Incident Roster');
  });

  it('should load mock incidents and responding units', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.incidents().length).toBeGreaterThan(0);
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
    const initialCount = app.filteredIncidents().length;
    
    // Search for #RN-8821
    app.searchQuery.set('8821');
    expect(app.filteredIncidents().length).toBe(1);
    expect(app.filteredIncidents()[0].id).toBe('#RN-8821');

    // Reset search
    app.searchQuery.set('');
    expect(app.filteredIncidents().length).toBe(initialCount);
  });
});
