package ch.supsi.repository.company;

import ch.supsi.model.company.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, String> {
    Company findByCompanyCode(String companyCode);
    Company findByCompanyName(String companyName);
    Company findByEthAddress(String ethAddress);
}
