package ch.supsi.core.model;

import ch.supsi.model.Country;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class CountryTest extends ModelTestTemplate {

    @Override
    public void testConstructor() throws Exception {
        Country country = new Country();
        assertNull(country.getCode());
        assertNull(country.getName());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        Country country = new Country();
        country.setCode("CH");
        assertEquals("CH", country.getCode());
        country.setName("Switzerland");
        assertEquals("Switzerland", country.getName());
    }
}
