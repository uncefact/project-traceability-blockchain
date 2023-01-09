package ch.supsi.repository;

import ch.supsi.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ch.supsi.model.ProcessType;

import java.util.List;

@Repository
public interface ProcessTypeRepository extends JpaRepository<ProcessType, String> {
    ProcessType findByCode(String code);

    List<ProcessType> findProcessTypesByRolesContains(Role role);
}
