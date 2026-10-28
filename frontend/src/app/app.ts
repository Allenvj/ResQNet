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
  DashboardMetricSummary,
  GeoLocation,
  IncidentStageItem
} from './models/incident.model';
import { IncidentService } from './services/incident.service';

const DEFAULT_DISPATCH_FORM: EmergencyDispatchRequest = {
  severity: 'red',
  category: 'hazmat',
  subCategory: 'chem-tox',
  calloutHeadline: 'INDUSTRIAL CHEMICAL LEAK WITH FLASH COMBUSTION RISK',
  fieldDescription: 'Storage Tank #04 ruptured after seismic jolt. Yellowish smoke cloud drifting northeast across Highway 99 corridor. Workers reporting respiratory irritation. Wind velocity ~14kt.',
  confirmedCasualties: 8,
  hazards: {
    flammables: true,
    powerlinesDown: true,
    blockedRoads: false,
    structuralCollapse: true
  },
  silentMode: false,
  targetAddress: '2840 Marginal Way S, Seattle, WA',
  targetSector: 'Sector 4 — Harbor Logistics District',
  targetCoordinates: '47°36\'09.4"N 122°20\'14.6"W',
  selectedUnits: ['UNIT-ENG-18', 'UNIT-MED-05', 'UNIT-HAZ-01', 'UNIT-DRN-ALPHA']
};

const INITIAL_RESPONDING_UNITS: RespondingUnit[] = [
  {
    id: 'UNIT-ENG-12-14',
    callsign: 'ENG-12/14',
    name: 'Engine 12 & Engine 14',
    type: UnitType.FIRE_ENGINE,
    status: UnitStatus.ENGAGED,
    crewCount: 8,
    leadOfficer: 'Capt. Ramirez',
    contactChannel: 'TAC-FIRE-04',
    currentLocation: {
      latitude: 47.6025,
      longitude: -122.3375,
      address: 'Pier 42 Hydrant Perimeter',
      sector: 'Sector 4',
      gnssLock: true
    },
    roleBadge: 'Deluge Deliv',
    icon: 'fire_truck',
    isEngaged: true,
    equipmentSpecialties: ['Class B Foam', 'Deluge Master Stream', 'Positive Pressure Ventilation']
  },
  {
    id: 'UNIT-MED-04',
    callsign: 'MEDIC-04',
    name: 'Rescue Medic 04',
    type: UnitType.PARAMEDIC,
    status: UnitStatus.ENGAGED,
    crewCount: 4,
    leadOfficer: 'Lt. Chen',
    contactChannel: 'TAC-MED-02',
    currentLocation: {
      latitude: 47.6022,
      longitude: -122.3368,
      address: 'Pier 42 Gate B Triage Tent',
      sector: 'Sector 4',
      gnssLock: true
    },
    roleBadge: 'Triage Lead',
    icon: 'medical_services',
    isEngaged: true,
    equipmentSpecialties: ['Advanced Cardiac Life Support', 'Cyanide Antidote Kit', 'Mass Casualty Decon']
  },
  {
    id: 'UNIT-HAZ-02',
    callsign: 'HAZMAT-02',
    name: 'HazMat Team 02',
    type: UnitType.HAZMAT_TEAM,
    status: UnitStatus.ENGAGED,
    crewCount: 6,
    leadOfficer: 'Sgt. Miller',
    contactChannel: 'TAC-HAZ-01',
    currentLocation: {
      latitude: 47.6028,
      longitude: -122.3382,
      address: 'Terminal 5 Plume Perimeter',
      sector: 'Sector 4',
      gnssLock: true
    },
    roleBadge: 'Vapor Plume',
    icon: 'science',
    isEngaged: true,
    equipmentSpecialties: ['Level A Gas-Tight Ensembles', 'Multi-Gas Photoionization Detectors', 'Plume Modeling Lidar']
  },
  {
    id: 'UNIT-DRN-BETA',
    callsign: 'DRONE-BETA',
    name: 'Recon Drone Beta',
    type: UnitType.DRONE_RECON,
    status: UnitStatus.ENGAGED,
    crewCount: 2,
    leadOfficer: 'Spec. Adams',
    contactChannel: 'TAC-UAV-LINK',
    currentLocation: {
      latitude: 47.6030,
      longitude: -122.3370,
      address: 'Alt 280ft AGL over Tank 04',
      sector: 'Sector 4',
      gnssLock: true
    },
    roleBadge: 'Thermal Air',
    icon: 'flight',
    isEngaged: true,
    equipmentSpecialties: ['FLIR Boson 640 Thermal', 'Optical Gas Imaging Sensor', 'Mesh Repeater Node']
  },
  {
    id: 'UNIT-ENG-18',
    callsign: 'ENG-18',
    name: 'Engine 18 & Water Tender',
    type: UnitType.FIRE_ENGINE,
    status: UnitStatus.AVAILABLE,
    crewCount: 5,
    leadOfficer: 'Capt. Vance',
    contactChannel: 'TAC-FIRE-01',
    currentLocation: {
      latitude: 47.5980,
      longitude: -122.3320,
      address: 'Station 4 Headquarters',
      sector: 'Sector 4',
      gnssLock: true
    },
    roleBadge: 'Station Staged',
    icon: 'fire_truck',
    isEngaged: false,
    equipmentSpecialties: ['3,000 Gallon Tender', 'Deck Gun', 'Supply Lines']
  },
  {
    id: 'UNIT-MED-05',
    callsign: 'MEDIC-05',
    name: 'Rescue Medic 05',
    type: UnitType.PARAMEDIC,
    status: UnitStatus.AVAILABLE,
    crewCount: 3,
    leadOfficer: 'Lt. Sorenson',
    contactChannel: 'TAC-MED-01',
    currentLocation: {
      latitude: 47.5940,
      longitude: -122.3290,
      address: 'Harborview Regional Base',
      sector: 'Sector 4',
      gnssLock: true
    },
    roleBadge: 'Mobile Trauma Unit',
    icon: 'medical_services',
    isEngaged: false,
    equipmentSpecialties: ['Trauma Bay Extension', 'Mobile Ventilators']
  },
  {
    id: 'UNIT-HAZ-01',
    callsign: 'HAZMAT-01',
    name: 'HazMat Team 01',
    type: UnitType.HAZMAT_TEAM,
    status: UnitStatus.AVAILABLE,
    crewCount: 6,
    leadOfficer: 'Cmdr. Gutierrez',
    contactChannel: 'TAC-HAZ-02',
    currentLocation: {
      latitude: 47.6080,
      longitude: -122.3400,
      address: 'District Logistics Depot',
      sector: 'Sector 4',
      gnssLock: true
    },
    roleBadge: 'CBRN Detection & Containment',
    icon: 'science',
    isEngaged: false,
    equipmentSpecialties: ['Chemical Neutralizers', 'Spill Skimmers']
  },
  {
    id: 'UNIT-DRN-ALPHA',
    callsign: 'DRONE-ALPHA',
    name: 'Drone Recon Alpha',
    type: UnitType.DRONE_RECON,
    status: UnitStatus.AVAILABLE,
    crewCount: 2,
    leadOfficer: 'Tech Officer Diaz',
    contactChannel: 'TAC-UAV-LINK',
    currentLocation: {
      latitude: 47.6010,
      longitude: -122.3350,
      address: 'Command Vehicle Helipad',
      sector: 'Sector 4',
      gnssLock: true
    },
    roleBadge: 'Autonomous Aerial Telemetry',
    icon: 'flight',
    isEngaged: false,
    equipmentSpecialties: ['4K Zoom Electro-Optical', 'Radiological Sniffer']
  }
];

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

  // Reactive State Store - initialized empty, populated from IncidentService
  public readonly incidents = signal<Incident[]>([]);
  public readonly availableUnits = signal<RespondingUnit[]>(INITIAL_RESPONDING_UNITS);
  public readonly units = this.availableUnits;
  public readonly selectedIncident = signal<Incident | null>(null);

  // Dynamic dashboard telemetry stats computed directly from incidents state
  public readonly dashboardStats = computed<DashboardMetricSummary>(() => {
    const list = this.incidents();
    const criticalCount = list.filter(i => i.severity === IncidentSeverity.CRITICAL).length;
    const totalCasualties = list.reduce((acc, curr) => acc + (curr.casualtyCount || 0), 0);

    return {
      totalActiveIncidents: list.length,
      activeIncidentsDelta: list.length > 0 ? '+2 this hr' : '0 this hr',
      criticalSeverityCount: criticalCount,
      criticalDefconLevel: criticalCount > 2 ? 'DEFCON 2' : 'DEFCON 3',
      unitsDeployedCount: 28,
      unitsDeployedPercent: '88% Field Load',
      evacuationZonesCount: 2,
      evacuationZonesSector: 'Sector 4 Perimeter',
      avgResponseTime: '04m 18s',
      avgResponseDelta: '-12s Delta',
      totalCasualtiesReported: totalCasualties,
      activeTrappedCount: 6,
      unitsAvailableCount: this.availableUnits().length,
      systemOperationalStatus: 'DEFCON 3',
      latencyMs: 18,
      lastUpdated: new Date().toISOString()
    };
  });

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

  constructor(private incidentService: IncidentService) {}

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
        const matchesLocation = item.location?.address?.toLowerCase().includes(query) ||
                                (item.location?.sector?.toLowerCase().includes(query) ?? false);
        const matchesCategory = item.category?.toString().toLowerCase().includes(query);
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

    // Fetch live incidents from backend service
    this.incidentService.getAllIncidents().subscribe({
      next: (data) => {
        const mapped = (data || []).map(item => this.normalizeIncident(item));
        this.incidents.set(mapped);
        if (mapped.length > 0 && !this.selectedIncident()) {
          this.selectedIncident.set(mapped[0]);
        }
      },
      error: (err) => {
        console.error('Failed to load incidents from backend API:', err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.clockInterval) clearInterval(this.clockInterval);
    if (this.notificationTimer) clearTimeout(this.notificationTimer);
  }

  private normalizeIncident(raw: any): Incident {
    const severityStr = String(raw.severity || 'CRITICAL').toUpperCase();
    const severityEnum =
      severityStr === 'CRITICAL' ? IncidentSeverity.CRITICAL :
      severityStr === 'HIGH' ? IncidentSeverity.HIGH :
      severityStr === 'MEDIUM' ? IncidentSeverity.MEDIUM :
      IncidentSeverity.LOW;

    const severityLevel: SeverityLevel =
      severityEnum === IncidentSeverity.CRITICAL ? 'red' :
      severityEnum === IncidentSeverity.HIGH ? 'amber' : 'blue';

    const priorityCode = raw.priorityCode || (
      severityLevel === 'red' ? 'Red (P1)' :
      severityLevel === 'amber' ? 'Amber (P3)' : 'Blue (P4)'
    );

    const locObj: GeoLocation = typeof raw.location === 'string'
      ? {
          address: raw.location,
          latitude: raw.latitude || 47.6026,
          longitude: raw.longitude || -122.3375,
          lat: raw.latitude || 47.6026,
          lng: raw.longitude || -122.3375,
          sector: raw.sector || 'Sector 4',
          city: 'Seattle, WA',
          gnssLock: true,
          formattedCoordinates: '47°36\'09.4"N 122°20\'14.6"W'
        }
      : (raw.location || {
          address: 'Sector 4 Grid',
          latitude: 47.6026,
          longitude: -122.3375,
          lat: 47.6026,
          lng: -122.3375,
          sector: 'Sector 4',
          city: 'Seattle, WA',
          gnssLock: true
        });

    const stagesList: IncidentStageItem[] = raw.stageProgress?.stages || [
      { step: 1, label: '1. Call Logged & Verified', time: '19:24', state: 'completed' },
      { step: 2, label: '2. Triage & Alarm 2 Raised', time: '19:27', state: 'completed' },
      { step: 3, label: '3. Units Dispatched', time: '19:29', state: 'completed' },
      { step: 4, label: '4. On Scene / Direct Suppression', time: 'Active', state: 'active' },
      { step: 5, label: '5. Containment & Debrief', time: 'Pending', state: 'pending' }
    ];

    const assignedUnits: RespondingUnit[] = raw.assignedUnits && raw.assignedUnits.length > 0
      ? raw.assignedUnits
      : this.availableUnits().slice(0, 2);

    return {
      id: typeof raw.id === 'string' && raw.id.startsWith('#')
        ? raw.id
        : raw.id ? `#RN-${String(raw.id).substring(0, 4).toUpperCase()}` : '#RN-8800',
      title: raw.title || 'Emergency Callout',
      description: raw.description || '',
      category: raw.category || DisasterCategory.HAZMAT,
      subCategory: raw.subCategory || 'Operational Incident',
      severity: severityEnum,
      severityLevel: raw.severityLevel || severityLevel,
      priorityCode: priorityCode,
      status: raw.status || IncidentStatus.ACTIVE,
      stage: raw.stage || (raw.status === 'IN_PROGRESS' ? 'Suppression' : 'Active'),
      stageProgress: raw.stageProgress || {
        currentStep: 4,
        totalSteps: 5,
        stages: stagesList
      },
      location: locObj,
      latitude: locObj.latitude,
      longitude: locObj.longitude,
      lat: locObj.lat || locObj.latitude,
      lng: locObj.lng || locObj.longitude,
      elapsed: raw.elapsed || '18m 42s',
      reportedAt: raw.createdAt || raw.reportedAt || new Date().toISOString(),
      updatedAt: raw.updatedAt || new Date().toISOString(),
      unitsCount: raw.unitsCount || assignedUnits.length,
      unitsSummary: raw.unitsSummary || `${assignedUnits.length} Engaged`,
      assignedUnits: assignedUnits,
      assignedUnitIds: raw.assignedUnitIds || assignedUnits.map(u => u.id),
      casualtyCount: raw.casualtyCount || 0,
      casualtyDetails: raw.casualtyDetails || {
        totalCasualties: 0,
        injured: 0,
        critical: 0,
        missing: 0,
        trapped: 0
      },
      hazards: raw.hazards || ['CHEMICAL_HAZARD', 'FIRE_HAZARD'],
      hazardFlags: raw.hazardFlags || {
        fire: true,
        chemical: true,
        flood: false,
        structuralInstability: false,
        gasLeak: false,
        electrical: false,
        biohazard: false,
        explosionRisk: true,
        flammables: true,
        powerlinesDown: false,
        blockedRoads: false,
        structuralCollapse: false
      },
      hazardBooleans: raw.hazardBooleans || [true, true, false, false, false, false, false, true],
      reporterName: raw.reporterName || 'Command Dispatch Console',
      reporterContact: raw.reporterContact || '',
      priorityScore: raw.priorityScore || 80
    };
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
