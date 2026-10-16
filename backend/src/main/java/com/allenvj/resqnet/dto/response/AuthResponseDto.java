package com.allenvj.resqnet.dto.response;

import com.allenvj.resqnet.enums.Role;
import lombok.Builder;

import java.util.UUID;

@Builder
public record AuthResponseDto(
        String accessToken,
        String refreshToken,
        UUID id,
        String email,
        String fullName,
        Role role
) {
}