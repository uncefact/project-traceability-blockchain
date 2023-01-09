package ch.supsi.model.transaction.trade;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Entity(name = "UN_order_document_type")
@Getter
@NoArgsConstructor @AllArgsConstructor
public class OrderDocumentType {

    @Id
    @Column(length = 3)
    @Size(max = 3)
    private String code;

}
