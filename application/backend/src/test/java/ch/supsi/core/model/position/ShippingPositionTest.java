package ch.supsi.core.model.position;

import ch.supsi.model.Material;
import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.position.OrderPosition;
import ch.supsi.model.position.ShippingPosition;
import ch.supsi.model.transaction.trade.ShippingTrade;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class ShippingPositionTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        ShippingPosition position = new ShippingPosition();
        assertNull(position.getId());
        assertNull(position.getQuantity());
        assertNull(position.getOrderPosition());
        assertNull(position.getConsigneeMaterial());
        assertNull(position.getContractorMaterial());
        assertNull(position.getExternalDescription());
        assertNull(position.getShippingTrade());
        assertNull(position.getWeight());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        ShippingPosition shippingPosition = new ShippingPosition();
        shippingPosition.setId(1L);
        assertEquals(shippingPosition.getId(), Long.valueOf(1L));
        shippingPosition.setQuantity(2.4);
        assertEquals(shippingPosition.getQuantity(), Double.valueOf(2.4));
        OrderPosition orderPosition = new OrderPosition();
        shippingPosition.setOrderPosition(orderPosition);
        assertEquals(shippingPosition.getOrderPosition(), orderPosition);
        Material material = new Material();
        shippingPosition.setContractorMaterial(material);
        assertEquals(shippingPosition.getContractorMaterial(), material);
        material.setName("consignee material");
        shippingPosition.setConsigneeMaterial(material);
        assertEquals("consignee material", shippingPosition.getConsigneeMaterial().getName());
        shippingPosition.setExternalDescription("description");
        assertEquals(shippingPosition.getExternalDescription(), "description");
        ShippingTrade trade = new ShippingTrade();
        shippingPosition.setShippingTrade(trade);
        assertEquals(shippingPosition.getShippingTrade(), trade);
        shippingPosition.setWeight(80.6);
        assertEquals(Double.valueOf(80.6), shippingPosition.getWeight());
    }
}
