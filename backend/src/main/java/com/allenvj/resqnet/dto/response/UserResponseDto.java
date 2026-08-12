package com.allenvj.resqnet.dto.response;

import com.allenvj.resqnet.enums.AccountStatus;
import com.allenvj.resqnet.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class UserResponseDto {

    private UUID id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Role role;
    private AccountStatus status;
    private Instant createdAt;
}