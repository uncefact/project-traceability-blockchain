package ch.supsi.repository.processing_standard;

import ch.supsi.model.processing_standard.ReferencedStandard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferencedStandardRepository extends JpaRepository<ReferencedStandard, String> {

    List<ReferencedStandard> findAllByNameIn(List<String> processingStandardNames);

}
