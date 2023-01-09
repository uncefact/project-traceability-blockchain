package ch.supsi.model.transaction.trade;

import ch.supsi.model.company.Company;
import ch.supsi.model.DocumentType;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@Getter @Setter
public class ShippingTrade extends Trade {

    @ManyToOne
    private OrderTrade contractorParentReference;

    private String consigneeParentReferenceNumber;

    public ShippingTrade(String contractorReferenceNumber, Company consignee, Company contractor, OrderTrade contractorParentReference, DocumentType documentType) {
        super(contractorReferenceNumber, consignee, contractor, documentType);
        this.contractorParentReference = contractorParentReference;
    }

    public ShippingTrade() {
        super();
    }
}
