package ch.supsi.model.transaction.certification.assessment_type;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;

@Entity(name = "UN_third_party_assessment_type")
@Getter @Setter
public class ThirdPartyAssessmentType extends AssessmentTypeRoot {

    public ThirdPartyAssessmentType() {
    }

    public ThirdPartyAssessmentType(String name) {
        super(name);
    }
}
