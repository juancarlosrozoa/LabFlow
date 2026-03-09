package com.labflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ResultResponse {
    private Long id;
    private Long experimentId;
    private String experimentName;
    private String filePath;
    private String notes;
    private LocalDateTime createdAt;
}
