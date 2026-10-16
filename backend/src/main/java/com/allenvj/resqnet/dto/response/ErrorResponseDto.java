package com.allenvj.resqnet.dto.response;

import lombok.Builder;

@Builder
public record ErrorResponseDto(
        String timestamp,
        int status,
        String error,
        String message,
        String path
) {
}