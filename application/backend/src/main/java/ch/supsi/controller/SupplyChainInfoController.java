package ch.supsi.controller;

import ch.supsi.exception.UneceException;
import ch.supsi.model.company.Company;
import ch.supsi.model.position.Position;
import ch.supsi.model.transaction.trade.ShippingTrade;
import ch.supsi.presentable.CompanyPresentable;
import ch.supsi.presentable.SupplyChain.*;
import ch.supsi.service.*;
import ch.supsi.util.UneceServer;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/supplychain")
public class SupplyChainInfoController {

    private final MaterialService materialService;
    private final SupplyChainInfoService supplyChainInfoService;
    private final LoginService loginService;
    private final CertificationService certificationService;
    private final TransformationPlanService transformationPlanService;
    private final TradeService tradeService;

    public SupplyChainInfoController(MaterialService materialService,
                                     SupplyChainInfoService supplyChainInfoService,
                                     LoginService loginService,
                                     CertificationService certificationService, TransformationPlanService transformationPlanService, TradeService tradeService) {
        this.materialService = materialService;
        this.supplyChainInfoService = supplyChainInfoService;
        this.loginService = loginService;
        this.certificationService = certificationService;
        this.transformationPlanService = transformationPlanService;
        this.tradeService = tradeService;
    }

    @GetMapping("")
    @Operation(summary = "Get supply chain", security = @SecurityRequirement(name = "bearerAuth"))
    public SupplyChainInfoPresentable getSupplyChain(@RequestParam(name = "materialId") Long materialId) throws UneceException, NoSuchAlgorithmException {
        return this.supplyChainInfoService.getSupplyChainInitial(materialId);
    }


    @GetMapping("/predecessors")
    @Operation(summary = "Get Ethereum address of company predecessors", security = @SecurityRequirement(name = "bearerAuth"))
    public List<CompanyPresentable> getPredecessors() throws UneceException {
        Company company = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();
        return this.supplyChainInfoService.getPredecessors(company.getCompanyName()).stream().map(CompanyPresentable::new).collect(Collectors.toList());
    }

    @GetMapping("/allChains")
    @Operation(summary = "Get All Supply Chain", security = @SecurityRequirement(name = "bearerAuth"))
    public Map<String,Map<Long,SupplyChainInfoPresentable>> getSupplyChainsForConsignee() throws UneceException, NoSuchAlgorithmException {
        Company company = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();
        List<ShippingTrade> shippingTrades = this.tradeService.getShippingFromContractorCompanyName(company.getCompanyName());
        Map<String,Map<Long,SupplyChainInfoPresentable>> allSupplyChains = new HashMap<>();
        for(ShippingTrade shippingTrade : shippingTrades){
            if(shippingTrade.getConsignee().getCustodialWalletCredentials() == null)
                continue;
            String consigneeAddress = shippingTrade.getConsignee().getEthAddress();
            Map<Long, SupplyChainInfoPresentable> consigneeMap;
            if(allSupplyChains.containsKey(consigneeAddress)){
                consigneeMap = allSupplyChains.get(consigneeAddress);
            } else {
                consigneeMap=new HashMap<>();
                allSupplyChains.put(consigneeAddress, consigneeMap);
            }
            List<Position> shippingPositions = this.tradeService.getPositionsFromShippingId(shippingTrade.getId());
            for(Position s : shippingPositions)
                consigneeMap.put(s.getContractorMaterial().getId(),this.supplyChainInfoService.getSupplyChainInitial(s.getContractorMaterial().getId()));
        }
        return allSupplyChains;
    }


}
