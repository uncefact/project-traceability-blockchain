package ch.supsi.presentable;

import ch.supsi.model.Document;

import java.util.Base64;

public class DocumentPresentable extends UnecePresentable<Document> {

    public DocumentPresentable(Document presentable) {
        super(presentable);
    }

    public String getContent(){ return Base64.getEncoder().encodeToString(this.presentable.getContent()); }

    public Long getId(){ return this.presentable.getId(); }

    public String getFileName(){ return this.presentable.getFileName(); }

    public String getContentType(){
        return this.presentable.getContentType();
    }
}
