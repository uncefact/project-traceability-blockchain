package ch.supsi.model.transaction;

import ch.supsi.model.company.Company;
import ch.supsi.model.Document;
import ch.supsi.model.DocumentType;
import ch.supsi.model.processing_standard.ProcessingStandard;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import javax.persistence.*;
import java.util.Date;

@MappedSuperclass
@Getter @Setter @NoArgsConstructor
public abstract class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contractorReferenceNumber;

    private String consigneeReferenceNumber;

    @ManyToOne
    private Company contractor;

    @ManyToOne
    private Company consignee;

    @ManyToOne
    private Company approver;

    private String contractorEmail;

    private String consigneeEmail;

    private Date validFrom;

    private Date validUntil;

    @OneToOne
    private Document document;

    @ManyToOne
    private DocumentType documentType;

    private String notes;

    private Date consigneeDate;

    private Date contractorDate;

    private TransactionStatus status;

    @ManyToOne
    private ProcessingStandard processingStandard;

    public Transaction(String contractorReferenceNumber, Company consignee, Company contractor, DocumentType documentType){
        this.contractorReferenceNumber = contractorReferenceNumber;
        this.consignee = consignee;
        this.contractor = contractor;
        this.documentType = documentType;
    }

    public Transaction(String contractorReferenceNumber, Company consignee, Company contractor, DocumentType documentType, Document document){
        this.contractorReferenceNumber = contractorReferenceNumber;
        this.consignee = consignee;
        this.contractor = contractor;
        this.documentType = documentType;
        this.document = document;
    }

    public Transaction(String contractorReferenceNumber, String consigneeReferenceNumber, Company contractor, Company consignee, Company approver, String contractorEmail, String consigneeEmail, ProcessingStandard processingStandard, Date validFrom, Date validUntil, Document document, DocumentType documentType, String notes, Date consigneeDate, Date contractorDate, TransactionStatus status) {
        this.contractorReferenceNumber = contractorReferenceNumber;
        this.consigneeReferenceNumber = consigneeReferenceNumber;
        this.contractor = contractor;
        this.consignee = consignee;
        this.approver = approver;
        this.contractorEmail = contractorEmail;
        this.consigneeEmail = consigneeEmail;
        this.processingStandard = processingStandard;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.document = document;
        this.documentType = documentType;
        this.notes = notes;
        this.consigneeDate = consigneeDate;
        this.contractorDate = contractorDate;
        this.status = status;
    }
}
