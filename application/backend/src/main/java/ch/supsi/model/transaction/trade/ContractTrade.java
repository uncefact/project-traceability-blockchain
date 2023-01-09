package ch.supsi.model.transaction.trade;

import ch.supsi.model.company.Company;
import ch.supsi.model.Document;
import ch.supsi.model.DocumentType;

import javax.persistence.Entity;

@Entity
public class ContractTrade extends Trade {

    public ContractTrade(String contractorReferenceNumber, Company consignee, Company contractor, DocumentType documentType) {
        super(contractorReferenceNumber, consignee, contractor, documentType);
    }

    public ContractTrade(Company consignee, Company contractor, Document document){
        super(consignee, contractor, document);
    }

    public ContractTrade() {
        super();
    }
}
