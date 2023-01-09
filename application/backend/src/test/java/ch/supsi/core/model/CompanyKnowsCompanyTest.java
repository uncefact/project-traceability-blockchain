package ch.supsi.core.model;

import ch.supsi.model.company.Company;
import ch.supsi.model.company.CompanyKnowsCompany;

import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertEquals;

public class CompanyKnowsCompanyTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        Company companyA = new Company();
        Company companyB = new Company();

        CompanyKnowsCompany companyKnowsCompany = new CompanyKnowsCompany();
        assertNull(companyKnowsCompany.getCompanyA());
        assertNull(companyKnowsCompany.getCompanyB());

        CompanyKnowsCompany companyKnowsCompany2 = new CompanyKnowsCompany(companyA, companyB);
        assertEquals(companyKnowsCompany2.getCompanyA(), companyA);
        assertEquals(companyKnowsCompany2.getCompanyB(), companyB);
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        CompanyKnowsCompany companyKnowsCompany = new CompanyKnowsCompany();
        Company companyA = new Company();
        Company companyB = new Company();

        companyKnowsCompany.setCompanyA(companyA);
        assertEquals(companyKnowsCompany.getCompanyA(), companyA);
        companyKnowsCompany.setCompanyB(companyB);
        assertEquals(companyKnowsCompany.getCompanyB(), companyB);
    }
}
