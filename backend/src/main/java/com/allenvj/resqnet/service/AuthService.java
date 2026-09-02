package com.allenvj.resqnet.service;

import com.allenvj.resqnet.dto.request.RegisterRequestDto;
import com.allenvj.resqnet.dto.response.UserResponseDto;
import com.allenvj.resqnet.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;

    public UserResponseDto register(RegisterRequestDto request) {

        User user = userService.register(
                request.getEmail(),
                request.getPassword(),
                request.getFullName(),
                request.getPhoneNumber(),
                request.getRequestedRole()
        );

        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }
}