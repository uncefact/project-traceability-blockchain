package ch.supsi.model;

import ch.supsi.model.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.Set;

@Entity(name = "UN_process_type")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProcessType {

    @Id
    @Column(length = 6, name = "code")
    @Size(max = 6)
    private String code;

    private String name;

    @ManyToMany
    @JoinTable(
            name = "un_process_type_role",
            joinColumns = @JoinColumn(name = "process_type_code"),
            inverseJoinColumns = @JoinColumn(name = "role_name"))
    private Set<Role> roles;

}
