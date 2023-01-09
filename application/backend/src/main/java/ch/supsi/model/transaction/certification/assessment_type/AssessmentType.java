package ch.supsi.model.transaction.certification.assessment_type;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity(name = "UN_assessment_type")
@Getter @Setter
public class AssessmentType extends AssessmentTypeRoot {

    public AssessmentType(String name){
        super(name);
    }

    public AssessmentType() { super(); }

}
