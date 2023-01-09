package ch.supsi.model.company;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity(name = "UN_company_industry")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyIndustry {

    @Id
    private String name;
}
