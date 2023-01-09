package ch.supsi.repository.processing_standard;

import ch.supsi.model.processing_standard.ProcessingStandard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProcessingStandardRepository extends JpaRepository<ProcessingStandard, String> {

    ProcessingStandard findByName(String name);

    List<ProcessingStandard> findByNameIn(List<String> processingStandardNames);
}
