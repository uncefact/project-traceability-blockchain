package ch.supsi.presentable;

import ch.supsi.model.TransparencyLevel;

public class TransparencyLevelPresentable extends UnecePresentable<TransparencyLevel> {
    public TransparencyLevelPresentable(TransparencyLevel presentable) {
        super(presentable);
    }

    public String getName() { return this.presentable.getName(); }
}
