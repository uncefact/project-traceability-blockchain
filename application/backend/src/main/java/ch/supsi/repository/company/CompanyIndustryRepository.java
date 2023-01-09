package ch.supsi.repository.company;

import ch.supsi.model.company.CompanyIndustry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyIndustryRepository extends JpaRepository<CompanyIndustry, String> {
}
