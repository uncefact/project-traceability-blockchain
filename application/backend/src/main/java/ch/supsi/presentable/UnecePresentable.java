package ch.supsi.presentable;

public abstract class UnecePresentable<T> {

    protected T presentable;

    public UnecePresentable(T presentable){ this.presentable = presentable; }

    protected UnecePresentable() {
    }
}
