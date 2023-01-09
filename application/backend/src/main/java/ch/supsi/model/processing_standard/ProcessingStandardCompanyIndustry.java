package ch.supsi.model.processing_standard;

import ch.supsi.model.company.CompanyIndustry;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import javax.persistence.*;
import java.util.Objects;

@Entity(name = "UN_processing_standard_company_industry")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@IdClass(ProcessingStandardCompanyIndustryId.class)
public class ProcessingStandardCompanyIndustry {

    @Id
    @ManyToOne
    @JoinColumn(name = "processing_standard_name", referencedColumnName = "name")
    private ProcessingStandard processingStandard;

    @Id
    @ManyToOne
    @JoinColumn(name = "company_industry_name", referencedColumnName = "name")
    private CompanyIndustry companyIndustry;

    // used for test purpose
    public ProcessingStandardCompanyIndustry(ProcessingStandardRoot processingStandardRoot, CompanyIndustry companyIndustry){
        this.processingStandard = new ProcessingStandard();
        BeanUtils.copyProperties(processingStandardRoot, this.processingStandard);
        this.companyIndustry = companyIndustry;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProcessingStandardCompanyIndustry that = (ProcessingStandardCompanyIndustry) o;
        return Objects.equals(processingStandard, that.processingStandard) && Objects.equals(companyIndustry, that.companyIndustry);
    }

    @Override
    public int hashCode() {
        return Objects.hash(processingStandard, companyIndustry);
    }
}
