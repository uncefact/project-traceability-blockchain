package ch.supsi.repository;

import ch.supsi.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {

    List<Material> findAllByCompanyCompanyNameAndIsInput(String companyName, Boolean isIn);

    List<Material> findAllByCompanyCompanyName(String companyName);

    List<Material> findAllByIdIn(List<Long> id);

}
