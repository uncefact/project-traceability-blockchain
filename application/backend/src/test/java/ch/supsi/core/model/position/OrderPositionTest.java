package ch.supsi.core.model.position;

import ch.supsi.model.Material;
import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.position.ContractPosition;
import ch.supsi.model.position.OrderPosition;
import ch.supsi.model.transaction.trade.OrderTrade;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class OrderPositionTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        OrderPosition position = new OrderPosition();
        assertNull(position.getId());
        assertNull(position.getQuantity());
        assertNull(position.getContractPosition());
        assertNull(position.getConsigneeMaterial());
        assertNull(position.getContractorMaterial());
        assertNull(position.getExternalDescription());
        assertNull(position.getOrderTrade());
        assertNull(position.getWeight());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        OrderPosition orderPosition = new OrderPosition();
        orderPosition.setId(3L);
        assertEquals(orderPosition.getId(), Long.valueOf(3L));
        orderPosition.setQuantity(7.8);
        assertEquals(orderPosition.getQuantity(), Double.valueOf(7.8));
        ContractPosition contractPosition = new ContractPosition();
        orderPosition.setContractPosition(contractPosition);
        assertEquals(orderPosition.getContractPosition(), contractPosition);
        Material material = new Material();
        orderPosition.setContractorMaterial(material);
        assertEquals(orderPosition.getContractorMaterial(), material);
        material.setName("consignee material");
        orderPosition.setConsigneeMaterial(material);
        assertEquals("consignee material", orderPosition.getConsigneeMaterial().getName());
        orderPosition.setExternalDescription("description");
        assertEquals(orderPosition.getExternalDescription(), "description");
        OrderTrade trade = new OrderTrade();
        orderPosition.setOrderTrade(trade);
        assertEquals(orderPosition.getOrderTrade(), trade);
        orderPosition.setWeight(110.1);
        assertEquals(Double.valueOf(110.1), orderPosition.getWeight());
    }
}
