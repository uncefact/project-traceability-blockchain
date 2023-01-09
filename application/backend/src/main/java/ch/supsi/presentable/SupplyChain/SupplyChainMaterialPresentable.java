package ch.supsi.presentable.SupplyChain;

import java.util.Objects;

public class SupplyChainMaterialPresentable {
    private String name;
    private Long id;

    public SupplyChainMaterialPresentable(String name, Long id) {
        this.name = name;
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Long getId() {
        return id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SupplyChainMaterialPresentable)) return false;
        SupplyChainMaterialPresentable that = (SupplyChainMaterialPresentable) o;
        return Objects.equals(name, that.name) && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, id);
    }
}
