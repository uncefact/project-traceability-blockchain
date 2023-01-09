package ch.supsi.presentable;

import ch.supsi.model.position.Position;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @NoArgsConstructor @AllArgsConstructor
public class PositionPresentable {

    private Long id;
    private String contractorMaterialName;
    private Long contractorMaterialId;
    private String consigneeMaterialName;
    private Long consigneeMaterialId;
    private Double quantity;
    private Double weight;
    private String externalDescription;
    private String unit;
    private String contractorSupplierName;

    public PositionPresentable(Position position) {
        this.id = position.getId();
        this.contractorMaterialName = position.getContractorMaterial().getName();
        this.contractorMaterialId = position.getContractorMaterial().getId();
        if(position.getConsigneeMaterial() != null) {
            this.consigneeMaterialName = position.getConsigneeMaterial().getName();
            this.consigneeMaterialId = position.getConsigneeMaterial().getId();
        }
        this.quantity = position.getQuantity();
        this.weight = position.getWeight();
        this.externalDescription = position.getExternalDescription();
        if (position.getUnit() != null)
            this.unit = position.getUnit().getCode() + " - " + position.getUnit().getName();
    }

    public PositionPresentable(Position position, String contractorSupplierName){
        this(position);
        this.contractorSupplierName = contractorSupplierName;
    }

}
