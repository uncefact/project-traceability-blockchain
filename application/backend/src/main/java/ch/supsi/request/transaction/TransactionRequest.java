package ch.supsi.request.transaction;

import ch.supsi.exception.UneceException;
import ch.supsi.request.DocumentRequest;
import ch.supsi.request.UneceRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter @Setter
public abstract class TransactionRequest extends UneceRequest {
    private String consigneeCompanyName;
    private String consigneeEmail;

    private Date validFrom;
    private Date validUntil;

    private String documentTypeCode;
    private DocumentRequest documentUpload;
    private String processingStandardName;
    private String notes;

    // it is used to check if in the transaction insertion there is also an invitation of a company or user of the logged company
    private boolean isInvitation;

    @Override
    public void validate() throws UneceException {
        notNull(documentTypeCode, "documentTypeCode");
        notNull(documentUpload, "documentUpload");
        notNull(validFrom, "validFrom");
        notNull(notes, "notes");
        notNull(isInvitation, "isInvitation");
    }

    public TransactionRequest(String consigneeCompanyName, String consigneeEmail, Date validFrom, Date validUntil,
                              String documentTypeCode, DocumentRequest documentUpload, String processingStandardName,
                              String notes, boolean isInvitation) {
        this.consigneeCompanyName = consigneeCompanyName;
        this.consigneeEmail = consigneeEmail;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.documentTypeCode = documentTypeCode;
        this.documentUpload = documentUpload;
        this.processingStandardName = processingStandardName;
        this.notes = notes;
        this.isInvitation = isInvitation;
    }
}
