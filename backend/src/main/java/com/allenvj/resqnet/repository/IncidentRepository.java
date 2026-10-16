package com.allenvj.resqnet.repository;

import com.allenvj.resqnet.entity.Incident;
import com.allenvj.resqnet.enums.IncidentSeverity;
import com.allenvj.resqnet.enums.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, UUID> {

    List<Incident> findByStatus(IncidentStatus status);

    List<Incident> findBySeverity(IncidentSeverity severity);

    List<Incident> findByReporterId(UUID reporterId);

    List<Incident> findByStatusAndSeverity(IncidentStatus status, IncidentSeverity severity);

    long countByStatus(IncidentStatus status);
}