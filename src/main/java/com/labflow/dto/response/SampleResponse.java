package com.labflow.dto.response;

import com.labflow.model.Sample;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class SampleResponse {
    private Long id;
    private String sampleCode;
    private String sampleType;
    private LocalDate collectionDate;
    private Sample.Status status;
    private String createdByName;
    private LocalDateTime createdAt;
}
