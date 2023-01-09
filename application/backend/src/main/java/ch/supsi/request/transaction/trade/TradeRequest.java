package ch.supsi.request.transaction.trade;

import ch.supsi.exception.UneceException;
import ch.supsi.request.DocumentRequest;
import ch.supsi.request.transaction.TransactionRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter @Setter
public abstract class TradeRequest extends TransactionRequest {
    private String contractorReferenceNumber;

    @Override
    public void validate() throws UneceException {
        super.validate();
        notNull(contractorReferenceNumber, "contractorReferenceNumber");
        notEmptyString(contractorReferenceNumber,"contractorReferenceNumber");
        notOnlyWitheSpace(contractorReferenceNumber,"contractorReferenceNumber");
    }

    public TradeRequest(String consigneeCompanyName, String consigneeEmail, Date validFrom, Date validUntil, String documentTypeCode, DocumentRequest documentUpload,
                        String processingStandardName, String notes, String contractorReferenceNumber, boolean isInvitation) {
        super(consigneeCompanyName, consigneeEmail, validFrom, validUntil, documentTypeCode, documentUpload, processingStandardName, notes, isInvitation);
        this.contractorReferenceNumber = contractorReferenceNumber;
    }

}
