package com.allenvj.resqnet.service;

import com.allenvj.resqnet.dto.request.TaskRequestDto;
import com.allenvj.resqnet.dto.response.TaskResponseDto;
import com.allenvj.resqnet.entity.Incident;
import com.allenvj.resqnet.entity.Task;
import com.allenvj.resqnet.entity.User;
import com.allenvj.resqnet.enums.TaskStatus;
import com.allenvj.resqnet.repository.IncidentRepository;
import com.allenvj.resqnet.repository.TaskRepository;
import com.allenvj.resqnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;

    @Transactional
    public TaskResponseDto createTask(TaskRequestDto request) {
        Incident incident = incidentRepository.findById(request.incidentId())
                .orElseThrow(() -> new IllegalArgumentException("Incident not found with ID: " + request.incidentId()));

        User assignee = null;
        if (request.assigneeId() != null) {
            assignee = userRepository.findById(request.assigneeId())
                    .orElseThrow(() -> new IllegalArgumentException("Assignee not found with ID: " + request.assigneeId()));
        }

        Task task = Task.builder()
                .title(request.title().trim())
                .description(request.description().trim())
                .status(TaskStatus.PENDING)
                .incident(incident)
                .assignee(assignee)
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToResponseDto(savedTask);
    }

    @Transactional(readOnly = true)
    public List<TaskResponseDto> getTasksByIncident(UUID incidentId) {
        return taskRepository.findByIncidentId(incidentId)
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TaskResponseDto> getMyTasks(UUID userId) {
        return taskRepository.findByAssigneeId(userId)
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    private TaskResponseDto mapToResponseDto(Task task) {
        return TaskResponseDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .incidentId(task.getIncident().getId())
                .incidentTitle(task.getIncident().getTitle())
                .assigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null)
                .assigneeName(task.getAssignee() != null ? task.getAssignee().getFullName() : null)
                .createdAt(task.getCreatedAt())
                .build();
    }
}