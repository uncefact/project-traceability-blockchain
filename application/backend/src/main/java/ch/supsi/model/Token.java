package ch.supsi.model;

import ch.supsi.model.company.Company;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@NoArgsConstructor
@AllArgsConstructor @Getter @Setter
public class Token {

    @Id
    private String tokenCode;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Company generatedBy;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Company company;

    public Token(Company generatedBy, Company company){
        this.generatedBy = generatedBy;
        this.company = company;
    }

}
