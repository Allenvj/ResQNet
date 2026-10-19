package com.allenvj.resqnet.controller;

import com.allenvj.resqnet.dto.request.TaskRequestDto;
import com.allenvj.resqnet.dto.request.TaskStatusUpdateDto;
import com.allenvj.resqnet.dto.response.TaskResponseDto;
import com.allenvj.resqnet.entity.User;
import com.allenvj.resqnet.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @PreAuthorize("hasAnyRole('DISASTER_MANAGER', 'ADMIN')")
    public ResponseEntity<TaskResponseDto> createTask(
            @Valid @RequestBody TaskRequestDto request
    ) {
        TaskResponseDto response = taskService.createTask(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/incident/{incidentId}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByIncident(
            @PathVariable UUID incidentId
    ) {
        List<TaskResponseDto> tasks = taskService.getTasksByIncident(incidentId);

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<List<TaskResponseDto>> getMyTasks(
            @AuthenticationPrincipal User currentUser
    ) {
        List<TaskResponseDto> tasks = taskService.getMyTasks(currentUser.getId());

        return ResponseEntity.ok(tasks);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponseDto> updateTaskStatus(
            @PathVariable UUID id,
            @Valid @RequestBody TaskStatusUpdateDto request,
            @AuthenticationPrincipal User currentUser
    ) {
        TaskResponseDto response = taskService.updateTaskStatus(id, request, currentUser);

        return ResponseEntity.ok(response);
    }
}