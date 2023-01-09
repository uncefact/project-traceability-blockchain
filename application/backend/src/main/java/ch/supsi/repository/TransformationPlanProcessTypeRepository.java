package ch.supsi.repository;

import ch.supsi.model.transformation_plan.TransformationPlanProcessType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface TransformationPlanProcessTypeRepository extends JpaRepository<TransformationPlanProcessType, Long> {

    List<TransformationPlanProcessType> findAllByTransformationPlanId(Long id);

    @Transactional
    @Modifying
    @Query("DELETE FROM TransformationPlanProcessType t WHERE t.transformationPlan.id = :id")
    void deleteAllByTransformationPlanId(Long id);

}
