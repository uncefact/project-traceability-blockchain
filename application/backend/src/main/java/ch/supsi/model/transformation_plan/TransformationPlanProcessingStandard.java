package ch.supsi.model.transformation_plan;

import ch.supsi.model.processing_standard.ProcessingStandard;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
@NoArgsConstructor
public class TransformationPlanProcessingStandard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "transformation_plan_id", referencedColumnName = "id")
    private TransformationPlan transformationPlan;

    @ManyToOne
    @JoinColumn(name = "processing_standard_id", referencedColumnName = "name")
    private ProcessingStandard processingStandard;

    public TransformationPlanProcessingStandard(TransformationPlan transformationPlan, ProcessingStandard processingStandard) {
        this.transformationPlan = transformationPlan;
        this.processingStandard = processingStandard;
    }
}
