package ch.supsi.model.position;

import ch.supsi.model.Material;
import ch.supsi.model.transformation_plan.TransformationPlan;
import ch.supsi.model.Unit;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@Getter
@Setter
public class TransformationPlanPosition extends Position {
    @ManyToOne
    private TransformationPlan transformationPlan;

    public TransformationPlanPosition() {
        super();
    }

    public TransformationPlanPosition(Material material, Double quantity, TransformationPlan transformationPlan) {
        super(material, quantity, null, null, null);
        this.setConsigneeMaterial(material);
        this.transformationPlan = transformationPlan;
    }

    public boolean isIn(){
        return this.getContractorMaterial().isInput();
    }

    public TransformationPlanPosition(Long id, Material contractorMaterial, Material consigneeMaterial, Double weight, Double quantity, String externalDescription, Unit unit, TransformationPlan transformationPlan) {
        super(id, contractorMaterial, consigneeMaterial, weight, quantity, externalDescription, unit);
        this.transformationPlan = transformationPlan;
    }
}
