package com.labflow.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {
    private long totalSamples;
    private long totalExperiments;
    private long totalUsers;
    private long experimentsInProgress;
    private long experimentsCompleted;
    private long samplesPending;
}
