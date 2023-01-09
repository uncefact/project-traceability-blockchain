package ch.supsi.presentable;

import ch.supsi.model.ProcessType;
import ch.supsi.model.ProductCategory;
import ch.supsi.model.transformation_plan.TransformationPlan;
import ch.supsi.model.processing_standard.ProcessingStandard;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class TransformationPlanPresentable extends UnecePresentable<TransformationPlan> {
    private List<PositionPresentable> inputPositions;
    private MaterialPresentable outputMaterial;
    private List<ProcessTypePresentable> processTypeList;
    private List<ProcessingStandardPresentable> processingStandardList;
    private ProductCategory productCategory;

    public TransformationPlanPresentable(TransformationPlan transformationPlan, List<PositionPresentable> inputPositions, MaterialPresentable outputMaterial){
        super(transformationPlan);
        this.inputPositions = inputPositions;
        this.outputMaterial = outputMaterial;
        this.processTypeList = null;
        this.processingStandardList = null;
    }

    public TransformationPlanPresentable(TransformationPlan transformationPlan,
                                         List<PositionPresentable> inputPositions,
                                         MaterialPresentable outputMaterial,
                                         List<ProcessType> processTypeList,
                                         List<ProcessingStandard> processingStandardList,
                                         ProductCategory productCategory) {
        super(transformationPlan);
        this.inputPositions = inputPositions;
        this.outputMaterial = outputMaterial;
        this.processTypeList = processTypeList.stream().map(ProcessTypePresentable::new).collect(Collectors.toList());
        this.processingStandardList = processingStandardList.stream().map(ProcessingStandardPresentable::new).collect(Collectors.toList());
        this.productCategory = productCategory;
    }

    public Long getId() {
        return this.presentable.getId();
    }

    public String getName() {
        return this.presentable.getName();
    }

    public Date getCreationDate() { return this.presentable.getCreationDate(); }

    public MaterialPresentable getOutputMaterial() {
        return outputMaterial;
    }

    public List<PositionPresentable> getInputPositions(){
        return inputPositions;
    }

    public List<ProcessTypePresentable> getProcessTypeList() {
        return processTypeList;
    }

    public List<ProcessingStandardPresentable> getProcessingStandardList() { return processingStandardList; }

    public ProductCategory getProductCategory() { return productCategory; }

    public Date getValidFrom() { return this.presentable.getValidFrom(); }

    public Date getValidUntil() { return this.presentable.getValidUntil(); }

    public String getNotes() { return this.presentable.getNotes(); }

    public String getTraceabilityLevel() { return this.presentable.getTraceabilityLevel().getName(); }

    public String getTransparencyLevel() { return this.presentable.getTransparencyLevel().getName(); }
}
