package ch.supsi.model.transaction.certification;

import ch.supsi.model.*;
import ch.supsi.model.company.Company;
import ch.supsi.model.company.CompanyIndustry;
import ch.supsi.model.processing_standard.ProcessingStandard;
import ch.supsi.model.transaction.Transaction;
import ch.supsi.model.transaction.TransactionStatus;
import ch.supsi.model.transaction.certification.assessment_type.AssessmentType;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Getter @Setter @NoArgsConstructor
public class CertificationTransaction extends Transaction {

    @ManyToOne
    private AssessmentType assessmentType;

    @OneToMany(mappedBy = "certificationTransaction")
    private List<CertificationTransactionProcessType> processTypes;

    @OneToMany(mappedBy = "certificationTransaction")
    private List<CertificationTransactionProductCategory> productCategories;

    private String certificateReferenceNumber;

    @Enumerated(EnumType.STRING)
    private CertificationSubject subject;

    @ManyToOne
    private Material material;

    private String certificatePageUrl;

    @ManyToMany
    @JoinTable(
            name = "certification_transaction_material",
            joinColumns = @JoinColumn(name = "certification_transaction_id"),
            inverseJoinColumns = @JoinColumn(name = "material_id"))
    private Set<Material> outputMaterials;

    public CertificationTransaction(String contractorReferenceNumber, Company consignee, Company contractor, DocumentType documentType, AssessmentType assessmentType, String certificateReferenceNumber, CertificationSubject subject){
        super(contractorReferenceNumber, consignee, contractor, documentType);
        this.certificateReferenceNumber = certificateReferenceNumber;
        this.assessmentType = assessmentType;
        this.subject = subject;
    }

    @Builder
    public CertificationTransaction(String contractorReferenceNumber, String consigneeReferenceNumber, Company contractor,
                                    Company consignee, Company approver, String contractorEmail, String consigneeEmail,
                                    Date validFrom, Date validUntil, Document document, DocumentType documentType, String notes,
                                    Date consigneeDate, Date contractorDate, TransactionStatus status, AssessmentType assessmentType,
                                    ProcessingStandard processingStandard, Material material, String certificateReferenceNumber,
                                    CertificationSubject subject, String certificatePageUrl) {
        super(contractorReferenceNumber, consigneeReferenceNumber, contractor, consignee, approver, contractorEmail, consigneeEmail, processingStandard, validFrom, validUntil, document, documentType, notes, consigneeDate, contractorDate, status);
        this.assessmentType = assessmentType;
        this.certificateReferenceNumber = certificateReferenceNumber;
        this.subject = subject;
        this.material = material;
        this.certificatePageUrl = certificatePageUrl;
    }

    public CertificationTransaction(String contractorReferenceNumber, Company consignee, Company contractor,
                                    DocumentType documentType,
                                    AssessmentType assessmentType,
                                    Document document,
                                    CertificationSubject subject){
        super(contractorReferenceNumber, consignee, contractor, documentType, document);
        this.assessmentType = assessmentType;
        this.subject = subject;
    }

}
