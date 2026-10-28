import { Component, computed, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Incident,
  IncidentSeverity,
  IncidentStatus,
  RespondingUnit,
  UnitStatus,
  UnitType,
  DisasterCategory,
  SeverityLevel,
  EmergencyDispatchRequest,
  DashboardMetricSummary
} from './models/incident.model';
import {
  MOCK_INCIDENTS,
  MOCK_RESPONDING_UNITS,
  MOCK_DASHBOARD_STATS,
  DEFAULT_DISPATCH_FORM
} from './models/mock-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  // Enums for template usage
  public readonly IncidentSeverity = IncidentSeverity;
  public readonly IncidentStatus = IncidentStatus;
  public readonly UnitStatus = UnitStatus;
  public readonly UnitType = UnitType;
  public readonly DisasterCategory = DisasterCategory;

  // Navigation State: 'tracker' | 'dispatch' | 'overview' | 'units' | 'broadcasts'
  public readonly currentView = signal<'tracker' | 'dispatch' | 'overview' | 'units' | 'broadcasts'>('tracker');

  // Reactive State Store
  public readonly incidents = signal<Incident[]>(MOCK_INCIDENTS);
  public readonly availableUnits = signal<RespondingUnit[]>(MOCK_RESPONDING_UNITS);
  public readonly units = this.availableUnits;
  public readonly selectedIncident = signal<Incident>(MOCK_INCIDENTS[0]);
  public readonly dashboardStats = signal<DashboardMetricSummary>(MOCK_DASHBOARD_STATS);

  // Table Filters & Search
  public readonly activeFilterTab = signal<'ALL' | 'CRITICAL' | 'SERIOUS' | 'ROUTINE' | 'SUPPRESSION'>('ALL');
  public readonly searchQuery = signal<string>('');

  // Emergency Dispatch Form State
  public readonly dispatchForm = signal<EmergencyDispatchRequest>({ ...DEFAULT_DISPATCH_FORM });

  // Notifications / Alert Banner
  public readonly notificationMessage = signal<string | null>(null);
  public readonly notificationType = signal<'success' | 'alert' | 'warning'>('success');
  private notificationTimer: ReturnType<typeof setTimeout> | null = null;

  // Clocks
  public readonly utcClock = signal<string>('');
  public readonly pstClock = signal<string>('');
  private clockInterval: ReturnType<typeof setInterval> | null = null;

  // Filtered Incidents Computed
  public readonly filteredIncidents = computed(() => {
    const list = this.incidents();
    const filter = this.activeFilterTab();
    const query = this.searchQuery().trim().toLowerCase();

    return list.filter((item) => {
      // Category / severity tab filter
      if (filter === 'CRITICAL' && item.severity !== IncidentSeverity.CRITICAL) return false;
      if (filter === 'SERIOUS' && item.severity !== IncidentSeverity.HIGH) return false;
      if (filter === 'ROUTINE' && item.severity !== IncidentSeverity.LOW && item.severity !== IncidentSeverity.MEDIUM) return false;
      if (filter === 'SUPPRESSION' && !item.stage.toLowerCase().includes('suppression')) return false;

      // Search query filter
      if (query) {
        const matchesId = item.id.toLowerCase().includes(query);
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesLocation = item.location.address.toLowerCase().includes(query) ||
                                (item.location.sector?.toLowerCase().includes(query) ?? false);
        const matchesCategory = item.category.toString().toLowerCase().includes(query);
        if (!matchesId && !matchesTitle && !matchesLocation && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  });

  ngOnInit(): void {
    this.updateClocks();
    this.clockInterval = setInterval(() => this.updateClocks(), 1000);
  }

  ngOnDestroy(): void {
    if (this.clockInterval) clearInterval(this.clockInterval);
    if (this.notificationTimer) clearTimeout(this.notificationTimer);
  }

  private updateClocks(): void {
    const now = new Date();
    const h = String(now.getUTCHours()).padStart(2, '0');
    const m = String(now.getUTCMinutes()).padStart(2, '0');
    const s = String(now.getUTCSeconds()).padStart(2, '0');
    this.utcClock.set(`UTC ${h}:${m}:${s}`);

    const pstDate = new Date(now.getTime() - 8 * 3600 * 1000);
    const ph = String(pstDate.getUTCHours()).padStart(2, '0');
    const pm = String(pstDate.getUTCMinutes()).padStart(2, '0');
    const ps = String(pstDate.getUTCSeconds()).padStart(2, '0');
    this.pstClock.set(`SECTOR ${ph}:${pm}:${ps} PST`);
  }

  // Navigation handlers
  public setView(view: 'tracker' | 'dispatch' | 'overview' | 'units' | 'broadcasts'): void {
    this.currentView.set(view);
  }

  public setFilterTab(tab: 'ALL' | 'CRITICAL' | 'SERIOUS' | 'ROUTINE' | 'SUPPRESSION'): void {
    this.activeFilterTab.set(tab);
  }

  public onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  public selectIncident(incident: Incident): void {
    this.selectedIncident.set(incident);
  }

  // Tactical Command actions
  public triggerMutualAid(): void {
    this.showToast('MUTUAL AID PROTOCOL ACTIVATED: 3 HEAVY WATER TENDERS REQUESTED', 'warning');
  }

  public triggerSoundSiren(): void {
    this.showToast('WARNING SIRENS ACTIVE IN SECTORS 4A, 4B, 4C — ACOUSTIC CONFIRMATION RECEIVED', 'alert');
  }

  public triggerEscalate(): void {
    this.showToast('CODE BLACK DECLARED FOR SECTOR 4 — REGIONAL CRISIS PROTOCOL ENGAGED', 'alert');
  }

  public triggerEasBroadcast(): void {
    this.showToast('EMERGENCY ALERT SYSTEM (EAS) CELLULAR PUSH SENT TO 14,200 RECIPIENTS', 'warning');
  }

  // Form Interactions
  public setFormSeverity(level: SeverityLevel): void {
    this.dispatchForm.update(f => ({ ...f, severity: level }));
  }

  public updateCasualties(delta: number): void {
    this.dispatchForm.update(f => ({
      ...f,
      confirmedCasualties: Math.max(0, f.confirmedCasualties + delta)
    }));
  }

  public toggleHazard(hazard: 'flammables' | 'powerlinesDown' | 'blockedRoads' | 'structuralCollapse'): void {
    this.dispatchForm.update(f => ({
      ...f,
      hazards: {
        ...f.hazards,
        [hazard]: !f.hazards[hazard]
      }
    }));
  }

  public toggleUnitSelection(unitId: string): void {
    this.dispatchForm.update(f => {
      const units = [...f.selectedUnits];
      const idx = units.indexOf(unitId);
      if (idx > -1) {
        units.splice(idx, 1);
      } else {
        units.push(unitId);
      }
      return { ...f, selectedUnits: units };
    });
  }

  public submitDispatch(): void {
    const form = this.dispatchForm();
    const newId = `#RN-${Math.floor(8822 + Math.random() * 80)}`;
    const severityEnum = form.severity === 'red' ? IncidentSeverity.CRITICAL :
                         form.severity === 'amber' ? IncidentSeverity.HIGH : IncidentSeverity.LOW;
    const priorityCode = form.severity === 'red' ? 'Red (P1)' :
                         form.severity === 'amber' ? 'Amber (P3)' : 'Blue (P4)';

    const newIncident: Incident = {
      id: newId,
      title: form.calloutHeadline || 'Emergency Callout',
      description: form.fieldDescription,
      category: form.category.toUpperCase(),
      subCategory: form.subCategory,
      severity: severityEnum,
      severityLevel: form.severity,
      priorityCode: priorityCode,
      status: IncidentStatus.ACTIVE,
      stage: 'Dispatching',
      stageProgress: {
        currentStep: 3,
        totalSteps: 5,
        stages: [
          { step: 1, label: '1. Call Logged & Verified', time: 'Just Now', state: 'completed' },
          { step: 2, label: '2. Triage & Alarm Raised', time: 'Just Now', state: 'completed' },
          { step: 3, label: '3. Units Dispatched', time: 'Active', state: 'active' },
          { step: 4, label: '4. Rapid Response Suppression', time: 'Pending', state: 'pending' },
          { step: 5, label: '5. Scene Stabilized', time: 'Pending', state: 'pending' }
        ]
      },
      location: {
        latitude: 47.6026,
        longitude: -122.3375,
        lat: 47.6026,
        lng: -122.3375,
        address: form.targetAddress,
        sector: form.targetSector,
        city: 'Seattle, WA',
        gnssLock: true,
        formattedCoordinates: form.targetCoordinates
      },
      latitude: 47.6026,
      longitude: -122.3375,
      lat: 47.6026,
      lng: -122.3375,
      elapsed: '00m 08s',
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unitsCount: form.selectedUnits.length || 2,
      unitsSummary: `${form.selectedUnits.length || 2} Dispatched`,
      assignedUnits: this.availableUnits().filter(u => form.selectedUnits.includes(u.id)),
      assignedUnitIds: form.selectedUnits,
      casualtyCount: form.confirmedCasualties,
      casualtyDetails: {
        totalCasualties: form.confirmedCasualties,
        injured: Math.max(0, form.confirmedCasualties - 2),
        critical: Math.min(2, form.confirmedCasualties),
        missing: 0,
        trapped: Math.floor(form.confirmedCasualties / 2)
      },
      hazards: ['CHEMICAL_HAZARD', 'FIRE_HAZARD'],
      hazardFlags: {
        fire: form.hazards.flammables,
        chemical: true,
        flood: false,
        structuralInstability: form.hazards.structuralCollapse,
        gasLeak: true,
        electrical: form.hazards.powerlinesDown,
        biohazard: false,
        explosionRisk: form.hazards.flammables,
        flammables: form.hazards.flammables,
        powerlinesDown: form.hazards.powerlinesDown,
        blockedRoads: form.hazards.blockedRoads,
        structuralCollapse: form.hazards.structuralCollapse
      },
      hazardBooleans: [form.hazards.flammables, true, false, form.hazards.structuralCollapse, true, form.hazards.powerlinesDown, false, true],
      reporterName: 'Command Dispatch Console',
      priorityScore: form.severity === 'red' ? 95 : 75,
      evacuationRadiusMeters: 500
    };

    // Prepend to incidents roster
    this.incidents.update(list => [newIncident, ...list]);
    this.selectedIncident.set(newIncident);
    this.dashboardStats.update(s => ({
      ...s,
      totalActiveIncidents: s.totalActiveIncidents + 1,
      criticalSeverityCount: form.severity === 'red' ? s.criticalSeverityCount + 1 : s.criticalSeverityCount
    }));

    this.showToast(`DISPATCH TRANSMITTED: ${newId} RECORDED. UNITS EN ROUTE!`, 'success');

    // Switch view to tracker to inspect the newly dispatched incident
    setTimeout(() => {
      this.currentView.set('tracker');
    }, 1200);
  }

  public showToast(msg: string, type: 'success' | 'alert' | 'warning' = 'success'): void {
    if (this.notificationTimer) clearTimeout(this.notificationTimer);
    this.notificationMessage.set(msg);
    this.notificationType.set(type);
    this.notificationTimer = setTimeout(() => {
      this.notificationMessage.set(null);
    }, 4500);
  }
}
