package com.labflow.repository;

import com.labflow.model.Experiment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperimentRepository extends JpaRepository<Experiment, Long> {
    List<Experiment> findByResearcherId(Long researcherId);
    List<Experiment> findBySampleId(Long sampleId);
    List<Experiment> findByStatus(Experiment.Status status);
    long countByStatus(Experiment.Status status);
}
