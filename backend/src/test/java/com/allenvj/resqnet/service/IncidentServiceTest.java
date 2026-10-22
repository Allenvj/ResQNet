package com.allenvj.resqnet.service;

import com.allenvj.resqnet.dto.request.IncidentRequestDto;
import com.allenvj.resqnet.dto.request.IncidentStatusUpdateDto;
import com.allenvj.resqnet.dto.response.IncidentResponseDto;
import com.allenvj.resqnet.entity.Incident;
import com.allenvj.resqnet.entity.User;
import com.allenvj.resqnet.enums.AccountStatus;
import com.allenvj.resqnet.enums.IncidentSeverity;
import com.allenvj.resqnet.enums.IncidentStatus;
import com.allenvj.resqnet.enums.Role;
import com.allenvj.resqnet.repository.IncidentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IncidentServiceTest {

    @Mock
    private IncidentRepository incidentRepository;

    @InjectMocks
    private IncidentService incidentService;

    private User mockReporter;
    private UUID incidentId;

    @BeforeEach
    void setUp() {
        mockReporter = User.builder()
                .id(UUID.randomUUID())
                .email("citizen@resqnet.com")
                .fullName("John Citizen")
                .phoneNumber("1234567890")
                .role(Role.CITIZEN)
                .status(AccountStatus.ACTIVE)
                .build();

        incidentId = UUID.randomUUID();
    }

    @Test
    @DisplayName("reportIncident - successfully saves and returns IncidentResponseDto")
    void reportIncident_Success() {
        // Arrange
        IncidentRequestDto request = new IncidentRequestDto(
                "Flooding on Main St",
                "Water level rising rapidly",
                "123 Main St, Downtown",
                IncidentSeverity.HIGH
        );

        Incident savedIncident = Incident.builder()
                .id(incidentId)
                .title(request.title())
                .description(request.description())
                .location(request.location())
                .severity(request.severity())
                .status(IncidentStatus.REPORTED)
                .reporter(mockReporter)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(incidentRepository.save(any(Incident.class))).thenReturn(savedIncident);

        // Act
        IncidentResponseDto response = incidentService.reportIncident(request, mockReporter);

        // Assert
        assertNotNull(response);
        assertEquals(incidentId, response.id());
        assertEquals("Flooding on Main St", response.title());
        assertEquals("Water level rising rapidly", response.description());
        assertEquals("123 Main St, Downtown", response.location());
        assertEquals(IncidentSeverity.HIGH, response.severity());
        assertEquals(IncidentStatus.REPORTED, response.status());
        assertEquals("John Citizen", response.reporterName());

        verify(incidentRepository).save(any(Incident.class));
    }

    @Test
    @DisplayName("updateIncidentStatus - successfully updates status and returns IncidentResponseDto")
    void updateIncidentStatus_Success() {
        // Arrange
        Incident existingIncident = Incident.builder()
                .id(incidentId)
                .title("Fire in Warehouse")
                .description("Smoke detected on 2nd floor")
                .location("Industrial Zone B")
                .severity(IncidentSeverity.CRITICAL)
                .status(IncidentStatus.REPORTED)
                .reporter(mockReporter)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Incident updatedIncident = Incident.builder()
                .id(incidentId)
                .title("Fire in Warehouse")
                .description("Smoke detected on 2nd floor")
                .location("Industrial Zone B")
                .severity(IncidentSeverity.CRITICAL)
                .status(IncidentStatus.IN_PROGRESS)
                .reporter(mockReporter)
                .createdAt(existingIncident.getCreatedAt())
                .updatedAt(Instant.now())
                .build();

        IncidentStatusUpdateDto request = new IncidentStatusUpdateDto(IncidentStatus.IN_PROGRESS);

        when(incidentRepository.findById(incidentId)).thenReturn(Optional.of(existingIncident));
        when(incidentRepository.save(any(Incident.class))).thenReturn(updatedIncident);

        // Act
        IncidentResponseDto response = incidentService.updateIncidentStatus(incidentId, request);

        // Assert
        assertNotNull(response);
        assertEquals(incidentId, response.id());
        assertEquals(IncidentStatus.IN_PROGRESS, response.status());

        verify(incidentRepository).findById(incidentId);
        verify(incidentRepository).save(existingIncident);
        assertEquals(IncidentStatus.IN_PROGRESS, existingIncident.getStatus());
    }

    @Test
    @DisplayName("updateIncidentStatus_NotFound - throws IllegalArgumentException when incident does not exist")
    void updateIncidentStatus_NotFound() {
        // Arrange
        IncidentStatusUpdateDto request = new IncidentStatusUpdateDto(IncidentStatus.RESOLVED);
        when(incidentRepository.findById(incidentId)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> incidentService.updateIncidentStatus(incidentId, request)
        );

        assertEquals("Incident not found with ID: " + incidentId, exception.getMessage());
        verify(incidentRepository).findById(incidentId);
        verify(incidentRepository, never()).save(any(Incident.class));
    }
}