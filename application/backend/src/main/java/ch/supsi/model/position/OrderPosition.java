package ch.supsi.model.position;

import ch.supsi.model.Material;
import ch.supsi.model.Unit;
import ch.supsi.model.transaction.trade.OrderTrade;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@Getter @Setter
public class OrderPosition extends Position {

    @ManyToOne
    private ContractPosition contractPosition;

    @ManyToOne
    private OrderTrade orderTrade;

    public OrderPosition(Material material, Double quantity, Double weight, String externalDescription, Unit unit) {
        super(material, quantity, weight, externalDescription, unit);
    }

    public OrderPosition() {
        super();
    }
}
