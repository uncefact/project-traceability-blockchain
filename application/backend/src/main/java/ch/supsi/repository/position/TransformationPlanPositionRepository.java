package ch.supsi.repository.position;

import ch.supsi.model.Material;
import ch.supsi.model.position.TransformationPlanPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface TransformationPlanPositionRepository extends JpaRepository<TransformationPlanPosition, Long> {

    TransformationPlanPosition findByContractorMaterial(Material material);
    List<TransformationPlanPosition> findAllByContractorMaterial(Material material);

    List<TransformationPlanPosition> findAllByTransformationPlanId(Long id);

    @Transactional
    @Modifying
    @Query("DELETE FROM TransformationPlanPosition t WHERE t.transformationPlan.id = :id")
    void deleteAllByTransformationPlanId(Long id);

}
