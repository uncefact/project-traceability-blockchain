package ch.supsi.model.processing_standard;

import ch.supsi.model.SustainabilityCriterion;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;

@Entity(name = "UN_processing_standard")
@Getter @Setter
public class ProcessingStandard extends ProcessingStandardRoot{

    public ProcessingStandard() { super(); }

    public ProcessingStandard(String name) {
        super(name);
    }

    public ProcessingStandard(String name, final String logoPath, final String siteUrl, SustainabilityCriterion sustainabilityCriterion){
        super(name, logoPath, siteUrl, sustainabilityCriterion);
    }
}
