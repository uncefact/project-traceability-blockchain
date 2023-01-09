package ch.supsi.repository;

import ch.supsi.model.TraceabilityLevel;
import ch.supsi.model.transformation_plan.TransformationPlan;
import ch.supsi.model.TransparencyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransformationPlanRepository extends JpaRepository<TransformationPlan, Long> {

    List<TransformationPlan> findAllByCompanyCompanyName(String companyName);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE TransformationPlan t " +
            "SET t.traceabilityLevel = :traceabilityLevel, t.transparencyLevel = :transparencyLevel " +
            "WHERE t.id = :id ")
    void updateFields(Long id, TraceabilityLevel traceabilityLevel, TransparencyLevel transparencyLevel);
}
