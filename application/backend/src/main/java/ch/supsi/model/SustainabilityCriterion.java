package ch.supsi.model;

import ch.supsi.model.company.CompanyIndustry;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity (name = "UN_sustainability_criterion")
@NoArgsConstructor @AllArgsConstructor
@Getter @Setter
public class SustainabilityCriterion {
    @Id
    private String name;

    @ManyToMany
    @JoinTable(
            name = "un_sustainability_criterion_company_industry",
            joinColumns = @JoinColumn(name = "sustainabilityCriterion_name"),
            inverseJoinColumns = @JoinColumn(name = "companyIndustry_name"))
    private Set<CompanyIndustry> companyIndustries;

}
