package ch.supsi.model;

import ch.supsi.model.company.Company;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class User {

    @Id
    private String email;

    @Column
    private String firstname;

    @Column
    private String lastname;

    @Column
    private String address1;

    @Column
    private String address2;

    @Column
    private String zip;

    @Column
    private String city;

    @ManyToOne
    private Country country;

    @Column
    private String phone;

    @Column
    private String language;

    @Column
    private String department;

    @Column
    private String subDepartment;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column
    private String state;

    @Column
    private Date registrationDate;

    @Column
    private Date lastEditDate;

    @ManyToOne
    private Company company;

    public enum Role {
        ADMIN, OPERATOR, PARTNER
    }

    public User(String email, String firstname, String lastname, Company company){
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.company = company;
    }
}
