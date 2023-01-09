package ch.supsi.service;

import ch.supsi.model.company.Company;
import ch.supsi.model.company.CompanyKnowsCompany;
import ch.supsi.repository.company.CompanyKnowsCompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyKnowsCompanyService {
    private final CompanyKnowsCompanyRepository companyKnowsCompanyRepository;

    @Autowired
    public CompanyKnowsCompanyService(CompanyKnowsCompanyRepository companyKnowsCompanyRepository) {
        this.companyKnowsCompanyRepository = companyKnowsCompanyRepository;
    }

    public List<Company> getKnownCompanies(Company company) {
        return companyKnowsCompanyRepository.findAllByCompanyACompanyName(company.getCompanyName())
                .parallelStream()
                .map(CompanyKnowsCompany::getCompanyB).distinct().collect(Collectors.toList());
    }
}
