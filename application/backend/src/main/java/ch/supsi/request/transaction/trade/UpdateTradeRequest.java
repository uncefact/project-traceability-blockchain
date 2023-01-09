package ch.supsi.request.transaction.trade;

import ch.supsi.exception.UneceException;
import ch.supsi.request.UneceRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UpdateTradeRequest extends UneceRequest {

    private String processingStandardName;
    private String tradeType;

    @Override
    public void validate() throws UneceException {
        notNull(tradeType, "tradeType");
    }
}
