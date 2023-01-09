package ch.supsi.controller;

import ch.supsi.model.Material;
import ch.supsi.presentable.MaterialPresentable;
import ch.supsi.request.MaterialRequest;
import ch.supsi.service.CompanyService;
import ch.supsi.service.MaterialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/materials")
public class MaterialController {

    private final MaterialService materialService;
    private final CompanyService companyService;

    public MaterialController(MaterialService materialService, CompanyService companyService) {
        this.materialService = materialService;
        this.companyService = companyService;
    }

    @GetMapping("")
    public List<MaterialPresentable> getMaterialsByCompany(@RequestParam(name = "company") String companyName,
                                                           @RequestParam(name = "isInput") Boolean isIn,
                                                           @RequestParam(name = "isForTransformation") Boolean isForTransformation) {
        // TODO We will close it later as soon as we introduced the roles
        List<Material> companyMaterials = this.materialService.getMaterialsByCompanyNameAndIsInput(companyName, isIn);
        if (isIn && !isForTransformation)
            return companyMaterials.stream().filter(m -> !this.materialService.findIfConsigneeMaterialIsAlreadyMappedToContractorOne(m.getId())).map(MaterialPresentable::new).collect(Collectors.toList());
        //if the request is for Input Material or for Insert Trade return all Material otherwise filter output materials
        else if (isIn || !isForTransformation)
            return companyMaterials.stream().map(MaterialPresentable::new).collect(Collectors.toList());
        else
            return companyMaterials.stream().filter(materialService::isNotTransformationResult).map(MaterialPresentable::new).collect(Collectors.toList());
    }

    @PostMapping("/create")
    @Operation(summary = "Create a new material", security = @SecurityRequirement(name = "bearerAuth"))
    public MaterialPresentable addMaterialFromCompany(@RequestBody MaterialRequest materialRequest) {
        Material material = new Material(materialRequest.getName(), companyService.getCompanyFromName(materialRequest.getCompanyName()), materialRequest.isInput());
        return new MaterialPresentable(materialService.save(material));
    }
}
