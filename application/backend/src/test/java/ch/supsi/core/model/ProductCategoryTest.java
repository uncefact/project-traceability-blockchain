package ch.supsi.core.model;

import ch.supsi.model.ProductCategory;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class ProductCategoryTest extends ModelTestTemplate {

    @Override
    public void testConstructor() throws Exception {
        ProductCategory productCategory = new ProductCategory();
        assertNull(productCategory.getCode());
        assertNull(productCategory.getName());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        ProductCategory productCategory = new ProductCategory();
        productCategory.setCode("123");
        assertEquals("123", productCategory.getCode());
        productCategory.setName("Prod name");
        assertEquals(productCategory.getName(), "Prod name");

        ProductCategory productCategory1 = new ProductCategory("Product category 1");
        assertEquals("Product category 1", productCategory1.getName());
    }
}
