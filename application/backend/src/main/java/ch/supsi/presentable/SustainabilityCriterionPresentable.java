package ch.supsi.presentable;

import ch.supsi.model.SustainabilityCriterion;

import java.util.List;

public class SustainabilityCriterionPresentable extends UnecePresentable<SustainabilityCriterion> {
    List<String> processingStandardNames;

    public SustainabilityCriterionPresentable(SustainabilityCriterion sustainabilityCriterion, List<String> processingStandardNames) {
        super(sustainabilityCriterion);
        this.processingStandardNames = processingStandardNames;
    }
    public String getName() { return this.presentable.getName(); }

    public List<String> getProcessingStandardNames() { return this.processingStandardNames; }
}
