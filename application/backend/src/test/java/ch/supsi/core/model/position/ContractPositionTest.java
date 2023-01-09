package ch.supsi.core.model.position;

import ch.supsi.model.Material;
import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.Unit;
import ch.supsi.model.position.ContractPosition;
import ch.supsi.model.transaction.trade.ContractTrade;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class ContractPositionTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        ContractPosition position = new ContractPosition();
        assertNull(position.getId());
        assertNull(position.getQuantity());
        assertNull(position.getUnit());
        assertNull(position.getConsigneeMaterial());
        assertNull(position.getContractorMaterial());
        assertNull(position.getExternalDescription());
        assertNull(position.getContractTrade());
        assertNull(position.getWeight());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        ContractPosition contractPosition = new ContractPosition();
        contractPosition.setId(2L);
        assertEquals(contractPosition.getId(), Long.valueOf(2L));
        contractPosition.setQuantity(5.4);
        assertEquals(contractPosition.getQuantity(), Double.valueOf(5.4));
        Unit unit = new Unit();
        contractPosition.setUnit(unit);
        assertEquals(contractPosition.getUnit(), unit);
        Material material = new Material();
        contractPosition.setContractorMaterial(material);
        assertEquals(contractPosition.getContractorMaterial(), material);
        material.setName("consignee material");
        contractPosition.setConsigneeMaterial(material);
        assertEquals("consignee material", contractPosition.getConsigneeMaterial().getName());
        contractPosition.setExternalDescription("description");
        assertEquals(contractPosition.getExternalDescription(), "description");
        ContractTrade trade = new ContractTrade();
        contractPosition.setContractTrade(trade);
        assertEquals(contractPosition.getContractTrade(), trade);
        contractPosition.setWeight(140.2);
        assertEquals(Double.valueOf(140.2), contractPosition.getWeight());

    }
}
