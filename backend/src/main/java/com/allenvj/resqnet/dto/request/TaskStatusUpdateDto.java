package com.allenvj.resqnet.dto.request;

import com.allenvj.resqnet.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record TaskStatusUpdateDto(

        @NotNull(message = "Status is required")
        TaskStatus status

) {
}