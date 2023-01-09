package ch.supsi.repository;

import ch.supsi.model.transformation_plan.TransformationPlanProcessingStandard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface TransformationPlanProcessingStandardRepository extends JpaRepository<TransformationPlanProcessingStandard, Long> {

    List<TransformationPlanProcessingStandard> findAllByTransformationPlanId(Long id);

    @Transactional
    @Modifying
    @Query("DELETE FROM TransformationPlanProcessingStandard t WHERE t.transformationPlan.id = :id")
    void deleteAllByTransformationPlanId(Long id);

}
