package ch.supsi.service;

import ch.supsi.model.*;
import ch.supsi.exception.UneceException;
import ch.supsi.model.ProcessType;
import ch.supsi.model.transformation_plan.TransformationPlan;
import ch.supsi.model.transformation_plan.TransformationPlanProcessType;
import ch.supsi.model.company.Company;
import ch.supsi.model.position.Position;
import ch.supsi.model.position.TransformationPlanPosition;
import ch.supsi.model.processing_standard.ProcessingStandard;
import ch.supsi.model.transformation_plan.TransformationPlanProcessingStandard;
import ch.supsi.presentable.MaterialPresentable;
import ch.supsi.presentable.PositionPresentable;
import ch.supsi.presentable.TransformationPlanPresentable;
import ch.supsi.repository.TransformationPlanProcessTypeRepository;
import ch.supsi.repository.TransformationPlanProcessingStandardRepository;
import ch.supsi.repository.TransformationPlanRepository;
import ch.supsi.repository.position.TransformationPlanPositionRepository;
import ch.supsi.repository.processing_standard.ProcessingStandardRepository;
import ch.supsi.request.transformation_plan.TransformationPlanUpdateRequest;
import ch.supsi.util.UneceServer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransformationPlanService {
    private final TransformationPlanRepository transformationPlanRepository;
    private final TransformationPlanPositionRepository transformationPlanPositionRepository;
    private final TransformationPlanProcessTypeRepository transformationPlanProcessTypeRepository;
    private final TransformationPlanProcessingStandardRepository transformationPlanProcessingStandardRepository;
    private final LoginService loginService;
    private final TraceabilityLevelService traceabilityLevelService;
    private final TransparencyLevelService transparencyLevelService;
    private final ProcessingStandardRepository processingStandardRepository;
    private final MaterialService materialService;

    public TransformationPlanService(TransformationPlanRepository transformationPlanRepository,
                                     TransformationPlanPositionRepository transformationPlanPositionRepository,
                                     TransformationPlanProcessTypeRepository transformationPlanProcessTypeRepository,
                                     TransformationPlanProcessingStandardRepository transformationPlanProcessingStandardRepository,
                                     LoginService loginService, TraceabilityLevelService traceabilityLevelService, TransparencyLevelService transparencyLevelService, ProcessingStandardRepository processingStandardRepository, MaterialService materialService) {
        this.transformationPlanRepository = transformationPlanRepository;
        this.transformationPlanPositionRepository = transformationPlanPositionRepository;
        this.transformationPlanProcessTypeRepository = transformationPlanProcessTypeRepository;
        this.transformationPlanProcessingStandardRepository = transformationPlanProcessingStandardRepository;
        this.loginService = loginService;
        this.traceabilityLevelService = traceabilityLevelService;
        this.transparencyLevelService = transparencyLevelService;
        this.processingStandardRepository = processingStandardRepository;
        this.materialService = materialService;
    }

    public TransformationPlanPresentable addTransformationPlanWithRelatedPositions(TransformationPlan transformationPlan, List<TransformationPlanPosition> transformationPlanPositionList,
                                                                                   List<ProcessType> processTypeList, List<ProcessingStandard> processingStandardList) {
        TransformationPlan t = this.transformationPlanRepository.save(transformationPlan);
        List<Position> positions = this.transformationPlanPositionRepository.saveAll(transformationPlanPositionList).stream().map(tp -> (Position) tp).collect(Collectors.toList());
        Material outputMaterial = positions.stream()
                .filter(tp -> !tp.getContractorMaterial().isInput())
                .reduce((a,b) -> { throw new IllegalStateException("Multiple output materials: " + a + ", " + b); })
                .get().getContractorMaterial();
        List<ProcessType> processTypes = new ArrayList<>();
        List<ProcessingStandard> processingStandards = new ArrayList<>();
        for (ProcessType processType : processTypeList) {
            this.transformationPlanProcessTypeRepository.save(new TransformationPlanProcessType(t, processType));
            processTypes.add(processType);
        }

        for (ProcessingStandard processingStandard : processingStandardList) {
            this.transformationPlanProcessingStandardRepository.save(new TransformationPlanProcessingStandard(t, processingStandard));
            processingStandards.add(processingStandard);
        }

        return new TransformationPlanPresentable(t, positions.stream().filter(p -> p.getContractorMaterial().isInput()).map(PositionPresentable::new).collect(Collectors.toList()),
                new MaterialPresentable(outputMaterial), processTypes, processingStandards, outputMaterial.getProductCategory());
    }

    public void deleteById(Long id) {
        transformationPlanRepository.deleteById(id);
        transformationPlanPositionRepository.deleteAllByTransformationPlanId(id);
        transformationPlanProcessTypeRepository.deleteAllByTransformationPlanId(id);
        transformationPlanProcessingStandardRepository.deleteAllByTransformationPlanId(id);
    }

    public List<TransformationPlan> findAllTransformationPlansFromCompanyName(String companyName) {
        return transformationPlanRepository.findAllByCompanyCompanyName(companyName);
    }

    public TransformationPlan findById(Long id) {
        return transformationPlanRepository.findById(id).get();
    }

    public List<Position> findAllPositionByTransformationPlanId(Long id) {
        List<TransformationPlanPosition> transformationPlanPositions = transformationPlanPositionRepository.findAllByTransformationPlanId(id);
        return new ArrayList<>(transformationPlanPositions);
    }

    public List<PositionPresentable> getInputPositionsWithContractorSupplier(List<Position> positions){
        Company supplier;
        List<PositionPresentable> positionsUpdated = new ArrayList<>();
        for (Position transformationPlanPosition : positions){
            if (transformationPlanPosition.getContractorMaterial().isInput()){
                supplier = materialService.getContractorSupplierFromConsigneeMaterial(transformationPlanPosition.getContractorMaterial());
                positionsUpdated.add(supplier != null ? new PositionPresentable(transformationPlanPosition, supplier.getCompanyName()) : new PositionPresentable(transformationPlanPosition));
            }
        }
        return positionsUpdated;
    }

    public List<ProcessType> findAllProcessTypesByTransformationId(Long id) {
        return transformationPlanProcessTypeRepository.findAllByTransformationPlanId(id).stream().map(TransformationPlanProcessType::getProcessType).collect(Collectors.toList());
    }

    public boolean isLoggedUserCompany(TransformationPlan transformationPlan) throws UneceException {
        String loggedCompanyId = loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany().getEthAddress();
        return loggedCompanyId.equals(transformationPlan.getCompany().getEthAddress());
    }

    public List<ProcessingStandard> findAllProcessingStandardsByTransformationId(Long id) {
        return transformationPlanProcessingStandardRepository.findAllByTransformationPlanId(id).stream().map(TransformationPlanProcessingStandard::getProcessingStandard).collect(Collectors.toList());
    }

    @Transactional
    public void updateTransformationPlanProcessingStandardFromRequest(TransformationPlan transformationPlan, TransformationPlanUpdateRequest transformationPlanUpdateRequest){
        List<TransformationPlanProcessingStandard> transformationPlanProcessingStandardsOld = transformationPlanProcessingStandardRepository.findAllByTransformationPlanId(transformationPlan.getId());
        List<TransformationPlanProcessingStandard> transformationPlanProcessingStandardsToRemove = new ArrayList<>();
        List<ProcessingStandard> processingStandardsUpdated = processingStandardRepository.findByNameIn(transformationPlanUpdateRequest.getProcessingStandardList());
        List<ProcessingStandard> oldProcessingStandards;
        TransformationPlanProcessingStandard transformationPlanProcessingStandardNew;

        transformationPlanProcessingStandardsOld.forEach(tpsOld -> {
            if (!processingStandardsUpdated.contains(tpsOld.getProcessingStandard())){
                transformationPlanProcessingStandardsToRemove.add(tpsOld);
                transformationPlanProcessingStandardRepository.delete(tpsOld);
            }
        });
        transformationPlanProcessingStandardsOld.removeAll(transformationPlanProcessingStandardsToRemove);
        oldProcessingStandards = transformationPlanProcessingStandardsOld.stream().map(TransformationPlanProcessingStandard::getProcessingStandard).collect(Collectors.toList());

        for (ProcessingStandard psUpdated: processingStandardsUpdated){
            if (!oldProcessingStandards.contains(psUpdated))
                transformationPlanProcessingStandardRepository.save(new TransformationPlanProcessingStandard(transformationPlan, psUpdated));
        }


    }

    @Transactional
    public void updateTransformationPlanFromRequest(Long id, TransformationPlanUpdateRequest transformationPlanUpdateRequest){
        transformationPlanRepository.updateFields(
                id,
                traceabilityLevelService.getTraceabilityLevelByName(transformationPlanUpdateRequest.getTraceabilityLevelName()),
                transparencyLevelService.getTransparencyLevelByName(transformationPlanUpdateRequest.getTransparencyLevelName())
        );
    }

    public List<TransformationPlan> findByMaterial(Material material) {
        return transformationPlanPositionRepository.findAllByContractorMaterial(material).stream().map(TransformationPlanPosition::getTransformationPlan).collect(Collectors.toList());
    }

    public List<String> getProcessTypeNameByTransformationPlan(TransformationPlan transformationPlan) {
        return this.transformationPlanProcessTypeRepository.findAllByTransformationPlanId(transformationPlan.getId()).stream().map(transformationPlanProcess -> transformationPlanProcess.getProcessType().getName()).collect(Collectors.toList());
    }
}
