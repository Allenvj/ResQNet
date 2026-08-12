package com.allenvj.resqnet.repository;

import com.allenvj.resqnet.entity.User;
import com.allenvj.resqnet.enums.AccountStatus;
import com.allenvj.resqnet.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    long countByRole(Role role);

    long countByStatus(AccountStatus status);
}