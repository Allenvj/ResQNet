package com.allenvj.resqnet.bootstrap;

import com.allenvj.resqnet.entity.User;
import com.allenvj.resqnet.enums.AccountStatus;
import com.allenvj.resqnet.enums.Role;
import com.allenvj.resqnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        final String managerEmail = "manager@resqnet.com";

        if (!userRepository.existsByEmail(managerEmail)) {
            User manager = User.builder()
                    .email(managerEmail)
                    .passwordHash(passwordEncoder.encode("Manager123!"))
                    .fullName("System Manager")
                    .phoneNumber("9999999999")
                    .role(Role.DISASTER_MANAGER)
                    .status(AccountStatus.ACTIVE)
                    .build();

            userRepository.save(manager);
            log.info("Default DISASTER_MANAGER seeded successfully: {}", managerEmail);
        } else {
            log.info("DISASTER_MANAGER '{}' already exists. Skipping seeding.", managerEmail);
        }
    }
}