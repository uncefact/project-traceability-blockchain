package ch.supsi.request.transaction.trade;

import ch.supsi.exception.UneceException;
import ch.supsi.model.position.OrderPosition;
import ch.supsi.request.DocumentRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter @Setter
public class OrderRequest extends TradeRequest {

    private String contractorRootReferenceNumber;
    private List<OrderPosition> positions;

    @Override
    public void validate() throws UneceException {
        super.validate();
        notNull(positions, "positions");
    }

    public OrderRequest(String consigneeCompanyName, String consigneeEmail, Date validFrom, Date validUntil, String documentTypeCode, DocumentRequest documentUpload,
                        String processingStandardName, String notes, String contractorReferenceNumber, String contractorRootReferenceNumber, List<OrderPosition> positions, boolean isInvitation) {
        super(consigneeCompanyName, consigneeEmail, validFrom, validUntil, documentTypeCode, documentUpload, processingStandardName, notes, contractorReferenceNumber, isInvitation);
        this.contractorRootReferenceNumber = contractorRootReferenceNumber;
        this.positions = positions;
    }
}
