package ch.supsi.presentable;

import ch.supsi.model.TraceabilityLevel;

public class TraceabilityLevelPresentable extends UnecePresentable<TraceabilityLevel> {
    public TraceabilityLevelPresentable(TraceabilityLevel presentable) {
        super(presentable);
    }

    public String getName() { return this.presentable.getName(); }
}
