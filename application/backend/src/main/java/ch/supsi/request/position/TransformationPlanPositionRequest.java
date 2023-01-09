package ch.supsi.request.position;

import ch.supsi.exception.UneceException;
import ch.supsi.request.UneceRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransformationPlanPositionRequest extends UneceRequest {
    private Long contractorMaterialId;
    private Double quantity;

    public TransformationPlanPositionRequest(Long contractorMaterialId, Double quantity) {
        this.contractorMaterialId = contractorMaterialId;
        this.quantity = quantity;//Quantity is always in %
    }

    public TransformationPlanPositionRequest() {
    }

    @Override
    public void validate() throws UneceException {
        notNull(contractorMaterialId, "contractorMaterialId");
        notNull(quantity, "quantity");
    }
}
