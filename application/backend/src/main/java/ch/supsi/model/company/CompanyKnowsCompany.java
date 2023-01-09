package ch.supsi.model.company;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(uniqueConstraints={
        @UniqueConstraint(columnNames = {"company_a_eth_address", "company_b_eth_address"})
})
public class CompanyKnowsCompany {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "company_a_eth_address")
    private Company companyA;

    @ManyToOne
    @JoinColumn(name = "company_b_eth_address")
    private Company companyB;

    public CompanyKnowsCompany(Company companyA, Company companyB) {
        this.companyA = companyA;
        this.companyB = companyB;
    }
}
