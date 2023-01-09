package ch.supsi.repository;

import ch.supsi.model.TraceabilityLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TraceabilityLevelRepository extends JpaRepository<TraceabilityLevel, String> {
}
