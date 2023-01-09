package ch.supsi.presentable.confirmation;

import ch.supsi.model.transaction.Transaction;
import ch.supsi.model.transaction.TransactionStatus;
import ch.supsi.presentable.DocumentPresentable;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@NoArgsConstructor
public abstract class ConfirmationTransactionPresentable {

    private Long id;
    private String contractorReferenceNumber;
    private String consigneeReferenceNumber;
    private String contractorName;
    private String consigneeName;
    private String approverName;
    private String contractorEmail;
    private String consigneeEmail;
    private Date validFrom;
    private Date validUntil;
    private Date contractorDate;
    private DocumentPresentable document;
    private String documentType;
    private String notes;
    private TransactionStatus status;
    private String processingStandardName;

    public ConfirmationTransactionPresentable(Transaction transaction) {
        this.id = transaction.getId();
        this.contractorReferenceNumber = transaction.getContractorReferenceNumber();
        this.consigneeReferenceNumber = transaction.getConsigneeReferenceNumber();
        this.contractorName = transaction.getContractor() != null ? transaction.getContractor().getCompanyName() : null;
        this.consigneeName = transaction.getConsignee() != null ? transaction.getConsignee().getCompanyName() : null;
        this.approverName = transaction.getApprover() != null ? transaction.getApprover().getCompanyName() : null;
        this.contractorEmail = transaction.getContractorEmail();
        this.consigneeEmail = transaction.getConsigneeEmail();
        this.validFrom = transaction.getValidFrom();
        this.validUntil = transaction.getValidUntil();
        this.document = transaction.getDocument() != null ? new DocumentPresentable(transaction.getDocument()) : null;
        this.documentType = transaction.getDocumentType() != null ? transaction.getDocumentType().getCode() + " - " + transaction.getDocumentType().getName() : "";
        this.notes = transaction.getNotes();
        this.status = transaction.getStatus();
        this.processingStandardName = transaction.getProcessingStandard() != null ? transaction.getProcessingStandard().getName() : null;
        this.contractorDate = transaction.getContractorDate();
    }
}
