package ch.supsi.model.transaction.certification.assessment_type;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity(name = "UN_self_certification_assessment_type")
@Getter @Setter
public class SelfCertificationAssessmentType extends AssessmentTypeRoot {

    public SelfCertificationAssessmentType(String name){
        super(name);
    }

    public SelfCertificationAssessmentType() {
        super();
    }
}
