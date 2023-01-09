package ch.supsi.model.transaction.certification.assessment_type;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
@Getter @Setter
@NoArgsConstructor
public abstract class AssessmentTypeRoot {

    @Id
    private String name;

    public AssessmentTypeRoot(String name){
        this.name = name;
    }
}
