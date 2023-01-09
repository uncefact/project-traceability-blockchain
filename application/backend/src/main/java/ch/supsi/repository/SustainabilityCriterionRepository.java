package ch.supsi.repository;

import ch.supsi.model.company.CompanyIndustry;
import ch.supsi.model.SustainabilityCriterion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SustainabilityCriterionRepository extends JpaRepository<SustainabilityCriterion, Long> {

    List<SustainabilityCriterion> findSustainabilityCriterionByCompanyIndustriesContains(CompanyIndustry companyIndustry);
}
