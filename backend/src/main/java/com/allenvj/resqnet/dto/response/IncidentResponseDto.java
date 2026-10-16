package com.allenvj.resqnet.dto.response;

import com.allenvj.resqnet.enums.IncidentSeverity;
import com.allenvj.resqnet.enums.IncidentStatus;
import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record IncidentResponseDto(
        UUID id,
        String title,
        String description,
        String location,
        IncidentSeverity severity,
        IncidentStatus status,
        String reporterName,
        Instant createdAt
) {
}