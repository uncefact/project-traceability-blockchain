package ch.supsi.model;

import ch.supsi.model.company.Company;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"name", "company_eth_address","is_input"}))
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "company_eth_address")
    private Company company;

    @ManyToOne
    private ProductCategory productCategory;

    @Column(name = "is_input")
    private boolean isInput;

    public Material(String name, Company company, boolean isInput){
        this.name = name;
        this.company = company;
        this.isInput = isInput;
    }

}
