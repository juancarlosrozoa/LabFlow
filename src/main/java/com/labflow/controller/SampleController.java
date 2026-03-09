package com.labflow.controller;

import com.labflow.dto.request.SampleRequest;
import com.labflow.dto.response.SampleResponse;
import com.labflow.service.SampleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/samples")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Samples", description = "Sample management endpoints")
public class SampleController {

    private final SampleService sampleService;

    @PostMapping
    @Operation(summary = "Create a new sample")
    public ResponseEntity<SampleResponse> create(
            @Valid @RequestBody SampleRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(sampleService.create(request, userDetails.getUsername()));
    }

    @GetMapping
    @Operation(summary = "List all samples")
    public ResponseEntity<List<SampleResponse>> findAll() {
        return ResponseEntity.ok(sampleService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get sample by ID")
    public ResponseEntity<SampleResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(sampleService.findById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a sample")
    public ResponseEntity<SampleResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody SampleRequest request
    ) {
        return ResponseEntity.ok(sampleService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a sample")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sampleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
