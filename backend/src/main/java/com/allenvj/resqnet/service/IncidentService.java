package com.allenvj.resqnet.service;

import com.allenvj.resqnet.dto.request.IncidentRequestDto;
import com.allenvj.resqnet.dto.request.IncidentStatusUpdateDto;
import com.allenvj.resqnet.dto.response.IncidentResponseDto;
import com.allenvj.resqnet.entity.Incident;
import com.allenvj.resqnet.entity.User;
import com.allenvj.resqnet.enums.IncidentStatus;
import com.allenvj.resqnet.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;

    @Transactional
    public IncidentResponseDto reportIncident(IncidentRequestDto request, User reporter) {
        Incident incident = Incident.builder()
                .title(request.title().trim())
                .description(request.description().trim())
                .location(request.location().trim())
                .severity(request.severity())
                .status(IncidentStatus.REPORTED)
                .reporter(reporter)
                .build();

        Incident savedIncident = incidentRepository.save(incident);
        return mapToResponseDto(savedIncident);
    }

    @Transactional(readOnly = true)
    public List<IncidentResponseDto> getAllIncidents() {
        return incidentRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Transactional
    public IncidentResponseDto updateIncidentStatus(UUID id, IncidentStatusUpdateDto request) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found with ID: " + id));

        incident.setStatus(request.status());
        Incident updatedIncident = incidentRepository.save(incident);

        return mapToResponseDto(updatedIncident);
    }

    private IncidentResponseDto mapToResponseDto(Incident incident) {
        return IncidentResponseDto.builder()
                .id(incident.getId())
                .title(incident.getTitle())
                .description(incident.getDescription())
                .location(incident.getLocation())
                .severity(incident.getSeverity())
                .status(incident.getStatus())
                .reporterName(incident.getReporter() != null ? incident.getReporter().getFullName() : "Anonymous")
                .createdAt(incident.getCreatedAt())
                .build();
    }
}