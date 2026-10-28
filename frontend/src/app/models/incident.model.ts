/**
 * ResQNet Disaster Response & Tactical Incident Command Framework
 * Exact TypeScript interfaces aligned with Stitch MCP design system & wireframe schema.
 */

export enum IncidentSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export type SeverityLevel = 'red' | 'amber' | 'blue';

export enum IncidentStatus {
  REPORTED = 'REPORTED',
  IN_PROGRESS = 'IN_PROGRESS',
  ACTIVE = 'ACTIVE',
  CONTAINED = 'CONTAINED',
  STANDBY = 'STANDBY',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED'
}

export enum DisasterCategory {
  HAZMAT = 'HAZMAT',
  FIRE = 'FIRE',
  FLOOD = 'FLOOD',
  MEDICAL = 'MEDICAL',
  GRID = 'GRID',
  STRUCTURAL_COLLAPSE = 'STRUCTURAL_COLLAPSE',
  EARTHQUAKE = 'EARTHQUAKE',
  LANDSLIDE = 'LANDSLIDE',
  STORM_SURGE = 'STORM_SURGE',
  GAS_EXPLOSION = 'GAS_EXPLOSION'
}

export type HazardType =
  | 'FIRE_HAZARD'
  | 'CHEMICAL_HAZARD'
  | 'FLOODING'
  | 'ELECTRICAL_HAZARD'
  | 'STRUCTURAL_INSTABILITY'
  | 'GAS_LEAK'
  | 'BIOHAZARD'
  | 'EXPLOSION_RISK'
  | 'FLAMMABLES'
  | 'POWERLINES_DOWN'
  | 'BLOCKED_ROADS'
  | 'STRUCTURAL_COLLAPSE';

export interface HazardFlags {
  fire: boolean;
  chemical: boolean;
  flood: boolean;
  structuralInstability: boolean;
  gasLeak: boolean;
  electrical: boolean;
  biohazard: boolean;
  explosionRisk: boolean;
  flammables?: boolean;
  powerlinesDown?: boolean;
  blockedRoads?: boolean;
  structuralCollapse?: boolean;
}

export interface CasualtyDetails {
  totalCasualties: number;
  injured: number;
  critical: number;
  missing: number;
  trapped: number;
  deceased?: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  lat?: number;
  lng?: number;
  address: string;
  city?: string;
  sector?: string;
  landmark?: string;
  elevationMeters?: number;
  gnssLock?: boolean;
  formattedCoordinates?: string;
}

export enum UnitType {
  SEARCH_AND_RESCUE = 'SEARCH_AND_RESCUE',
  PARAMEDIC = 'PARAMEDIC',
  FIRE_ENGINE = 'FIRE_ENGINE',
  HAZMAT_TEAM = 'HAZMAT_TEAM',
  POLICE_TACTICAL = 'POLICE_TACTICAL',
  DRONE_RECON = 'DRONE_RECON',
  WATER_RESCUE = 'WATER_RESCUE',
  AIR_AMBULANCE = 'AIR_AMBULANCE'
}

export enum UnitStatus {
  AVAILABLE = 'AVAILABLE',
  DISPATCHED = 'DISPATCHED',
  EN_ROUTE = 'EN_ROUTE',
  ON_SCENE = 'ON_SCENE',
  ENGAGED = 'ENGAGED',
  RETURNING = 'RETURNING',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

export interface RespondingUnit {
  id: string;
  callsign: string;
  name: string;
  type: UnitType | string;
  status: UnitStatus | string;
  crewCount: number;
  leadOfficer: string;
  contactChannel: string;
  phone?: string;
  currentLocation: GeoLocation;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  assignedIncidentId?: string;
  estimatedArrivalMinutes?: number;
  etaDisplay?: string;
  batteryOrFuelPercent?: number;
  equipmentSpecialties: string[];
  roleBadge?: string;
  icon?: string;
  isEngaged?: boolean;
}

export interface IncidentStageItem {
  step: number;
  label: string;
  time: string;
  state: 'completed' | 'active' | 'pending';
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: DisasterCategory | string;
  subCategory?: string;
  severity: IncidentSeverity;
  severityLevel: SeverityLevel;
  priorityCode: string; // e.g. "Red (P1)", "Amber (P3)", "Blue (P4)"
  status: IncidentStatus | string;
  stage: string; // e.g. "Suppression", "En Route", "Containment", "Staged"
  stageProgress: {
    currentStep: number;
    totalSteps: number;
    stages: IncidentStageItem[];
  };
  
  // Coordinates and location details
  location: GeoLocation;
  latitude: number;
  longitude: number;
  lat: number;
  lng: number;
  
  // Tactical time telemetry
  elapsed: string; // e.g. "18m 42s"
  reportedAt: string; // ISO 8601 string
  updatedAt: string;
  
  // Units deployment
  unitsCount: number;
  unitsSummary: string; // e.g. "6 Engaged", "2 Assigned"
  assignedUnits: RespondingUnit[];
  assignedUnitIds: string[];
  
  // Casualties
  casualtyCount: number;
  casualtyDetails: CasualtyDetails;
  
  // Hazards
  hazards: HazardType[];
  hazardFlags: HazardFlags;
  hazardBooleans: boolean[];
  
  // Reporting & Ops info
  reporterName: string;
  reporterContact?: string;
  priorityScore: number;
  evacuationRadiusMeters?: number;
  windSpeed?: string;
  chemicalCompound?: string;
}

export interface DashboardMetricSummary {
  totalActiveIncidents: number;
  activeIncidentsDelta: string;
  criticalSeverityCount: number;
  criticalDefconLevel: string;
  unitsDeployedCount: number;
  unitsDeployedPercent: string;
  evacuationZonesCount: number;
  evacuationZonesSector: string;
  avgResponseTime: string;
  avgResponseDelta: string;
  totalCasualtiesReported: number;
  activeTrappedCount: number;
  unitsAvailableCount: number;
  systemOperationalStatus: 'OPTIMAL' | 'ELEVATED' | 'CRITICAL_DISPATCH' | 'DEFCON 3';
  latencyMs: number;
  lastUpdated: string;
}

export interface EmergencyDispatchRequest {
  severity: SeverityLevel;
  category: string;
  subCategory: string;
  calloutHeadline: string;
  fieldDescription: string;
  confirmedCasualties: number;
  hazards: {
    flammables: boolean;
    powerlinesDown: boolean;
    blockedRoads: boolean;
    structuralCollapse: boolean;
  };
  silentMode: boolean;
  targetAddress: string;
  targetSector: string;
  targetCoordinates: string;
  selectedUnits: string[];
}
