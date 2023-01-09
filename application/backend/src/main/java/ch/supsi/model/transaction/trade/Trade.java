package ch.supsi.model.transaction.trade;

import ch.supsi.model.company.Company;
import ch.supsi.model.Document;
import ch.supsi.model.DocumentType;
import ch.supsi.model.transaction.Transaction;
import ch.supsi.model.transaction.certification.CertificationTransaction;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@MappedSuperclass
@Getter @Setter @NoArgsConstructor
public abstract class Trade extends Transaction {

//    TODO: da capire poi che ruolo avrà, es. se si può effettuare un conto lavoro direttamente su una shipping o
//     si deve già predisporre un contratto che lo preveda
//     Al momento esiste nel modello ma non viene utilizzata da nessun parte
    private Boolean isSubcontracting;

    // i.e. 1-5
    private Integer supplyChainVisibilityLevel;

    private Integer b2bLevel;

    private String documentApproval;

    private String processStandard;

    private Double processAmount;

    //     Al momento esiste nel modello ma non viene utilizzata da nessun parte
    private Boolean toBeContacted;

    // info per utenti esterni al sistema
    private String contactFirstName;

    private String contactLastName;

    private String contactPartnerName;

    private String contactEmail;

    @ManyToOne
    private CertificationTransaction certificationTransaction;

    public Trade(String contractorReferenceNumber, Company consignee, Company contractor, DocumentType documentType){
        super(contractorReferenceNumber, consignee, contractor, documentType);
    }

    public Trade(Company consignee, Company contractor, Document document){
        super(null, consignee, contractor, null, document);
    }

}

