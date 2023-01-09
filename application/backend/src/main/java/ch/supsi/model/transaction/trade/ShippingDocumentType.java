package ch.supsi.model.transaction.trade;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Entity(name = "UN_shipping_document_type")
@Getter
@NoArgsConstructor @AllArgsConstructor
public class ShippingDocumentType {

    @Id
    @Column(length = 3)
    @Size(max = 3)
    private String code;
}
