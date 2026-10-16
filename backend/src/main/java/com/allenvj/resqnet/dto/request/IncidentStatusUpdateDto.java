package com.allenvj.resqnet.dto.request;

import com.allenvj.resqnet.enums.IncidentStatus;
import jakarta.validation.constraints.NotNull;

public record IncidentStatusUpdateDto(

        @NotNull(message = "Status is required")
        IncidentStatus status

) {
}