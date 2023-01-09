package ch.supsi.repository.position;

import ch.supsi.model.company.Company;
import ch.supsi.model.Material;
import ch.supsi.model.position.ContractPosition;
import ch.supsi.model.position.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractPositionRepository extends JpaRepository<ContractPosition, Long> {

    @Query("SELECT cp FROM ContractPosition cp WHERE cp.contractTrade.id = :contractTradeID")
    List<Position> findAllByContractTradeID(Long contractTradeID);

    List<Position> findAllByIdIn(List<Long> ids);

    List<Position> findAllByConsigneeMaterial(Material material);

    List<Position> findAllByContractorMaterial(Material material);

    List<Position> findAllByContractorMaterialAndContractTradeConsignee(Material material, Company consignee);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE ContractPosition cp SET cp.consigneeMaterial = :consigneeMaterial WHERE cp.id = :positionID")
    void updateContractPosition(Long positionID, Material consigneeMaterial);

    @Query("SELECT cp.consigneeMaterial FROM ContractPosition cp WHERE cp.contractorMaterial.id = :materialId")
    List<Material> findCachedConsigneeMaterials(Long materialId);

    @Query("SELECT cp.contractorMaterial FROM ContractPosition cp WHERE cp.consigneeMaterial.id = :materialId")
    List<Material> findContractorMaterialsAlreadyMappedToConsigneeOnes(Long materialId);
}
