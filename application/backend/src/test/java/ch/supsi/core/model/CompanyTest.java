package ch.supsi.core.model;

import ch.supsi.model.company.Company;
import ch.supsi.model.Country;
import ch.supsi.model.CustodialWalletCredentials;
import ch.supsi.model.Role;

import java.util.Date;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class CompanyTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        Company company = new Company();
        assertNull(company.getCompanyCode());
        assertNull(company.getGS1Id());
        assertNull(company.getCompanyName());
        assertNull(company.getPartnerType());
        assertNull(company.getVisibilityLevel());
        assertNull(company.getCompanyDivision());
        assertNull(company.getAddress1());
        assertNull(company.getAddress2());
        assertNull(company.getLatitude());
        assertNull(company.getLongitude());
        assertNull(company.getWebsite());
        assertNull(company.getLogo());
        assertNull(company.getCompanyEmail());
        assertNull(company.getCompanyPhone());
        assertNull(company.getZip());
        assertNull(company.getCity());
        assertNull(company.getCountry());
        assertNull(company.getState());
        assertNull(company.getRegistrationDate());
        assertNull(company.getLastEditDate());
        assertNull(company.getCompanyHead());
        assertNull(company.getCustodialWalletCredentials());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        Company company = new Company();
        company.setCompanyCode("code");
        assertEquals("code", company.getCompanyCode());
        company.setGS1Id("gs1id");
        assertEquals("gs1id", company.getGS1Id());
        company.setCompanyName("name");
        assertEquals("name", company.getCompanyName());
        Role role = new Role("typeTest", null);
        company.setPartnerType(role);
        assertEquals(role.getName(), "typeTest");
        company.setVisibilityLevel(0);
        assertEquals(Integer.valueOf(0), company.getVisibilityLevel());
        company.setCompanyDivision("division");
        assertEquals("division", company.getCompanyDivision());
        company.setAddress1("address");
        assertEquals("address", company.getAddress1());
        company.setAddress2("address2");
        assertEquals("address2", company.getAddress2());
        company.setLatitude(41.40338);
        assertEquals(41.40338, company.getLatitude(), 0);
        company.setLongitude(2.17403);
        assertEquals(2.17403, company.getLongitude(), 0);
        company.setWebsite("Website");
        assertEquals("Website", company.getWebsite());
        company.setLogo("logo");
        assertEquals("logo", company.getLogo());
        company.setCompanyEmail("email");
        assertEquals("email", company.getCompanyEmail());
        company.setCompanyPhone("123456789");
        assertEquals("123456789", company.getCompanyPhone());
        company.setZip("Zip");
        assertEquals("Zip", company.getZip());
        company.setCity("City");
        assertEquals("City", company.getCity());
        Country country = new Country();
        company.setCountry(country);
        assertEquals(country, company.getCountry());
        company.setState("state");
        assertEquals("state", company.getState());
        Date date = new Date();
        company.setRegistrationDate(date);
        assertEquals(date, company.getRegistrationDate());
        company.setLastEditDate(date);
        assertEquals(date, company.getLastEditDate());
        Company companyHead = new Company();
        company.setCompanyHead(companyHead);
        assertEquals(companyHead, company.getCompanyHead());
        CustodialWalletCredentials custodialWalletCredentials = new CustodialWalletCredentials();
        company.setCustodialWalletCredentials(custodialWalletCredentials);
        assertEquals(custodialWalletCredentials, company.getCustodialWalletCredentials());
    }
}
