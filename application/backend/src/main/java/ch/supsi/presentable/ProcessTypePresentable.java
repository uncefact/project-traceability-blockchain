package ch.supsi.presentable;

import ch.supsi.model.ProcessType;

public class ProcessTypePresentable extends UnecePresentable<ProcessType> {

    public ProcessTypePresentable(ProcessType processType){
        super(processType);
    }

    public String getCode() { return this.presentable.getCode(); }

    public String getName() { return this.presentable.getName(); }
}
