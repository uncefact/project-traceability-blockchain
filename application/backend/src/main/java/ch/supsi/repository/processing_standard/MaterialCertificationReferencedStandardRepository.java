package ch.supsi.repository.processing_standard;

import ch.supsi.model.processing_standard.MaterialCertificationReferencedStandard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialCertificationReferencedStandardRepository extends JpaRepository<MaterialCertificationReferencedStandard, String> {

    List<MaterialCertificationReferencedStandard> findAllByNameIn(List<String> processingStandardNames);

}
