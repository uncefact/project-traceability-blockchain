package ch.supsi.repository.company;

import ch.supsi.model.company.CompanyKnowsCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyKnowsCompanyRepository extends JpaRepository<CompanyKnowsCompany, String> {
    List<CompanyKnowsCompany> findAllByCompanyACompanyName(String companyAName);
    List<CompanyKnowsCompany> findAllByCompanyBCompanyName(String companyBName);
}
