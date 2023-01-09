package ch.supsi.presentable;

import ch.supsi.model.Material;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @NoArgsConstructor
public class MaterialPresentable {

    private Long id;
    private String name;
    private Boolean isInput;

    public MaterialPresentable(Material material){
        this.id = material.getId();
        this.name = material.getName();
        this.isInput = material.isInput();
    }

}
