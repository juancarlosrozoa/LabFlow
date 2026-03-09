package com.labflow.dto.response;

import com.labflow.model.Experiment;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class ExperimentResponse {
    private Long id;
    private String name;
    private String type;
    private LocalDate date;
    private String researcherName;
    private String sampleCode;
    private Experiment.Status status;
    private LocalDateTime createdAt;
}
