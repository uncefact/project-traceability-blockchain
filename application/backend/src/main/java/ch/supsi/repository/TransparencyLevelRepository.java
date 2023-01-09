package ch.supsi.repository;

import ch.supsi.model.TransparencyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransparencyLevelRepository extends JpaRepository<TransparencyLevel, String> {
}
