package com.allenvj.resqnet.service;

import com.allenvj.resqnet.dto.request.LoginRequestDto;
import com.allenvj.resqnet.dto.request.RegisterRequestDto;
import com.allenvj.resqnet.dto.response.AuthResponseDto;
import com.allenvj.resqnet.dto.response.UserResponseDto;
import com.allenvj.resqnet.entity.User;
import com.allenvj.resqnet.repository.UserRepository;
import com.allenvj.resqnet.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

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

    public AuthResponseDto login(LoginRequestDto request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email().toLowerCase().trim(),
                        request.password()
                )
        );

        User user = (User) authentication.getPrincipal();

        // Update the audit timestamp for security tracking
        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponseDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }
}