package com.allenvj.resqnet.repository;

import com.allenvj.resqnet.entity.Task;
import com.allenvj.resqnet.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByIncidentId(UUID incidentId);

    List<Task> findByAssigneeId(UUID assigneeId);

    List<Task> findByStatus(TaskStatus status);

    long countByStatus(TaskStatus status);
}