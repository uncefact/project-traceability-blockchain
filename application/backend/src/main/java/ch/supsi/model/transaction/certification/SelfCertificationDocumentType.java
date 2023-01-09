package ch.supsi.model.transaction.certification;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.Size;

@Entity(name = "UN_self_certification_document_type")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class SelfCertificationDocumentType {

    @Id
    @Column(length = 3)
    @Size(max = 3)
    private String code;
}
