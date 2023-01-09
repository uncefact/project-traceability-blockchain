package ch.supsi.model.processing_standard;

import ch.supsi.model.SustainabilityCriterion;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;

@Entity(name = "UN_self_certification_proprietary_standard")
@Getter @Setter
public class SelfCertificationProprietaryStandard extends ProcessingStandardRoot {

    public SelfCertificationProprietaryStandard(){ super(); }

    public SelfCertificationProprietaryStandard(String name) {
        super(name);
    }

    public SelfCertificationProprietaryStandard(String name, String logoPath, String siteUrl, SustainabilityCriterion sustainabilityCriterion) {
        super(name, logoPath, siteUrl, sustainabilityCriterion);
    }

}
