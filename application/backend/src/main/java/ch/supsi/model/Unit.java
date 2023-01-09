package ch.supsi.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.Size;

@Entity (name = "UN_unit")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Unit {

    @Id
    @Column(length = 3)
    @Size(max = 3)
    private String code;

    private String name;

}
