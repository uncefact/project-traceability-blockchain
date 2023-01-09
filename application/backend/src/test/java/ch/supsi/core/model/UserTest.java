package ch.supsi.core.model;

import ch.supsi.model.company.Company;
import ch.supsi.model.Country;
import ch.supsi.model.User;

import java.util.Date;

import static org.junit.Assert.*;

public class UserTest extends ModelTestTemplate {

    @Override
    public void testConstructor() {
        User user = new User();
        assertNull(user.getEmail());
        assertNull(user.getFirstname());
        assertNull(user.getLastname());
        assertNull(user.getAddress1());
        assertNull(user.getAddress2());
        assertNull(user.getZip());
        assertNull(user.getCity());
        assertNull(user.getCountry());
        assertNull(user.getPhone());
        assertNull(user.getLanguage());
        assertNull(user.getDepartment());
        assertNull(user.getSubDepartment());
        assertNull(user.getRole());
        assertNull(user.getState());
        assertNull(user.getRegistrationDate());
        assertNull(user.getLastEditDate());
        assertNull(user.getCompany());
    }

    @Override
    public void testGettersAndSetters() {
        User user = new User();
        user.setEmail("user@test.ch");
        assertEquals("user@test.ch", user.getEmail());
        user.setFirstname("name");
        assertEquals("name", user.getFirstname());
        user.setLastname("lastname");
        assertEquals("lastname", user.getLastname());
        user.setAddress1("address");
        assertEquals("address", user.getAddress1());
        user.setAddress2("address2");
        assertEquals("address2", user.getAddress2());
        user.setZip("zip");
        assertEquals("zip", user.getZip());
        user.setCity("city");
        assertEquals("city", user.getCity());
        Country country = new Country();
        user.setCountry(country);
        assertEquals(country, user.getCountry());
        user.setPhone("phone");
        assertEquals("phone", user.getPhone());
        user.setLanguage("ita");
        assertEquals("ita", user.getLanguage());
        user.setDepartment("department1");
        assertEquals("department1", user.getDepartment());
        user.setSubDepartment("subdepartment");
        assertEquals("subdepartment", user.getSubDepartment());
        user.setRole(User.Role.ADMIN);
        assertEquals(User.Role.ADMIN, user.getRole());
        user.setState("switzerland");
        assertEquals("switzerland", user.getState());
        Date date = new Date();
        user.setRegistrationDate(date);
        assertEquals(date, user.getRegistrationDate());
        user.setLastEditDate(date);
        assertEquals(date, user.getLastEditDate());
        Company company = new Company();
        user.setCompany(company);
        assertEquals(company, user.getCompany());

    }
}
