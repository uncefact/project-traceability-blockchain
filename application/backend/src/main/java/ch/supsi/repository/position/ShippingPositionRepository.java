package ch.supsi.repository.position;

import ch.supsi.model.company.Company;
import ch.supsi.model.Material;
import ch.supsi.model.position.Position;
import ch.supsi.model.position.ShippingPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShippingPositionRepository extends JpaRepository<ShippingPosition, Long> {

    @Query("SELECT sp FROM ShippingPosition sp WHERE sp.shippingTrade.id = :id")
    List<Position> findAllByShippingTradeId(Long id);

    List<Position> findAllByConsigneeMaterial(Material material);

    List<Position> findAllByContractorMaterial(Material material);

    List<Position> findAllByContractorMaterialAndShippingTradeConsignee(Material material, Company consignee);

    List<Position> findAllByIdIn(List<Long> ids);

    @Modifying
    @Query("UPDATE ShippingPosition sp SET sp.consigneeMaterial = :consigneeMaterial WHERE sp.id = :positionID")
    void updateShippingPosition(Long positionID, Material consigneeMaterial);

    @Query("SELECT sp.consigneeMaterial FROM ShippingPosition sp WHERE sp.contractorMaterial.id = :materialId")
    List<Material> findCachedConsigneeMaterials(Long materialId);

    @Query("SELECT sp.contractorMaterial FROM ShippingPosition sp WHERE sp.consigneeMaterial.id = :materialId")
    List<Material> findContractorMaterialsAlreadyMappedToConsigneeOnes(Long materialId);

}
