package ch.supsi.presentable.SupplyChain;

import java.util.*;

public class SupplyChainTransformationPresentable {
    private Long id;
    private String name;
    private String productCategory;
    private List<Long> input_material_ids;
    private List<Long> output_material_ids;
    private String executor_company_id;
    private List<String> processesTypeNames;
    private Map<Long, Double> input_material_id_percentage_map;
    private List<String> processingStandards;
    private List<SupplyChainCertificatePresentable> certificates;

    public SupplyChainTransformationPresentable(Long id, String name, String productCategory, List<Long> input_material_ids, List<Long> output_material_ids, String executor_company_id, List<String> processesTypeNames, Map<Long, Double> input_material_id_percentage_map, List<String> processingStandards, List<SupplyChainCertificatePresentable> certificates) {
        this.id = id;
        this.name = name;
        this.productCategory = productCategory;
        this.input_material_ids = input_material_ids;
        this.output_material_ids = output_material_ids;
        this.executor_company_id = executor_company_id;
        this.processesTypeNames = processesTypeNames;
        this.input_material_id_percentage_map = input_material_id_percentage_map;
        this.processingStandards = processingStandards;
        this.certificates = certificates;
    }

    public SupplyChainTransformationPresentable() {
        this.input_material_ids = new ArrayList<>();
        this.output_material_ids = new ArrayList<>();
        this.input_material_id_percentage_map = new HashMap<>();
        this.certificates = new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public List<Long> getInput_material_ids() {
        return input_material_ids;
    }

    public List<Long> getOutput_material_ids() {
        return output_material_ids;
    }

    public String getExecutor_company_id() {
        return executor_company_id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }

    public void setInput_material_ids(List<Long> input_material_ids) {
        this.input_material_ids = input_material_ids;
    }

    public void setOutput_material_ids(List<Long> output_material_ids) {
        this.output_material_ids = output_material_ids;
    }

    public void setExecutor_company_id(String executor_company_id) {
        this.executor_company_id = executor_company_id;
    }

    public void addInput_material_ids(Long input_material_id) {
        this.input_material_ids.add(input_material_id);
    }

    public void addOutput_material_ids(Long input_material_id) {
        this.output_material_ids.add(input_material_id);
    }

    public List<String> getProcessesTypeNames() {
        return processesTypeNames;
    }

    public void setProcessesTypeNames(List<String> processesTypeNames) {
        this.processesTypeNames = processesTypeNames;
    }

    public Map<Long, Double> getInput_material_id_percentage_map() {
        return input_material_id_percentage_map;
    }

    public void setInput_material_id_percentage_map(Map<Long, Double> input_material_id_percentage_map) {
        this.input_material_id_percentage_map = input_material_id_percentage_map;
    }

    public void addInput_material_id_percentage(Long materialId, Double percentage){
        this.input_material_id_percentage_map.put(materialId, percentage);
    }

    public List<SupplyChainCertificatePresentable> getCertificates() {
        return certificates;
    }

    public void setCertificates(List<SupplyChainCertificatePresentable> certificates) {
        this.certificates = certificates;
    }

    public List<String> getProcessingStandards() {
        return processingStandards;
    }

    public void setProcessingStandards(List<String> processingStandards) {
        this.processingStandards = processingStandards;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SupplyChainTransformationPresentable that = (SupplyChainTransformationPresentable) o;
        return Objects.equals(id, that.id) && Objects.equals(name, that.name) && Objects.equals(input_material_ids, that.input_material_ids) && Objects.equals(output_material_ids, that.output_material_ids) && Objects.equals(executor_company_id, that.executor_company_id) && Objects.equals(processesTypeNames, that.processesTypeNames) && Objects.equals(input_material_id_percentage_map, that.input_material_id_percentage_map) && Objects.equals(certificates, that.certificates);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, input_material_ids, output_material_ids, executor_company_id, processesTypeNames, input_material_id_percentage_map, certificates);
    }
}
