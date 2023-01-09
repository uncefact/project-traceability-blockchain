package ch.supsi.presentable.SupplyChain;

import java.util.List;

public class SupplyChainInfoPresentable {
    private List<SupplyChainCompanyInfoPresentable> companiesInfo;
    private List<SupplyChainMaterialPresentable> materials;
    private List<SupplyChainTradePresentable> trades;
    private List<SupplyChainTransformationPresentable> transformations;

    public SupplyChainInfoPresentable(List<SupplyChainCompanyInfoPresentable> companiesInfo, List<SupplyChainMaterialPresentable> materials, List<SupplyChainTradePresentable> trades, List<SupplyChainTransformationPresentable> transformations) {
        this.companiesInfo = companiesInfo;
        this.materials = materials;
        this.trades = trades;
        this.transformations = transformations;
    }

    public List<SupplyChainCompanyInfoPresentable> getCompaniesInfo() {
        return companiesInfo;
    }

    public List<SupplyChainMaterialPresentable> getMaterials() {
        return materials;
    }

    public List<SupplyChainTradePresentable> getTrades() {
        return trades;
    }

    public List<SupplyChainTransformationPresentable> getTransformations() {
        return transformations;
    }

    public void setCompaniesInfo(List<SupplyChainCompanyInfoPresentable> companiesInfo) {
        this.companiesInfo = companiesInfo;
    }

    public void setMaterials(List<SupplyChainMaterialPresentable> materials) {
        this.materials = materials;
    }

    public void setTrades(List<SupplyChainTradePresentable> trades) {
        this.trades = trades;
    }

    public void setTransformations(List<SupplyChainTransformationPresentable> transformations) {
        this.transformations = transformations;
    }

}
