package ch.supsi.presentable.SupplyChain;


import ch.supsi.model.TraceabilityLevel;
import ch.supsi.model.TransparencyLevel;
import ch.supsi.model.transaction.TransactionStatus;
import ch.supsi.model.transaction.certification.CertificationSubject;
import ch.supsi.model.transaction.certification.CertificationTransaction;

import java.util.*;
import java.util.stream.Collectors;

public class SupplyChainCertificatePresentable {

    private final String certificateId;

    private final String certifierName;

    private String processingStandardName;
    private String processingStandardLogoPath;
    private String processingStandardSiteUrl;

    private final List<String> processTypes;

    private final String certificateTypeName;
    private final String assessmentTypeName;

    private final Date creationDate;
    private final Date validUntil;
    private final Date validFrom;
    private Date date;

    private String certificatePageURL;
    private Long documentId;
    private String documentFileName;

    private final CertificationSubject subject;
    private final TransactionStatus status;

    public SupplyChainCertificatePresentable(CertificationTransaction c, TraceabilityLevel traceabilityLevel) {
        this.certificateId = c.getCertificateReferenceNumber();
        this.certifierName = c.getContractor().getCompanyName();
        if (c.getProcessingStandard() != null){
            this.processingStandardName = c.getProcessingStandard().getName();
            this.processingStandardLogoPath = c.getProcessingStandard().getLogoPath();
            this.processingStandardSiteUrl = c.getProcessingStandard().getSiteUrl();
        }
        this.processTypes = c.getProcessTypes() != null ? c.getProcessTypes().stream().map(p -> p.getProcessType().getName()).collect(Collectors.toList()) : Collections.emptyList();
        this.validFrom = c.getValidFrom();
        this.validUntil = c.getValidUntil();
        this.certificateTypeName = c.getDocumentType().getName();
        this.assessmentTypeName = c.getAssessmentType()!=null ? c.getAssessmentType().getName() : null;
        this.creationDate = c.getContractorDate();
        this.documentId = null;
        this.documentFileName = null;
        this.certificatePageURL = null;
        if (traceabilityLevel != null && traceabilityLevel.getName().startsWith("3")){
            if (c.getCertificatePageUrl() != null){
                this.certificatePageURL = c.getCertificatePageUrl();
            }
            else {
                documentId = c.getDocument().getId();
                documentFileName = c.getDocument().getFileName();
            }
        }
        this.subject = c.getSubject();
        this.status = c.getStatus();
    }

    public String getCertificateId() {
        return certificateId;
    }

    public String getCertifierName() {
        return certifierName;
    }

    public String getProcessingStandardName() {
        return processingStandardName;
    }

    public String getProcessingStandardLogoPath() {
        return processingStandardLogoPath;
    }

    public String getProcessingStandardSiteUrl() {
        return processingStandardSiteUrl;
    }

    public List<String> getProcessTypes() { return processTypes; }

    public Date getValidUntil() {
        return validUntil;
    }

    public Date getValidFrom() {
        return validFrom;
    }

    public String getCertificateTypeName() {
        return certificateTypeName;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public String getCertificatePageURL() { return certificatePageURL; }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public String getDocumentFileName() {
        return documentFileName;
    }

    public void setDocumentFileName(String documentFileName) {
        this.documentFileName = documentFileName;
    }

    public String getAssessmentTypeName() {
        return assessmentTypeName;
    }

    public CertificationSubject getSubject() {
        return subject;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SupplyChainCertificatePresentable)) return false;
        SupplyChainCertificatePresentable that = (SupplyChainCertificatePresentable) o;
        return Objects.equals(certificateId, that.certificateId) && Objects.equals(processingStandardName, that.processingStandardName) && Objects.equals(processingStandardLogoPath, that.processingStandardLogoPath) && Objects.equals(processingStandardSiteUrl, that.processingStandardSiteUrl) && Objects.equals(validUntil, that.validUntil) && Objects.equals(validFrom, that.validFrom) && Objects.equals(certificateTypeName, that.certificateTypeName) && Objects.equals(assessmentTypeName, that.assessmentTypeName) && Objects.equals(creationDate, that.creationDate) && Objects.equals(documentId, that.documentId) && Objects.equals(documentFileName, that.documentFileName) && subject == that.subject && status == that.status;
    }

    @Override
    public int hashCode() {
        return Objects.hash(certificateId, processingStandardName, processingStandardLogoPath, processingStandardSiteUrl, validUntil, validFrom, certificateTypeName, assessmentTypeName, creationDate, documentId, documentFileName, subject, status);
    }
}
