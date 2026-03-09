package com.labflow.controller;

import com.labflow.dto.request.ExperimentRequest;
import com.labflow.dto.response.ExperimentResponse;
import com.labflow.service.ExperimentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiments")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Experiments", description = "Experiment management endpoints")
public class ExperimentController {

    private final ExperimentService experimentService;

    @PostMapping
    @Operation(summary = "Create a new experiment")
    public ResponseEntity<ExperimentResponse> create(@Valid @RequestBody ExperimentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(experimentService.create(request));
    }

    @GetMapping
    @Operation(summary = "List all experiments")
    public ResponseEntity<List<ExperimentResponse>> findAll() {
        return ResponseEntity.ok(experimentService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get experiment by ID")
    public ResponseEntity<ExperimentResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(experimentService.findById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an experiment")
    public ResponseEntity<ExperimentResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ExperimentRequest request
    ) {
        return ResponseEntity.ok(experimentService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an experiment")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        experimentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
