package ch.supsi.presentable;

import ch.supsi.model.Role;
import ch.supsi.model.company.Company;

public class CompanyPresentable extends UnecePresentable<Company> {


    public CompanyPresentable(Company company) {
        super(company);
    }

    public String getCompanyName() {
        return this.presentable.getCompanyName();
    }

    public String getAddress() { return this.presentable.getAddress1(); }

    public String getEthAddress(){
        return this.presentable.getEthAddress();
    }

    public Role getRole() { return this.presentable.getPartnerType(); }

}
