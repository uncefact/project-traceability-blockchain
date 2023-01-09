package ch.supsi.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity(name = "UN_traceability_level")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TraceabilityLevel {
    @Id
    private String name;

    // Tracebility Level are ordered trough an incremental name (1 - name,2 - name, ...)
    public boolean isMoreRestrictiveThan(TraceabilityLevel traceabilityLevel){
        return Integer.parseInt(String.valueOf(this.getName().charAt(0))) < Integer.parseInt(String.valueOf(traceabilityLevel.getName().charAt(0)));
    }
}
