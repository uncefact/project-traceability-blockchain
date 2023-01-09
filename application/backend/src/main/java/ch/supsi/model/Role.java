package ch.supsi.model;

import ch.supsi.model.company.CompanyIndustry;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Entity (name = "UN_role")
@NoArgsConstructor @AllArgsConstructor
@Getter @Setter
public class Role {

    @Id
    private String name;

    @ManyToMany
    @JoinTable(
            name = "un_role_company_industry",
            joinColumns = @JoinColumn(name = "role_name"),
            inverseJoinColumns = @JoinColumn(name = "company_industry_name"))
    private Set<CompanyIndustry> companyIndustries;

}
