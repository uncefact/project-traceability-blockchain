package ch.supsi.model.processing_standard;

import java.io.Serializable;
import java.util.Objects;

public class ProcessingStandardCompanyIndustryId implements Serializable {

    private String processingStandard;
    private String companyIndustry;

    public ProcessingStandardCompanyIndustryId(){}

    public ProcessingStandardCompanyIndustryId(String processingStandard, String companyIndustry) {
        this.processingStandard = processingStandard;
        this.companyIndustry = companyIndustry;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProcessingStandardCompanyIndustryId that = (ProcessingStandardCompanyIndustryId) o;
        return Objects.equals(processingStandard, that.processingStandard) && Objects.equals(companyIndustry, that.companyIndustry);
    }

    @Override
    public int hashCode() {
        return Objects.hash(processingStandard, companyIndustry);
    }
}
