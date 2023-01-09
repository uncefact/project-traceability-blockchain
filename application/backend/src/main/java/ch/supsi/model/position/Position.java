package ch.supsi.model.position;

import ch.supsi.model.Material;
import ch.supsi.model.Unit;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@MappedSuperclass
@Getter @Setter
public abstract class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Material contractorMaterial;

    @ManyToOne
    private Material consigneeMaterial;

    private Double weight;

    private Double quantity;

    private String externalDescription;

    @ManyToOne
    private Unit unit;

    public Position(Material contractorMaterial, Double quantity, Double weight, String externalDescription, Unit unit) {
        this.contractorMaterial = contractorMaterial;
        this.quantity = quantity;
        this.weight = weight;
        this.externalDescription = externalDescription;
        this.unit = unit;
    }

    public Position() {

    }

    public Position(Long id, Material contractorMaterial, Material consigneeMaterial, Double weight, Double quantity, String externalDescription, Unit unit) {
        this.id = id;
        this.contractorMaterial = contractorMaterial;
        this.consigneeMaterial = consigneeMaterial;
        this.weight = weight;
        this.quantity = quantity;
        this.externalDescription = externalDescription;
        this.unit = unit;
    }
}
