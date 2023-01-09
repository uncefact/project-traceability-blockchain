package ch.supsi.model.transaction.certification;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Entity(name = "UN_scope_certification_document_type")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ScopeCertificationDocumentType {

    @Id
    @Column(length = 3)
    @Size(max = 3)
    private String code;
}
