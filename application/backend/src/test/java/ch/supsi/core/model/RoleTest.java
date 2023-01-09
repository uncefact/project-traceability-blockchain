package ch.supsi.core.model;

import ch.supsi.model.Role;
import ch.supsi.model.company.CompanyIndustry;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class RoleTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        Role role = new Role();
        assertNull(role.getName());
        assertNull(role.getCompanyIndustries());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        Role role = new Role();
        role.setName("Role");
        assertEquals(role.getName(), "Role");
        Set<CompanyIndustry> companyIndustries = new HashSet<>(Collections.singletonList(new CompanyIndustry("industryTest")));
        role.setCompanyIndustries(companyIndustries);
        assertEquals(companyIndustries, role.getCompanyIndustries());

    }
}
