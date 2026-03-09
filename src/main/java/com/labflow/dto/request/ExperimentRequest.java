package com.labflow.dto.request;

import com.labflow.model.Experiment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ExperimentRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String type;

    @NotNull
    private LocalDate date;

    @NotNull
    private Long researcherId;

    @NotNull
    private Long sampleId;

    @NotNull
    private Experiment.Status status;
}
