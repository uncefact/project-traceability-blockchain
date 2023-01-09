package ch.supsi.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.Size;

@Entity(name = "UN_document_type")
@NoArgsConstructor @Getter @Setter
public class DocumentType {

    @Id
    @Column(length = 3)
    @Size(max = 3)
    private String code;

    @Column(length = 55)
    @Size(max = 55)
    private String name;

    private String description;

    public DocumentType(String code){
        this.code = code;
    }

    public DocumentType(String code, String name){
        this.code = code;
        this.name = name;
    }
}
