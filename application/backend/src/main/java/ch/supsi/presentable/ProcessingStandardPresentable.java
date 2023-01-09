package ch.supsi.presentable;

import ch.supsi.model.processing_standard.ProcessingStandardRoot;

public class ProcessingStandardPresentable extends UnecePresentable<ProcessingStandardRoot> {

    public ProcessingStandardPresentable(ProcessingStandardRoot processingStandard){
        super(processingStandard);
    }

    public String getName() { return this.presentable.getName(); }
}
