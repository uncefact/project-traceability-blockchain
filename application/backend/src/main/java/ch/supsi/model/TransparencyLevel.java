package ch.supsi.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity(name = "UN_transparency_level")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TransparencyLevel {
    @Id
    private String name;

    public boolean isMoreRestrictiveThan(TransparencyLevel actualTransparencyLevel) {
        return Integer.parseInt(String.valueOf(this.getName().charAt(0))) < Integer.parseInt(String.valueOf(actualTransparencyLevel.getName().charAt(0)));
    }
}
