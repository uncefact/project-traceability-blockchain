package ch.supsi.repository.position;

import ch.supsi.model.company.Company;
import ch.supsi.model.Material;
import ch.supsi.model.position.OrderPosition;
import ch.supsi.model.position.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderPositionRepository extends JpaRepository<OrderPosition, Long> {

    @Query("SELECT op FROM OrderPosition op WHERE op.orderTrade.id = :id")
    List<Position> findAllByOrderTradeId(Long id);

    List<Position> findAllByIdIn(List<Long> ids);

    List<Position> findAllByConsigneeMaterial(Material material);

    List<Position> findAllByContractorMaterial(Material material);

    List<Position> findAllByContractorMaterialAndOrderTradeConsignee(Material material, Company consignee);

    @Modifying
    @Query("UPDATE OrderPosition op SET op.consigneeMaterial = :consigneeMaterial WHERE op.id = :positionID")
    void updateOrderPosition(Long positionID, Material consigneeMaterial);

    @Query("SELECT op.consigneeMaterial FROM OrderPosition op WHERE op.contractorMaterial.id = :materialId")
    List<Material> findCachedConsigneeMaterials(Long materialId);

    @Query("SELECT op.contractorMaterial FROM OrderPosition op WHERE op.consigneeMaterial.id = :materialId")
    List<Material> findContractorMaterialsAlreadyMappedToConsigneeOnes(Long materialId);
}
