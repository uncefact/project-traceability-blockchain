package ch.supsi.presentable.SupplyChain;

import ch.supsi.model.TraceabilityLevel;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class SupplyChainTradePresentable {
    private String type;
    private String referenceNumber;
    private Date creationDate;
    private Date issueDate;
    private Date validUntilDate;
    private Map<Long, Long> consignee_to_contractor_material_map;
    private Long documentId;
    private String documentFileName;
    private String documentType;
    private List<String> processingStandards;
    private List<SupplyChainCertificatePresentable> certificates;

    public SupplyChainTradePresentable(String type, String referenceNumber, Date creationDate, Date issueDate, Date validUntilDate, Map<Long, Long> consignee_to_contractor_material_map, Long documentId, String documentFileName, String documentType, List<String> processingStandards, List<SupplyChainCertificatePresentable> certificates, TraceabilityLevel traceabilityLevel) {
        this.type = type;
        this.referenceNumber = referenceNumber;
        this.creationDate = creationDate;
        this.issueDate = issueDate;
        this.validUntilDate = validUntilDate;
        this.consignee_to_contractor_material_map = consignee_to_contractor_material_map;
        this.documentId = null;
        this.documentFileName = null;
        if (traceabilityLevel != null && traceabilityLevel.getName().startsWith("3")){
            this.documentId = documentId;
            this.documentFileName = documentFileName;
        }
        this.documentType = documentType;
        this.processingStandards = processingStandards;
        this.certificates = certificates;
    }

    public String getType() {
        return type;
    }

    public Map<Long, Long> getConsignee_to_contractor_material_map() {
        return consignee_to_contractor_material_map;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public String getDocumentFileName() {
        return documentFileName;
    }

    public String getDocumentType() {
        return documentType;
    }

    public List<String> getProcessingStandards() {
        return processingStandards;
    }

    public List<SupplyChainCertificatePresentable> getCertificates() {
        return certificates;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public Date getCreationDate() { return creationDate; }

    public Date getIssueDate() {
        return issueDate;
    }

    public Date getValidUntilDate() { return validUntilDate; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SupplyChainTradePresentable)) return false;
        SupplyChainTradePresentable that = (SupplyChainTradePresentable) o;
        return Objects.equals(type, that.type) && Objects.equals(referenceNumber, that.referenceNumber) && Objects.equals(creationDate, that.creationDate) && Objects.equals(issueDate, that.issueDate) && Objects.equals(validUntilDate, that.validUntilDate) && Objects.equals(consignee_to_contractor_material_map, that.consignee_to_contractor_material_map) && Objects.equals(documentId, that.documentId) && Objects.equals(documentFileName, that.documentFileName) && Objects.equals(documentType, that.documentType) && Objects.equals(processingStandards, that.processingStandards) && Objects.equals(certificates, that.certificates);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, referenceNumber, creationDate, issueDate, validUntilDate, consignee_to_contractor_material_map, documentId, documentFileName, documentType, processingStandards, certificates);
    }
}
