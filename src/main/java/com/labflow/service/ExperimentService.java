package com.labflow.service;

import com.labflow.dto.request.ExperimentRequest;
import com.labflow.dto.response.ExperimentResponse;
import com.labflow.model.Experiment;
import com.labflow.model.Sample;
import com.labflow.model.User;
import com.labflow.repository.ExperimentRepository;
import com.labflow.repository.SampleRepository;
import com.labflow.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExperimentService {

    private final ExperimentRepository experimentRepository;
    private final UserRepository userRepository;
    private final SampleRepository sampleRepository;

    public ExperimentResponse create(ExperimentRequest request) {
        User researcher = userRepository.findById(request.getResearcherId())
                .orElseThrow(() -> new EntityNotFoundException("Researcher not found: " + request.getResearcherId()));

        Sample sample = sampleRepository.findById(request.getSampleId())
                .orElseThrow(() -> new EntityNotFoundException("Sample not found: " + request.getSampleId()));

        Experiment experiment = Experiment.builder()
                .name(request.getName())
                .type(request.getType())
                .date(request.getDate())
                .researcher(researcher)
                .sample(sample)
                .status(request.getStatus())
                .build();

        return toResponse(experimentRepository.save(experiment));
    }

    public List<ExperimentResponse> findAll() {
        return experimentRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ExperimentResponse findById(Long id) {
        return experimentRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Experiment not found: " + id));
    }

    public ExperimentResponse update(Long id, ExperimentRequest request) {
        Experiment experiment = experimentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Experiment not found: " + id));

        User researcher = userRepository.findById(request.getResearcherId())
                .orElseThrow(() -> new EntityNotFoundException("Researcher not found: " + request.getResearcherId()));

        Sample sample = sampleRepository.findById(request.getSampleId())
                .orElseThrow(() -> new EntityNotFoundException("Sample not found: " + request.getSampleId()));

        experiment.setName(request.getName());
        experiment.setType(request.getType());
        experiment.setDate(request.getDate());
        experiment.setResearcher(researcher);
        experiment.setSample(sample);
        experiment.setStatus(request.getStatus());

        return toResponse(experimentRepository.save(experiment));
    }

    public void delete(Long id) {
        if (!experimentRepository.existsById(id)) {
            throw new EntityNotFoundException("Experiment not found: " + id);
        }
        experimentRepository.deleteById(id);
    }

    private ExperimentResponse toResponse(Experiment experiment) {
        return ExperimentResponse.builder()
                .id(experiment.getId())
                .name(experiment.getName())
                .type(experiment.getType())
                .date(experiment.getDate())
                .researcherName(experiment.getResearcher().getName())
                .sampleCode(experiment.getSample().getSampleCode())
                .status(experiment.getStatus())
                .createdAt(experiment.getCreatedAt())
                .build();
    }
}
