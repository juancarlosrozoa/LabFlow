package com.labflow.service;

import com.labflow.dto.request.ResultRequest;
import com.labflow.dto.response.ResultResponse;
import com.labflow.model.Experiment;
import com.labflow.model.Result;
import com.labflow.repository.ExperimentRepository;
import com.labflow.repository.ResultRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;
    private final ExperimentRepository experimentRepository;

    public ResultResponse create(ResultRequest request) {
        Experiment experiment = experimentRepository.findById(request.getExperimentId())
                .orElseThrow(() -> new EntityNotFoundException("Experiment not found: " + request.getExperimentId()));

        Result result = Result.builder()
                .experiment(experiment)
                .filePath(request.getFilePath())
                .notes(request.getNotes())
                .build();

        return toResponse(resultRepository.save(result));
    }

    public List<ResultResponse> findByExperiment(Long experimentId) {
        if (!experimentRepository.existsById(experimentId)) {
            throw new EntityNotFoundException("Experiment not found: " + experimentId);
        }
        return resultRepository.findByExperimentId(experimentId).stream().map(this::toResponse).toList();
    }

    public ResultResponse findById(Long id) {
        return resultRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Result not found: " + id));
    }

    public void delete(Long id) {
        if (!resultRepository.existsById(id)) {
            throw new EntityNotFoundException("Result not found: " + id);
        }
        resultRepository.deleteById(id);
    }

    private ResultResponse toResponse(Result result) {
        return ResultResponse.builder()
                .id(result.getId())
                .experimentId(result.getExperiment().getId())
                .experimentName(result.getExperiment().getName())
                .filePath(result.getFilePath())
                .notes(result.getNotes())
                .createdAt(result.getCreatedAt())
                .build();
    }
}
