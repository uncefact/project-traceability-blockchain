package ch.supsi.repository.processing_standard;

import ch.supsi.model.processing_standard.SelfCertificationProprietaryStandard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SelfCertificationProprietaryStandardRepository extends JpaRepository<SelfCertificationProprietaryStandard, String> {

    List<SelfCertificationProprietaryStandard> findAllByNameIn(List<String> processingStandardNames);
}
