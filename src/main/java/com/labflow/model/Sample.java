package com.labflow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "samples")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sample {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "sample_code", nullable = false, unique = true)
    private String sampleCode;

    @NotBlank
    @Column(name = "sample_type", nullable = false)
    private String sampleType;

    @Column(name = "collection_date")
    private LocalDate collectionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "sample", fetch = FetchType.LAZY)
    private List<Experiment> experiments;

    public enum Status {
        RECEIVED, IN_PROCESS, COMPLETED, ARCHIVED
    }
}
