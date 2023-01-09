package ch.supsi.request.transaction;

import ch.supsi.exception.UneceException;
import ch.supsi.model.transaction.TransactionStatus;
import ch.supsi.request.position.PositionRequest;
import ch.supsi.request.UneceRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class ConfirmationTransactionRequest extends UneceRequest {

    private String consigneeReferenceNumber;
    private String certificationReferenceNumber;
    private TransactionStatus transactionStatus;
    private Date consigneeDate;
    private List<PositionRequest> positions;

    @Override
    public void validate() throws UneceException {
        // consigneeReferenceNumber is null if the transaction is a certification
        if (consigneeReferenceNumber == null){
            isNull(positions, "positions");
            notNull(certificationReferenceNumber, "certificationReferenceNumber");
        }
        // otherwise the transaction is a trade
        else {
            notNull(positions, "positions");
            isNull(certificationReferenceNumber, "certificationReferenceNumber");
        }
        isNull(consigneeDate, "consigneeDate");
        notNull(transactionStatus, "tradeStatus");

    }
}
