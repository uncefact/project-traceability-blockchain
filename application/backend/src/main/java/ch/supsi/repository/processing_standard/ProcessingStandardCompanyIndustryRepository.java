package ch.supsi.repository.processing_standard;

import ch.supsi.model.processing_standard.ProcessingStandardCompanyIndustry;
import ch.supsi.model.processing_standard.ProcessingStandardCompanyIndustryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProcessingStandardCompanyIndustryRepository extends JpaRepository<ProcessingStandardCompanyIndustry, ProcessingStandardCompanyIndustryId> {

    @Query("SELECT processingStandard.name FROM UN_processing_standard_company_industry WHERE companyIndustry.name = :companyIndustryName")
    List<String> findProcessingStandardNamesByCompanyIndustryName(String companyIndustryName);

}
