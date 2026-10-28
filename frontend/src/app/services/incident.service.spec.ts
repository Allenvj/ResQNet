import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { IncidentService } from './incident.service';
import { Incident, IncidentSeverity, IncidentStatus } from '../models/incident.model';

describe('IncidentService', () => {
  let service: IncidentService;
  let httpMock: HttpTestingController;
  const expectedToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzkzMTk0NjIzLCJleHAiOjE3OTMxOTU1MjN9.BJLr3-qNR3D0kIQib_hHUpOP_7kv7_l3GMhcXa0Xqa_Cd4dbG-9lO1IpUerKPjvT';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IncidentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(IncidentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all incidents via GET from http://localhost:8081/api/v1/incidents with Authorization header', () => {
    const mockIncidents: Partial<Incident>[] = [
      {
        id: '#RN-8821',
        title: 'Sector 4 Industrial Chemical Fire',
        severity: IncidentSeverity.CRITICAL,
        status: IncidentStatus.ACTIVE
      }
    ];

    service.getAllIncidents().subscribe((incidents) => {
      expect(incidents.length).toBe(1);
      expect(incidents[0].id).toBe('#RN-8821');
    });

    const req = httpMock.expectOne('http://localhost:8081/api/v1/incidents');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${expectedToken}`);
    req.flush(mockIncidents);
  });

  it('should report an incident via POST to http://localhost:8081/api/v1/incidents with Authorization header', () => {
    const payload = {
      title: 'Sector 4 Chemical Spill',
      description: 'Storage tank ruptured',
      location: {
        address: 'Pier 42',
        latitude: 47.6026,
        longitude: -122.3375
      },
      severity: IncidentSeverity.CRITICAL
    };

    const mockResponse: Partial<Incident> = {
      id: '#RN-8822',
      ...payload,
      status: IncidentStatus.ACTIVE
    };

    service.reportIncident(payload).subscribe((res) => {
      expect(res.id).toBe('#RN-8822');
      expect(res.title).toBe('Sector 4 Chemical Spill');
    });

    const req = httpMock.expectOne('http://localhost:8081/api/v1/incidents');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${expectedToken}`);
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });
});
