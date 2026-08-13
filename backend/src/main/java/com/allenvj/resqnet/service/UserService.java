package com.allenvj.resqnet.service;

import com.allenvj.resqnet.entity.User;
import com.allenvj.resqnet.enums.AccountStatus;
import com.allenvj.resqnet.enums.Role;
import com.allenvj.resqnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(
            String email,
            String password,
            String fullName,
            String phoneNumber,
            Role requestedRole
    ) {

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new IllegalArgumentException("Phone number is already registered");
        }

        Role role = determineRegistrationRole(requestedRole);

        User user = User.builder()
                .email(email.toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(password))
                .fullName(fullName.trim())
                .phoneNumber(phoneNumber.trim())
                .role(role)
                .status(AccountStatus.ACTIVE)
                .build();

        return userRepository.save(user);
    }

    private Role determineRegistrationRole(Role requestedRole) {

        if (requestedRole == null) {
            return Role.CITIZEN;
        }

        if (requestedRole == Role.CITIZEN || requestedRole == Role.VOLUNTEER) {
            return requestedRole;
        }

        throw new IllegalArgumentException(
                "This role requires administrative approval"
        );
    }
}