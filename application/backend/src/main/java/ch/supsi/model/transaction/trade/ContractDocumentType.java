package ch.supsi.model.transaction.trade;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Entity(name = "UN_contract_document_type")
@Getter
@NoArgsConstructor @AllArgsConstructor
public class ContractDocumentType {

    @Id
    @Column(length = 3)
    @Size(max = 3)
    private String code;

}
