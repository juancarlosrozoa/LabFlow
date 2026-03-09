package com.labflow.service;

import com.labflow.dto.response.DashboardResponse;
import com.labflow.model.Experiment;
import com.labflow.model.Sample;
import com.labflow.repository.ExperimentRepository;
import com.labflow.repository.SampleRepository;
import com.labflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final SampleRepository sampleRepository;
    private final ExperimentRepository experimentRepository;
    private final UserRepository userRepository;

    public DashboardResponse getStats() {
        return DashboardResponse.builder()
                .totalSamples(sampleRepository.count())
                .totalExperiments(experimentRepository.count())
                .totalUsers(userRepository.count())
                .experimentsInProgress(experimentRepository.countByStatus(Experiment.Status.IN_PROGRESS))
                .experimentsCompleted(experimentRepository.countByStatus(Experiment.Status.COMPLETED))
                .samplesPending(sampleRepository.findByStatus(Sample.Status.RECEIVED).size())
                .build();
    }
}
