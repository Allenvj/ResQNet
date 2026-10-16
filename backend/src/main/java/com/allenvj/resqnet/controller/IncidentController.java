package com.allenvj.resqnet.controller;

import com.allenvj.resqnet.dto.request.IncidentRequestDto;
import com.allenvj.resqnet.dto.response.IncidentResponseDto;
import com.allenvj.resqnet.entity.User;
import com.allenvj.resqnet.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping
    public ResponseEntity<IncidentResponseDto> reportIncident(
            @Valid @RequestBody IncidentRequestDto request,
            @AuthenticationPrincipal User currentUser
    ) {
        IncidentResponseDto response = incidentService.reportIncident(request, currentUser);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<IncidentResponseDto>> getAllIncidents() {
        List<IncidentResponseDto> incidents = incidentService.getAllIncidents();

        return ResponseEntity.ok(incidents);
    }
}