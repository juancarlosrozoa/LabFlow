package com.labflow.service;

import com.labflow.dto.request.SampleRequest;
import com.labflow.dto.response.SampleResponse;
import com.labflow.model.Sample;
import com.labflow.model.User;
import com.labflow.repository.SampleRepository;
import com.labflow.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SampleService {

    private final SampleRepository sampleRepository;
    private final UserRepository userRepository;

    public SampleResponse create(SampleRequest request, String creatorEmail) {
        if (sampleRepository.existsBySampleCode(request.getSampleCode())) {
            throw new IllegalArgumentException("Sample code already exists: " + request.getSampleCode());
        }

        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Sample sample = Sample.builder()
                .sampleCode(request.getSampleCode())
                .sampleType(request.getSampleType())
                .collectionDate(request.getCollectionDate())
                .status(request.getStatus())
                .createdBy(creator)
                .build();

        return toResponse(sampleRepository.save(sample));
    }

    public List<SampleResponse> findAll() {
        return sampleRepository.findAll().stream().map(this::toResponse).toList();
    }

    public SampleResponse findById(Long id) {
        return sampleRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Sample not found: " + id));
    }

    public SampleResponse update(Long id, SampleRequest request) {
        Sample sample = sampleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sample not found: " + id));

        sample.setSampleType(request.getSampleType());
        sample.setCollectionDate(request.getCollectionDate());
        sample.setStatus(request.getStatus());

        return toResponse(sampleRepository.save(sample));
    }

    public void delete(Long id) {
        if (!sampleRepository.existsById(id)) {
            throw new EntityNotFoundException("Sample not found: " + id);
        }
        sampleRepository.deleteById(id);
    }

    private SampleResponse toResponse(Sample sample) {
        return SampleResponse.builder()
                .id(sample.getId())
                .sampleCode(sample.getSampleCode())
                .sampleType(sample.getSampleType())
                .collectionDate(sample.getCollectionDate())
                .status(sample.getStatus())
                .createdByName(sample.getCreatedBy().getName())
                .createdAt(sample.getCreatedAt())
                .build();
    }
}
