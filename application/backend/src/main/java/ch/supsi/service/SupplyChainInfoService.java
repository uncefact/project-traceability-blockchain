package ch.supsi.service;

import ch.supsi.exception.UneceException;
import ch.supsi.model.*;
import ch.supsi.model.company.Company;
import ch.supsi.model.position.*;
import ch.supsi.model.processing_standard.ProcessingStandard;
import ch.supsi.model.transaction.Transaction;
import ch.supsi.model.transaction.TransactionStatus;
import ch.supsi.model.transformation_plan.TransformationPlan;
import ch.supsi.presentable.SupplyChain.*;
import ch.supsi.presentable.SupplyChain.SupplyChainCompanyInfoPresentable;
import ch.supsi.repository.TransformationPlanProcessTypeRepository;
import ch.supsi.repository.position.ContractPositionRepository;
import ch.supsi.repository.position.OrderPositionRepository;
import ch.supsi.repository.position.ShippingPositionRepository;
import ch.supsi.repository.position.TransformationPlanPositionRepository;
import ch.supsi.repository.transaction.trade.ContractTradeRepository;
import ch.supsi.repository.transaction.trade.OrderTradeRepository;
import ch.supsi.repository.transaction.trade.ShippingTradeRepository;
import ch.supsi.util.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SupplyChainInfoService {
    OrderPositionRepository orderPositionRepository;
    ContractPositionRepository contractPositionRepository;
    ShippingPositionRepository shippingPositionRepository;
    TransformationPlanPositionRepository transformationPlanPositionRepository;
    TransformationPlanProcessTypeRepository transformationPlanProcessTypeRepository;
    ShippingTradeRepository shippingTradeRepository;
    ContractTradeRepository contractTradeRepository;
    OrderTradeRepository orderTradeRepository;
    final MaterialService materialService;
    final CertificationService certificationService;
    final TransformationPlanService transformationPlanService;

    public SupplyChainInfoService(OrderPositionRepository orderPositionRepository, ContractPositionRepository contractPositionRepository, ShippingPositionRepository shippingPositionRepository, TransformationPlanPositionRepository transformationPlanPositionRepository, TransformationPlanProcessTypeRepository transformationPlanProcessTypeRepository, ShippingTradeRepository shippingTradeRepository, ContractTradeRepository contractTradeRepository, OrderTradeRepository orderTradeRepository, MaterialService materialService, CertificationService certificationService, TransformationPlanService transformationPlanService) {
        this.orderPositionRepository = orderPositionRepository;
        this.contractPositionRepository = contractPositionRepository;
        this.shippingPositionRepository = shippingPositionRepository;
        this.transformationPlanPositionRepository = transformationPlanPositionRepository;
        this.transformationPlanProcessTypeRepository = transformationPlanProcessTypeRepository;
        this.shippingTradeRepository = shippingTradeRepository;
        this.contractTradeRepository = contractTradeRepository;
        this.orderTradeRepository = orderTradeRepository;
        this.materialService = materialService;
        this.certificationService = certificationService;
        this.transformationPlanService = transformationPlanService;
    }

    private void addMaterialPresentable(Position position, List<SupplyChainMaterialPresentable> supplyChainMaterialPresentableList) {
        supplyChainMaterialPresentableList.add(new SupplyChainMaterialPresentable(position.getConsigneeMaterial().getName(), position.getConsigneeMaterial().getId()));
    }

    private void addCompanyInfoPresentable(Company company, Long transformationPlanId, List<SupplyChainCompanyInfoPresentable> companyInfoPresentables, TraceabilityLevel traceabilityLevel) throws NoSuchAlgorithmException, UneceException {
        SupplyChainCompanyInfoPresentable supplyChainCompanyInfoPresentable = new SupplyChainCompanyInfoPresentable(
                SecurityUtils.hashStringValue(company.getCompanyName() + transformationPlanId),
                company,
                traceabilityLevel
        );
        companyInfoPresentables.add(supplyChainCompanyInfoPresentable);
    }

    private void addTransformationPlanPresentable(TransformationPlanPosition transformationPlanPosition, List<SupplyChainTransformationPresentable> supplyChainTransformationPresentableList,TraceabilityLevel traceabilityLevel) {
        Optional<SupplyChainTransformationPresentable> optionalSupplyChainTransformationPresentable = supplyChainTransformationPresentableList
                .stream()
                .filter(s -> s.getOutput_material_ids().contains(transformationPlanPosition.getConsigneeMaterial().getId()))
                .findFirst();
        if (optionalSupplyChainTransformationPresentable.isPresent()) {
            SupplyChainTransformationPresentable supplyChainTransformationPresentable = optionalSupplyChainTransformationPresentable.get();
            supplyChainTransformationPresentable.addInput_material_ids(transformationPlanPosition.getContractorMaterial().getId());
            supplyChainTransformationPresentable.addInput_material_id_percentage(transformationPlanPosition.getContractorMaterial().getId(), transformationPlanPosition.getQuantity());
        } else {
            SupplyChainTransformationPresentable supplyChainTransformationPresentable = new SupplyChainTransformationPresentable();
            supplyChainTransformationPresentable.setId(transformationPlanPosition.getTransformationPlan().getId());
            supplyChainTransformationPresentable.setName(transformationPlanPosition.getTransformationPlan().getName());
            supplyChainTransformationPresentable.setProductCategory(null);//TODO Fix
            supplyChainTransformationPresentable.addOutput_material_ids(transformationPlanPosition.getConsigneeMaterial().getId());
            supplyChainTransformationPresentable.addInput_material_ids(transformationPlanPosition.getContractorMaterial().getId());
            supplyChainTransformationPresentable.addInput_material_id_percentage(transformationPlanPosition.getContractorMaterial().getId(), transformationPlanPosition.getQuantity());
            try {
                supplyChainTransformationPresentable.setExecutor_company_id(SecurityUtils.hashStringValue(
                        transformationPlanPosition.getTransformationPlan().getCompany().getCompanyName() + transformationPlanPosition.getTransformationPlan().getId()));
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            }
            List<String> processTypeNames = this.getProcessNameByTransformationPlan(transformationPlanPosition.getTransformationPlan());
            supplyChainTransformationPresentable.setProcessesTypeNames(processTypeNames);
            //TODO change logic and return all types of certificates
            List<SupplyChainCertificatePresentable> certificates = this.certificationService.getCertificationsByTransformationPlanId(transformationPlanPosition.getTransformationPlan().getId())
                    .stream()
                    .map(ct -> new SupplyChainCertificatePresentable(ct, traceabilityLevel))
                    .collect(Collectors.toList());
            supplyChainTransformationPresentable.setProcessingStandards(transformationPlanService.findAllProcessingStandardsByTransformationId(transformationPlanPosition.getTransformationPlan().getId()).stream().filter(Objects::nonNull).map(ProcessingStandard::getName).collect(Collectors.toList()));
            supplyChainTransformationPresentable.setCertificates(new ArrayList<>(certificates));

            supplyChainTransformationPresentableList.add(supplyChainTransformationPresentable);
        }
    }

    private void addContractTradePresentable(ContractPosition contractPosition, List<SupplyChainTradePresentable> supplyChainTradePresentableList, TraceabilityLevel traceabilityLevel) {
        Map<Long, Long> map = new HashMap<>();
        map.put(contractPosition.getConsigneeMaterial().getId(), contractPosition.getContractorMaterial().getId());
        String documentType = contractPosition.getContractTrade().getDocumentType().getCode() + " - " + contractPosition.getContractTrade().getDocumentType().getName();
        String referenceNumber = contractPosition.getContractTrade().getContractorReferenceNumber();
        Date creationDate = contractPosition.getContractTrade().getContractorDate();
        Date issueDate = contractPosition.getContractTrade().getValidFrom();
        Date validUntilDate = contractPosition.getContractTrade().getValidUntil();
        Long documentId = contractPosition.getContractTrade().getDocument().getId();
        String documentFileName = contractPosition.getContractTrade().getDocument().getFileName();
        List<String> processingStandards = contractPosition.getContractTrade().getProcessingStandard() != null ? Collections.singletonList(contractPosition.getContractTrade().getProcessingStandard().getName()) : null;
        SupplyChainTradePresentable supplyChainTradePresentable = new SupplyChainTradePresentable(
                "Contract",
                referenceNumber,
                creationDate,
                issueDate,
                validUntilDate,
                map,
                documentId,
                documentFileName,
                documentType,
                processingStandards,
                new ArrayList<>(),
                traceabilityLevel
        );
        supplyChainTradePresentableList.add(supplyChainTradePresentable);
    }

    private void addOrderTradePresentable(OrderPosition orderPosition, List<SupplyChainTradePresentable> supplyChainTradePresentableList, TraceabilityLevel traceabilityLevel) {
        Map<Long, Long> map = new HashMap<>();
        map.put(orderPosition.getConsigneeMaterial().getId(), orderPosition.getContractorMaterial().getId());
        String documentType = orderPosition.getOrderTrade().getDocumentType().getCode() + " - " + orderPosition.getOrderTrade().getDocumentType().getName();
        String referenceNumber = orderPosition.getOrderTrade().getContractorReferenceNumber();
        Date creationDate = orderPosition.getOrderTrade().getContractorDate();
        Date issueDate = orderPosition.getOrderTrade().getValidFrom();
        Date validUntilDate = orderPosition.getOrderTrade().getValidUntil();
        Long documentId = orderPosition.getOrderTrade().getDocument().getId();
        String documentFileName = orderPosition.getOrderTrade().getDocument().getFileName();
        List<String> processingStandards = orderPosition.getOrderTrade().getProcessingStandard() != null ? Collections.singletonList(orderPosition.getOrderTrade().getProcessingStandard().getName()) : null;
        SupplyChainTradePresentable supplyChainTradePresentable = new SupplyChainTradePresentable(
                "Order",
                referenceNumber,
                creationDate,
                issueDate,
                validUntilDate,
                map,
                documentId,
                documentFileName,
                documentType,
                processingStandards,
                new ArrayList<>(),
                traceabilityLevel
        );
        supplyChainTradePresentableList.add(supplyChainTradePresentable);
    }

    private void addShippingTradePresentable(ShippingPosition shippingPosition, List<SupplyChainTradePresentable> supplyChainTradePresentableList, TraceabilityLevel traceabilityLevel) {
        Map<Long, Long> map = new HashMap<>();
        map.put(shippingPosition.getConsigneeMaterial().getId(), shippingPosition.getContractorMaterial().getId());
        String documentType = shippingPosition.getShippingTrade().getDocumentType().getCode() + " - " + shippingPosition.getShippingTrade().getDocumentType().getName();
        String referenceNumber = shippingPosition.getShippingTrade().getContractorReferenceNumber();
        Date creationDate = shippingPosition.getShippingTrade().getContractorDate();
        Date issueDate = shippingPosition.getShippingTrade().getValidFrom();
        Date validUntilDate = shippingPosition.getShippingTrade().getValidUntil();
        Long documentId = shippingPosition.getShippingTrade().getDocument().getId();
        String documentFileName = shippingPosition.getShippingTrade().getDocument().getFileName();
        List<String> processingStandards = shippingPosition.getShippingTrade().getProcessingStandard() != null ? Collections.singletonList(shippingPosition.getShippingTrade().getProcessingStandard().getName()) : null;
        List<SupplyChainCertificatePresentable> certificates = new ArrayList<>();
        if(shippingPosition.getShippingTrade().getCertificationTransaction() != null)
            certificates.add(new SupplyChainCertificatePresentable(shippingPosition.getShippingTrade().getCertificationTransaction(), traceabilityLevel));
        SupplyChainTradePresentable supplyChainTradePresentable = new SupplyChainTradePresentable(
                "Shipping",
                referenceNumber,
                creationDate,
                issueDate,
                validUntilDate,
                map,
                documentId,
                documentFileName,
                documentType,
                processingStandards,
                certificates,
                traceabilityLevel
        );
        supplyChainTradePresentableList.add(supplyChainTradePresentable);
    }
    
    private void mergeSupplyChains(SupplyChainInfoPresentable supplyChainInfoPresentable1, SupplyChainInfoPresentable supplyChainInfoPresentable2) {
        Set<SupplyChainTransformationPresentable> supplyChainTransformationPresentableSet = new HashSet<>();
        supplyChainTransformationPresentableSet.addAll(supplyChainInfoPresentable1.getTransformations());
        supplyChainTransformationPresentableSet.addAll(supplyChainInfoPresentable2.getTransformations());
        
        Set<SupplyChainTradePresentable> supplyChainTradePresentableSet = new HashSet<>();
        supplyChainTradePresentableSet.addAll(supplyChainInfoPresentable1.getTrades());
        supplyChainTradePresentableSet.addAll(supplyChainInfoPresentable2.getTrades());

        Set<SupplyChainMaterialPresentable> supplyChainMaterialPresentableSet = new HashSet<>();
        supplyChainMaterialPresentableSet.addAll(supplyChainInfoPresentable1.getMaterials());
        supplyChainMaterialPresentableSet.addAll(supplyChainInfoPresentable2.getMaterials());

        Set<SupplyChainCompanyInfoPresentable> supplyChainCompanyInfoPresentableSet = new HashSet<>();
        supplyChainCompanyInfoPresentableSet.addAll(supplyChainInfoPresentable1.getCompaniesInfo());
        supplyChainCompanyInfoPresentableSet.addAll(supplyChainInfoPresentable2.getCompaniesInfo());

        supplyChainInfoPresentable1.setTransformations(new ArrayList<>(supplyChainTransformationPresentableSet));
        supplyChainInfoPresentable1.setTrades(new ArrayList<>(supplyChainTradePresentableSet));
        supplyChainInfoPresentable1.setCompaniesInfo(new ArrayList<>(supplyChainCompanyInfoPresentableSet));
        supplyChainInfoPresentable1.setMaterials(new ArrayList<>(supplyChainMaterialPresentableSet));
    }


    public SupplyChainInfoPresentable getSupplyChainInitial(Long materialId) throws UneceException, NoSuchAlgorithmException {
        Material material = this.materialService.getMaterialById(materialId);
        if (material == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Material not found", new Exception());

        if (!materialService.isLoggedCompanyOwner(material) && !materialService.hasLoggedCompanyMaterialTrades(material))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can't view material's information!", new Exception());

        return getSupplyChainRecursion(material, new TraceabilityLevel("3 - WHERE-WHO - name - address"),new TransparencyLevel("2 - Copy Certificate"));
    }

    public SupplyChainInfoPresentable getSupplyChainRecursion(Material material, TraceabilityLevel actualTraceabilityLevel, TransparencyLevel actualTransparencyLevel) throws UneceException, NoSuchAlgorithmException {
        if (material == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Material not found", new Exception());

        List<Position> positions = new ArrayList<>(this.searchPositionsByMaterial(material));

        SupplyChainInfoPresentable supplyChainInfoPresentable = new SupplyChainInfoPresentable(new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>());

        for (Position position : positions) {
            TraceabilityLevel positionTraceabilityLevel = actualTraceabilityLevel;
            TransparencyLevel positionTransparencyLevel = actualTransparencyLevel;
            addMaterialPresentable(position, supplyChainInfoPresentable.getMaterials());

            //Compute
            if (position instanceof TransformationPlanPosition) {
                TransformationPlanPosition transformationPlanPosition = (TransformationPlanPosition) position;
                TransformationPlan transformationPlan = transformationPlanPosition.getTransformationPlan();
                TraceabilityLevel traceabilityLevel = transformationPlan.getTraceabilityLevel();
                //Calculate Transformation Plan Presentable (Attenzione all'if)
                addTransformationPlanPresentable(transformationPlanPosition, supplyChainInfoPresentable.getTransformations(), positionTraceabilityLevel);
                //Calculate Company Info Presentable
                addCompanyInfoPresentable(transformationPlanPosition.getTransformationPlan().getCompany(), transformationPlanPosition.getTransformationPlan().getId(), supplyChainInfoPresentable.getCompaniesInfo(), positionTraceabilityLevel);
                if (traceabilityLevel.isMoreRestrictiveThan(actualTraceabilityLevel))
                    positionTraceabilityLevel = traceabilityLevel;
                TransparencyLevel transparencyLevel = transformationPlan.getTransparencyLevel();
                if(transparencyLevel.isMoreRestrictiveThan(actualTransparencyLevel))
                    positionTransparencyLevel = transparencyLevel;
            } else if (position instanceof ContractPosition) {
                ContractPosition contractPosition = (ContractPosition) position;
                if (contractPosition.getContractTrade().getStatus().equals(TransactionStatus.ACCEPTED)) {
                    addContractTradePresentable(contractPosition, supplyChainInfoPresentable.getTrades(), positionTraceabilityLevel);
                }
            } else if (position instanceof OrderPosition) {
                OrderPosition orderPosition = (OrderPosition) position;
                if (orderPosition.getOrderTrade().getStatus().equals(TransactionStatus.ACCEPTED)) {
                    addOrderTradePresentable(orderPosition, supplyChainInfoPresentable.getTrades(), positionTraceabilityLevel);
                }
            } else if (position instanceof ShippingPosition) {
                ShippingPosition shippingPosition = (ShippingPosition) position;
                if (shippingPosition.getShippingTrade().getStatus().equals(TransactionStatus.ACCEPTED)) {
                    addShippingTradePresentable(shippingPosition, supplyChainInfoPresentable.getTrades(),positionTraceabilityLevel);
                }
            }


            SupplyChainInfoPresentable recursionStepSupplyChainInfoPresentable = getSupplyChainRecursion(position.getContractorMaterial(), positionTraceabilityLevel,positionTransparencyLevel);

            // merging logic
            mergeSupplyChains(supplyChainInfoPresentable, recursionStepSupplyChainInfoPresentable);
        }

        return supplyChainInfoPresentable;
    }

    public List<Position> searchPositionsByMaterial(Material material) {
        List<Position> foundPositions = new ArrayList<>();
        foundPositions.addAll(orderPositionRepository.findAllByConsigneeMaterial(material));
        foundPositions.addAll(contractPositionRepository.findAllByConsigneeMaterial(material));
        foundPositions.addAll(shippingPositionRepository.findAllByConsigneeMaterial(material));
        List<TransformationPlanPosition> transformationPlanPositions = transformationPlanPositionRepository.findAllByContractorMaterial(material);
        for (TransformationPlanPosition transformationPlanPosition : transformationPlanPositions) {
            if (transformationPlanPosition != null && !transformationPlanPosition.isIn()) {
                List<Position> foundTpositions = transformationPlanPositionRepository
                        .findAllByTransformationPlanId(transformationPlanPosition.getTransformationPlan().getId())
                        .stream()
                        .map(p -> new TransformationPlanPosition(
                                p.getId(),
                                p.getContractorMaterial(),
                                p.getConsigneeMaterial(),
                                p.getWeight(),
                                p.getQuantity(),
                                p.getExternalDescription(),
                                p.getUnit(),
                                p.getTransformationPlan()
                        ))
                        .collect(Collectors.toList());
                List<Position> inputPositions = foundTpositions
                        .stream()
                        .filter(p -> !p.getId().equals(transformationPlanPosition.getId()))
                        .collect(Collectors.toList());
                List<Position> pos = inputPositions.stream().map(p -> {
                    p.setConsigneeMaterial(transformationPlanPosition.getConsigneeMaterial());
                    return p;
                }).collect(Collectors.toList());
                foundPositions.addAll(pos);
            }
        }
        return foundPositions;
    }

    public List<String> getProcessNameByTransformationPlan(TransformationPlan transformationPlan) {
        return this.transformationPlanProcessTypeRepository.findAllByTransformationPlanId(transformationPlan.getId()).stream().map(transformationPlanProcess -> transformationPlanProcess.getProcessType().getName()).collect(Collectors.toList());
    }

    public List<Company> getPredecessors(String companyName) {
        Set<Company> predecessors = new HashSet<>();
        predecessors.addAll(this.shippingTradeRepository.findByConsigneeCompanyName(companyName).stream().map(Transaction::getContractor).collect(Collectors.toList()));
        predecessors.addAll(this.contractTradeRepository.findByConsigneeCompanyName(companyName).stream().map(Transaction::getContractor).collect(Collectors.toList()));
        predecessors.addAll(this.orderTradeRepository.findByConsigneeCompanyName(companyName).stream().map(Transaction::getContractor).collect(Collectors.toList()));
        return new ArrayList(predecessors);
    }

}
