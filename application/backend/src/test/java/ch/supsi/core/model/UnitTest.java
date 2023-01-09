package ch.supsi.core.model;

import ch.supsi.model.Unit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class UnitTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        Unit unit = new Unit();
        assertNull(unit.getCode());
        assertNull(unit.getName());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        Unit unit = new Unit();
        unit.setCode("123");
        assertEquals(unit.getCode(), "123");
        unit.setName("kg");
        assertEquals(unit.getName(), "kg");
    }
}
