package ch.supsi.repository;

import ch.supsi.model.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentTypeRepository extends JpaRepository<DocumentType, String> {

    List<DocumentType> findDocumentTypesByCodeIn(List<String> documentTypeCodes);
}
