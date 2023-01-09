package ch.supsi.presentable;

import ch.supsi.model.transaction.certification.assessment_type.AssessmentTypeRoot;

public class AssessmentTypePresentable extends UnecePresentable<AssessmentTypeRoot> {

    public AssessmentTypePresentable(AssessmentTypeRoot assessmentType){
        super(assessmentType);
    }

    public String getName() { return this.presentable.getName(); }
}
