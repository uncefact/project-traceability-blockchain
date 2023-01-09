package ch.supsi.model.transformation_plan;

import ch.supsi.model.ProcessType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class TransformationPlanProcessType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn
    private TransformationPlan transformationPlan;

    @ManyToOne
    @PrimaryKeyJoinColumns({
            @PrimaryKeyJoinColumn(name = "process_type_code", referencedColumnName = "code"),
            @PrimaryKeyJoinColumn(name = "process_type_role", referencedColumnName = "role")
    })
    private ProcessType processType;

    public TransformationPlanProcessType(TransformationPlan transformationPlan, ProcessType processType) {
        this.transformationPlan = transformationPlan;
        this.processType = processType;
    }
}
