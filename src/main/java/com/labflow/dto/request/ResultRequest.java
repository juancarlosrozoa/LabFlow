package com.labflow.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResultRequest {

    @NotNull
    private Long experimentId;

    private String filePath;

    private String notes;
}
