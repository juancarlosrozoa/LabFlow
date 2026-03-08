package com.labflow.repository;

import com.labflow.model.Sample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SampleRepository extends JpaRepository<Sample, Long> {
    Optional<Sample> findBySampleCode(String sampleCode);
    boolean existsBySampleCode(String sampleCode);
    List<Sample> findByCreatedById(Long userId);
    List<Sample> findByStatus(Sample.Status status);
}
