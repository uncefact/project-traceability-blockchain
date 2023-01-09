package ch.supsi.model.position;

import ch.supsi.model.Material;
import ch.supsi.model.Unit;
import ch.supsi.model.transaction.trade.ContractTrade;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@Getter @Setter
public class ContractPosition extends Position {

    @ManyToOne
    private ContractTrade contractTrade;

    public ContractPosition() {
        super();
    }

    public ContractPosition(Material material, Double quantity, Double weight, String externalDescription, Unit unit) {
        super(material, quantity, weight, externalDescription, unit);
    }
}
