package com.allenvj.resqnet.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record TaskRequestDto(

        @NotBlank(message = "Title is required")
        @Size(max = 150, message = "Title must not exceed 150 characters")
        String title,

        @NotBlank(message = "Description is required")
        String description,

        @NotNull(message = "Incident ID is required")
        UUID incidentId,

        UUID assigneeId

) {
}