package ch.supsi.model.company;

import ch.supsi.model.Country;
import ch.supsi.model.CustodialWalletCredentials;
import ch.supsi.model.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.Objects;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    private String ethAddress;

    @Column(unique=true)
    private String companyName;

    @Column(nullable = false, unique = true)
    private String companyCode;

    // potrebbe diventare la nuova primary key
    @Column
    private String GS1Id;

    @ManyToOne
    private Role partnerType;

    @Column
    private Integer visibilityLevel;

    @Column
    private String companyDivision;

    @Column
    private String address1;

    @Column
    private String address2;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column
    private String website;

    @Column
    private String logo;

    @Column
    private String companyEmail;

    @Column
    private String companyPhone;

    @Column
    private String zip;

    @Column
    private String city;

    @ManyToOne
    private Country country;

    @Column
    private String state;

    @Column
    private Date registrationDate;

    @Column
    private Date lastEditDate;

    @ManyToOne
    private Company companyHead;

    @OneToOne
    private CustodialWalletCredentials custodialWalletCredentials;

    @ManyToOne
    private CompanyIndustry companyIndustry;

    public Company(String companyName, String companyCode){
        this.companyName = companyName;
        this.companyCode = companyCode;
    }

    public Company(String ethAddress, String companyName, Role partnerType, String companyCode){
        this.ethAddress = ethAddress;
        this.companyName = companyName;
        this.partnerType = partnerType;
        this.companyCode = companyCode;
    }

    public Company(String ethAddress, String companyName, String companyCode, CompanyIndustry companyIndustry){
        this.ethAddress = ethAddress;
        this.companyName = companyName;
        this.companyCode = companyCode;
        this.companyIndustry = companyIndustry;
    }

    public Company(String ethAddress, String companyName, String companyCode, CompanyIndustry companyIndustry, CustodialWalletCredentials custodialWalletCredentials){
        this.ethAddress = ethAddress;
        this.companyName = companyName;
        this.companyCode = companyCode;
        this.companyIndustry = companyIndustry;
        this.custodialWalletCredentials = custodialWalletCredentials;
    }

    public Company(String ethAddress, String companyName, String companyCode, CompanyIndustry companyIndustry, CustodialWalletCredentials custodialWalletCredentials, Role role){
        this.ethAddress = ethAddress;
        this.companyName = companyName;
        this.companyCode = companyCode;
        this.companyIndustry = companyIndustry;
        this.custodialWalletCredentials = custodialWalletCredentials;
        this.partnerType = role;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Company)) return false;
        Company company = (Company) o;
        return Objects.equals(ethAddress, company.ethAddress) && Objects.equals(companyName, company.companyName) && Objects.equals(companyCode, company.companyCode) && Objects.equals(GS1Id, company.GS1Id) && Objects.equals(partnerType, company.partnerType) && Objects.equals(visibilityLevel, company.visibilityLevel) && Objects.equals(companyDivision, company.companyDivision) && Objects.equals(address1, company.address1) && Objects.equals(address2, company.address2) && Objects.equals(latitude, company.latitude) && Objects.equals(longitude, company.longitude) && Objects.equals(website, company.website) && Objects.equals(logo, company.logo) && Objects.equals(companyEmail, company.companyEmail) && Objects.equals(companyPhone, company.companyPhone) && Objects.equals(zip, company.zip) && Objects.equals(city, company.city) && Objects.equals(country, company.country) && Objects.equals(state, company.state) && Objects.equals(registrationDate, company.registrationDate) && Objects.equals(lastEditDate, company.lastEditDate) && Objects.equals(companyHead, company.companyHead) && Objects.equals(custodialWalletCredentials, company.custodialWalletCredentials);
    }

    @Override
    public int hashCode() {
        return Objects.hash(companyName, companyCode, GS1Id, partnerType, visibilityLevel, companyDivision, address1, address2, latitude, longitude, website, logo, companyEmail, companyPhone, zip, city, country, state, registrationDate, lastEditDate, companyHead, custodialWalletCredentials);
    }


}
