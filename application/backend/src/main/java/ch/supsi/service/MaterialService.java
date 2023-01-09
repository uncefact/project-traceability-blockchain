package ch.supsi.service;

import ch.supsi.exception.UneceException;
import ch.supsi.model.company.Company;
import ch.supsi.model.Material;
import ch.supsi.repository.MaterialRepository;
import ch.supsi.repository.position.ContractPositionRepository;
import ch.supsi.repository.position.OrderPositionRepository;
import ch.supsi.repository.position.ShippingPositionRepository;
import ch.supsi.repository.position.TransformationPlanPositionRepository;
import ch.supsi.util.UneceServer;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final TransformationPlanPositionRepository transformationPlanPositionRepository;
    private final LoginService loginService;
    private final ContractPositionRepository contractPositionRepository;
    private final OrderPositionRepository orderPositionRepository;
    private final ShippingPositionRepository shippingPositionRepository;

    public MaterialService(MaterialRepository materialRepository, TransformationPlanPositionRepository transformationPlanPositionRepository, LoginService loginService, ContractPositionRepository contractPositionRepository, OrderPositionRepository orderPositionRepository, ShippingPositionRepository shippingPositionRepository) {
        this.materialRepository = materialRepository;
        this.transformationPlanPositionRepository = transformationPlanPositionRepository;
        this.loginService = loginService;
        this.contractPositionRepository = contractPositionRepository;
        this.orderPositionRepository = orderPositionRepository;
        this.shippingPositionRepository = shippingPositionRepository;
    }

    public List<Material> getMaterialsByCompanyNameAndIsInput(String companyName, Boolean isIn){
        return materialRepository.findAllByCompanyCompanyNameAndIsInput(companyName, isIn);
    }

    public boolean isNotTransformationResult(Material material){
        return transformationPlanPositionRepository.findByContractorMaterial(material) == null;
    }

    public Material save(Material material){
        return materialRepository.save(material);
    }

    public Material getMaterialById(Long id){
        return materialRepository.findById(id).isPresent() ? materialRepository.findById(id).get() : null;
    }

    public boolean isLoggedCompanyOwner(Material material) throws UneceException {
        String loggedCompanyName = loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany().getCompanyName();
        return loggedCompanyName.equals(material.getCompany().getCompanyName());
    }

    public Material getCachedCompanyConsigneeMaterialFromPositions(Long contractorMaterialId, Company consignee){
        List<Material> materials = new ArrayList<>();
        materials.addAll(contractPositionRepository.findCachedConsigneeMaterials(contractorMaterialId));
        materials.addAll(orderPositionRepository.findCachedConsigneeMaterials(contractorMaterialId));
        materials.addAll(shippingPositionRepository.findCachedConsigneeMaterials(contractorMaterialId));

        for(Material material : materials){
            if(material != null && material.getCompany().getCompanyName().equals(consignee.getCompanyName()))
                return material;
        }
        return null;
    }

    public Company getContractorSupplierFromConsigneeMaterial(Material material){
        List<Material> contractorMaterials = shippingPositionRepository.findContractorMaterialsAlreadyMappedToConsigneeOnes(material.getId());
        if (contractorMaterials.size() == 0)
            contractorMaterials = contractPositionRepository.findContractorMaterialsAlreadyMappedToConsigneeOnes(material.getId());
            if (contractorMaterials.size() == 0)
                contractorMaterials = orderPositionRepository.findContractorMaterialsAlreadyMappedToConsigneeOnes(material.getId());

        if (contractorMaterials.size() > 0)
            return contractorMaterials.get(0).getCompany();
        return null;
    }

    public boolean findIfConsigneeMaterialIsAlreadyMappedToContractorOne(Long consigneeMaterialId){
        List<Material> materials = new ArrayList<>();
        materials.addAll(contractPositionRepository.findContractorMaterialsAlreadyMappedToConsigneeOnes(consigneeMaterialId));
        materials.addAll(orderPositionRepository.findContractorMaterialsAlreadyMappedToConsigneeOnes(consigneeMaterialId));
        materials.addAll(shippingPositionRepository.findContractorMaterialsAlreadyMappedToConsigneeOnes(consigneeMaterialId));

        return materials.stream().anyMatch(Objects::nonNull);
    }

    /**
     * Returns True if the the logged company is the consignee of a trade that contains the material passed as param
     * @param material
     * @return
     * @throws UneceException
     */
    public boolean hasLoggedCompanyMaterialTrades(Material material) throws UneceException {
        Company loggedCompany = loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();
        if (shippingPositionRepository.findAllByContractorMaterialAndShippingTradeConsignee(material, loggedCompany).size() > 0)
            return true;
        if (contractPositionRepository.findAllByContractorMaterialAndContractTradeConsignee(material, loggedCompany). size() > 0)
            return true;
        return orderPositionRepository.findAllByContractorMaterialAndOrderTradeConsignee(material, loggedCompany).size() > 0;
    }
}
