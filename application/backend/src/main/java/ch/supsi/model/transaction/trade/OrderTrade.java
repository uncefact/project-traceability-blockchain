package ch.supsi.model.transaction.trade;

import ch.supsi.model.company.Company;
import ch.supsi.model.DocumentType;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@Getter @Setter
public class OrderTrade extends Trade {

    @ManyToOne
    private ContractTrade contractorRootReference;

    private String consigneeRootReferenceNumber;

    public OrderTrade(String contractorReferenceNumber, Company consignee, Company contractor, ContractTrade contractorRootReference, DocumentType documentType) {
        super(contractorReferenceNumber, consignee, contractor, documentType);
        this.contractorRootReference = contractorRootReference;
    }

    public OrderTrade() {
        super();
    }
}
