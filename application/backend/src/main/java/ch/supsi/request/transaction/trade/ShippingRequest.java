package ch.supsi.request.transaction.trade;

import ch.supsi.exception.UneceException;
import ch.supsi.model.position.ShippingPosition;
import ch.supsi.request.DocumentRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter @Setter
public class ShippingRequest extends TradeRequest {

    private String contractorParentReferenceNumber;
    private List<ShippingPosition> positions;

    @Override
    public void validate() throws UneceException {
        super.validate();
        notNull(positions, "positions");
    }

    public ShippingRequest(String consigneeCompanyName, String consigneeEmail, Date validFrom, Date validUntil, String documentTypeCode, DocumentRequest documentUpload,
                           String processingStandardName, String notes, String contractorReferenceNumber, String contractorParentReferenceNumber, List<ShippingPosition> positions, boolean isInvitation) {
        super(consigneeCompanyName, consigneeEmail, validFrom, validUntil, documentTypeCode, documentUpload, processingStandardName, notes, contractorReferenceNumber, isInvitation);
        this.contractorParentReferenceNumber = contractorParentReferenceNumber;
        this.positions = positions;
    }
}
