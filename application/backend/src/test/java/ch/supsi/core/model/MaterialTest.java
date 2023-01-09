package ch.supsi.core.model;

import ch.supsi.model.Material;
import ch.supsi.model.ProductCategory;
import ch.supsi.model.company.Company;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class MaterialTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        Material material = new Material();
        assertNull(material.getId());
        assertNull(material.getName());
        assertNull(material.getCompany());
        assertNull(material.getProductCategory());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        Material material = new Material();
        material.setId(2L);
        assertEquals(material.getId(), Long.valueOf(2L));
        material.setName("CP name");
        assertEquals(material.getName(), "CP name");
        Company company = new Company();
        material.setCompany(company);
        assertEquals(material.getCompany(), company);
        ProductCategory productCategory = new ProductCategory();
        material.setProductCategory(productCategory);
        assertEquals(material.getProductCategory(), productCategory);
    }
}
