package ch.supsi.model.position;

import ch.supsi.model.Material;
import ch.supsi.model.Unit;
import ch.supsi.model.transaction.trade.ShippingTrade;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@Getter @Setter
public class ShippingPosition extends Position {

    @ManyToOne
    private ShippingTrade shippingTrade;

    @ManyToOne
    private OrderPosition orderPosition;

    public ShippingPosition(Material material, Double quantity, Double weight, String externalDescription, Unit unit) {
        super(material, quantity, weight, externalDescription, unit);
    }

    public ShippingPosition() {
        super();
    }
}
