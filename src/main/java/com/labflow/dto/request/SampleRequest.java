package com.labflow.dto.request;

import com.labflow.model.Sample;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SampleRequest {

    @NotBlank
    private String sampleCode;

    @NotBlank
    private String sampleType;

    private LocalDate collectionDate;

    @NotNull
    private Sample.Status status;
}
