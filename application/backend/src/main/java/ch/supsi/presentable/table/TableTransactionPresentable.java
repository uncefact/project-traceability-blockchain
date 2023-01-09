package ch.supsi.presentable.table;

import ch.supsi.model.transaction.Transaction;
import ch.supsi.model.transaction.TransactionStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@NoArgsConstructor
public class TableTransactionPresentable {

    private Long id;
    private String contractorName;
    private String consigneeName;
    private String approverName;
    private Date validFrom;
    private Date validUntil;
    private String documentType;
    private TransactionStatus status;

    public TableTransactionPresentable(Transaction transaction){
        this.id = transaction.getId();
        this.contractorName = transaction.getContractor() != null ? transaction.getContractor().getCompanyName() : null;
        this.consigneeName = transaction.getConsignee() != null ? transaction.getConsignee().getCompanyName() : null;
        this.approverName = transaction.getApprover() != null ? transaction.getApprover().getCompanyName() : null;
        this.validFrom = transaction.getValidFrom();
        this.validUntil = transaction.getValidUntil();
        this.documentType = transaction.getDocumentType() != null ? transaction.getDocumentType().getCode() + " - " + transaction.getDocumentType().getName() : "";
        this.status = transaction.getStatus();
    }
}
