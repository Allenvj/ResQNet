package com.allenvj.resqnet.dto.response;

import com.allenvj.resqnet.enums.TaskStatus;
import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record TaskResponseDto(
        UUID id,
        String title,
        String description,
        TaskStatus status,
        UUID incidentId,
        String incidentTitle,
        UUID assigneeId,
        String assigneeName,
        Instant createdAt
) {
}