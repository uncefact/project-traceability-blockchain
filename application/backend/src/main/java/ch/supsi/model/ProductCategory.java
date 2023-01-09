package ch.supsi.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Entity(name = "UN_product_category")
@NoArgsConstructor @AllArgsConstructor @Getter @Setter
public class ProductCategory {

    @Id
    @Column(length = 6)
    @Size(max = 6)
    private String code;

    private String name;

    public ProductCategory(String name){
        this.name = name;
    }

}
