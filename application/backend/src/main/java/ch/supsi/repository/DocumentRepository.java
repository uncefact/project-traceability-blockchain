package ch.supsi.repository;

import ch.supsi.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {


    Optional<Document> getDocumentById(Long id);
}
