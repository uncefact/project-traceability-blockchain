package ch.supsi.controller;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.*;
import ch.supsi.model.company.Company;
import ch.supsi.model.position.Position;
import ch.supsi.model.position.TransformationPlanPosition;
import ch.supsi.model.ProcessType;
import ch.supsi.model.processing_standard.ProcessingStandard;
import ch.supsi.model.transformation_plan.TransformationPlan;
import ch.supsi.presentable.MaterialPresentable;
import ch.supsi.presentable.PositionPresentable;
import ch.supsi.presentable.ProcessingStandardPresentable;
import ch.supsi.presentable.TransformationPlanPresentable;
import ch.supsi.request.transformation_plan.TransformationPlanRequest;
import ch.supsi.request.transformation_plan.TransformationPlanUpdateRequest;
import ch.supsi.service.*;
import ch.supsi.util.UneceServer;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/transformationPlans")
//@PreAuthorize("hasPermission('company', 'trader')")
public class TransformationPlanController {

    private final TransformationPlanService transformationPlanService;
    private final MaterialService materialService;
    private final LoginService loginService;
    private final ProcessTypeService processTypeService;
    private final TraceabilityLevelService traceabilityLevelService;
    private final TransparencyLevelService transparencyLevelService;
    private final ProcessingStandardService processingStandardService;
    private final CertificationService certificationService;
    private final CompanyService companyService;

    public TransformationPlanController(TransformationPlanService transformationPlanService, MaterialService materialService, LoginService loginService, ProcessTypeService processTypeService, TraceabilityLevelService traceabilityLevelService, TransparencyLevelService transparencyLevelService, ProcessingStandardService processingStandardService, CertificationService certificationService, CompanyService companyService) {
        this.transformationPlanService = transformationPlanService;
        this.materialService = materialService;
        this.loginService = loginService;
        this.processTypeService = processTypeService;
        this.traceabilityLevelService = traceabilityLevelService;
        this.transparencyLevelService = transparencyLevelService;
        this.processingStandardService = processingStandardService;
        this.certificationService = certificationService;
        this.companyService = companyService;
    }

    @GetMapping("")
    public List<TransformationPlanPresentable> getAllMyTransformationPlans() throws UneceException {
        Company loggedCompany = loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();

        return transformationPlanService.findAllTransformationPlansFromCompanyName(loggedCompany.getCompanyName()).stream()
                .map(tp -> {
                    List<Position> positions = transformationPlanService.findAllPositionByTransformationPlanId(tp.getId());
                    MaterialPresentable outputMaterial = new MaterialPresentable(positions.stream()
                            .filter(p -> !p.getContractorMaterial().isInput())
                            .reduce((a,b) -> { throw new IllegalStateException("Multiple output materials: " + a + ", " + b); })
                            .get().getContractorMaterial());
                    return new TransformationPlanPresentable(tp, positions.stream().filter(p -> p.getContractorMaterial().isInput()).map(PositionPresentable::new).collect(Collectors.toList()), outputMaterial);
                }).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public TransformationPlanPresentable getTransformationPlan(@PathVariable Long id) throws UneceException {
        TransformationPlan transformationPlan = transformationPlanService.findById(id);
        if (!transformationPlanService.isLoggedUserCompany(transformationPlan))
            throw new UneceException(UneceError.FORBIDDEN);
        List<Position> positions = transformationPlanService.findAllPositionByTransformationPlanId(id);
        Material outputMaterial = positions.stream()
                .filter(tp -> !tp.getContractorMaterial().isInput())
                .reduce((a,b) -> { throw new IllegalStateException("Multiple output materials: " + a + ", " + b); })
                .get().getContractorMaterial();
        return new TransformationPlanPresentable(
                transformationPlanService.findById(id),
                transformationPlanService.getInputPositionsWithContractorSupplier(positions),
                new MaterialPresentable(outputMaterial),
                transformationPlanService.findAllProcessTypesByTransformationId(id),
                transformationPlanService.findAllProcessingStandardsByTransformationId(id),
                outputMaterial.getProductCategory());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a transformation plan", security = @SecurityRequirement(name = "bearerAuth"))
    public TransformationPlanPresentable updateTransformationPlan(@PathVariable Long id, @RequestBody TransformationPlanUpdateRequest transformationPlanUpdateRequest) throws UneceException {
        transformationPlanUpdateRequest.validate();
        transformationPlanService.updateTransformationPlanFromRequest(id, transformationPlanUpdateRequest);

        TransformationPlan transformationPlan = transformationPlanService.findById(id);
        transformationPlanService.updateTransformationPlanProcessingStandardFromRequest(transformationPlan, transformationPlanUpdateRequest);

        List<Position> positions = transformationPlanService.findAllPositionByTransformationPlanId(id);
        Material outputMaterial = positions.stream()
                .filter(tp -> !tp.getContractorMaterial().isInput())
                .reduce((a,b) -> { throw new IllegalStateException("Multiple output materials: " + a + ", " + b); })
                .get().getContractorMaterial();

        return new TransformationPlanPresentable(
                transformationPlan,
                positions.stream().filter(p -> p.getContractorMaterial().isInput()).map(PositionPresentable::new).collect(Collectors.toList()),
                new MaterialPresentable(outputMaterial),
                transformationPlanService.findAllProcessTypesByTransformationId(id),
                transformationPlanService.findAllProcessingStandardsByTransformationId(id),
                outputMaterial.getProductCategory());
    }

    @PostMapping(value = "/create")
    @Operation(summary = "Create a new transformation plan", security = @SecurityRequirement(name = "bearerAuth"))
    public TransformationPlanPresentable createTransformationPlan(@RequestBody TransformationPlanRequest transformationPlanRequest) throws UneceException {
        transformationPlanRequest.validate();
        Company company = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();
        TransformationPlan transformationPlan = new TransformationPlan(
                transformationPlanRequest.getName(),
                company,
                transformationPlanRequest.getValidFrom(),
                transformationPlanRequest.getValidUntil(),
                transformationPlanRequest.getNotes(),
                new Date()
        );
        List<TransformationPlanPosition> transformationPlanPositionList = transformationPlanRequest
                .getPositionRequestList()
                .stream()
                .map(t -> {
                            Material material = materialService.getMaterialById(t.getContractorMaterialId());
                            if (material == null)
                                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Material not found", new Exception());
                            if (!material.isInput() && transformationPlanRequest.getProductCategoryCode() != null){
                                material.setProductCategory(certificationService.getProductCategoryByCode(transformationPlanRequest.getProductCategoryCode()));
                                materialService.save(material);
                            }

                            return new TransformationPlanPosition(
                                    material,
                                    t.getQuantity(),
                                    transformationPlan
                            );
                        }
                ).collect(Collectors.toList());
        List<ProcessType> processTypeList = transformationPlanRequest
                .getProcessCodeList()
                .stream()
                .map(code -> {
                    ProcessType processType = processTypeService.getProcessByCode(code);
                    if (processType == null)
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ProcessType not found", new Exception());
                    return processType;
                })
                .collect(Collectors.toList());

        List<ProcessingStandard> processingStandardList = transformationPlanRequest
                .getProcessingStandardList()
                .stream()
                .map(name -> {
                    ProcessingStandard processingStandard = processingStandardService.getProcessingStandardByName(name);
                    if (processingStandard == null)
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ProcessingStandard not found", new Exception());
                    return processingStandard;
                })
                .collect(Collectors.toList());

        transformationPlan.setTraceabilityLevel(traceabilityLevelService.getTraceabilityLevelByName(transformationPlanRequest.getTraceabilityLevelName()));
        transformationPlan.setTransparencyLevel(transparencyLevelService.getTransparencyLevelByName(transformationPlanRequest.getTransparencyLevelName()));

        return transformationPlanService.addTransformationPlanWithRelatedPositions(
                transformationPlan,
                transformationPlanPositionList,
                processTypeList,
                processingStandardList
        );
    }

    @GetMapping("/processingStandards")
    public List<ProcessingStandardPresentable> getTransformationProcessingStandards() throws UneceException {
        Company loggedCompany = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();

        return certificationService.getProcessingStandards(loggedCompany.getCompanyIndustry()).stream().map(ProcessingStandardPresentable::new).collect(Collectors.toList());
    }

    @DeleteMapping("/{id}")
    public void deleteTransformationPlan(@PathVariable Long id) throws UneceException {
        TransformationPlan transformationPlan = transformationPlanService.findById(id);
        if (!transformationPlanService.isLoggedUserCompany(transformationPlan))
            throw new UneceException(UneceError.FORBIDDEN);
        transformationPlanService.deleteById(id);
    }
}
