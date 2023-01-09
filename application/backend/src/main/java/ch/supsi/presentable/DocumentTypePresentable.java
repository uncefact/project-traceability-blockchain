package ch.supsi.presentable;

import ch.supsi.model.DocumentType;

public class DocumentTypePresentable extends UnecePresentable<DocumentType> {
    public DocumentTypePresentable(DocumentType presentable) {
        super(presentable);
    }

    public String getCode() { return this.presentable.getCode(); }

    public String getName() {
        return this.presentable.getName();
    }

}
