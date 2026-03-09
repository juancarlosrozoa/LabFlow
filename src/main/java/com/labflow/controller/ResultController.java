package com.labflow.controller;

import com.labflow.dto.request.ResultRequest;
import com.labflow.dto.response.ResultResponse;
import com.labflow.service.ResultService;
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
@RequestMapping("/api/results")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Results", description = "Experiment results endpoints")
public class ResultController {

    private final ResultService resultService;

    @PostMapping
    @Operation(summary = "Add a result to an experiment")
    public ResponseEntity<ResultResponse> create(@Valid @RequestBody ResultRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resultService.create(request));
    }

    @GetMapping("/experiment/{experimentId}")
    @Operation(summary = "Get all results for an experiment")
    public ResponseEntity<List<ResultResponse>> findByExperiment(@PathVariable Long experimentId) {
        return ResponseEntity.ok(resultService.findByExperiment(experimentId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get result by ID")
    public ResponseEntity<ResultResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(resultService.findById(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a result")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resultService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
