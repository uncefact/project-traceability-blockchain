package ch.supsi.model.processing_standard;

import ch.supsi.model.SustainabilityCriterion;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;

@Entity(name = "UN_material_referenced_standard")
@Getter @Setter
public class MaterialCertificationReferencedStandard extends ProcessingStandardRoot {

    public MaterialCertificationReferencedStandard(){ super(); }

    public MaterialCertificationReferencedStandard(String name, String logoPath, String siteUrl, SustainabilityCriterion sustainabilityCriterion){ super(name, logoPath, siteUrl, sustainabilityCriterion); }
}
