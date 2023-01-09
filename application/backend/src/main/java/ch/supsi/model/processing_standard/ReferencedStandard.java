package ch.supsi.model.processing_standard;

import ch.supsi.model.SustainabilityCriterion;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;

@Entity(name = "UN_referenced_standard")
@Getter @Setter
public class ReferencedStandard extends ProcessingStandardRoot {

    public ReferencedStandard() { super(); }

    public ReferencedStandard(String name, final String logoPath, final String siteUrl, SustainabilityCriterion sustainabilityCriterion){
        super(name, logoPath, siteUrl, sustainabilityCriterion);
    }
}
