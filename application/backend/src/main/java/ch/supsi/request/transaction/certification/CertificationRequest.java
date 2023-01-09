package ch.supsi.request.transaction.certification;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.ProcessType;
import ch.supsi.model.transaction.certification.CertificationSubject;
import ch.supsi.presentable.MaterialPresentable;
import ch.supsi.request.DocumentRequest;
import ch.supsi.request.UneceRequest;
import ch.supsi.request.transaction.TransactionRequest;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter @Setter
public class CertificationRequest extends TransactionRequest {

    private String contractorCompanyName;
    private String contractorEmail;

    private String assessmentName;

    private List<String> productCategoryCodeList;
    private List<MaterialPresentable> outputMaterials;
    private List<ProcessType> processTypes;

    private List<String> shippingReferenceNumbers;

    private String certificateReferenceNumber;

    private MaterialPresentable material;

    private CertificationSubject subject;

    private String certificatePageUrl;

    @Override
    public void validate() throws UneceException {
        super.validate();
        notNull(subject, "subject");
        if(super.getDocumentUpload().getContent() == null && certificatePageUrl.isEmpty())
            throw new UneceException(UneceError.PARAMETER_MISSING, "Attachment document or page URL is mandatory");
        notNull(assessmentName, "assessmentName");
        notNull(certificateReferenceNumber, "certificateReferenceNumber");

        switch (subject) {
            case SCOPE:
                notNull(super.getConsigneeCompanyName(), "consigneeCompanyName");
                notNull(super.getConsigneeEmail(), "consigneeEmail");
                notNull(super.getValidUntil(), "validUntil");
                isNull(shippingReferenceNumbers, "shippingReferenceNumber");
                isNull(contractorCompanyName, "contractorCompanyName");
                isNull(contractorEmail, "contractorEmail");
                break;
            case TRANSACTION:
                notNull(super.getConsigneeCompanyName(), "consigneeCompanyName");
                notNull(super.getConsigneeEmail(), "consigneeEmail");
                isNull(productCategoryCodeList, "productCategoryCodeList");
                isNull(processTypes, "processTypeCodeList");
                isNull(super.getValidUntil(), "validUntil");
                notNull(shippingReferenceNumbers, "shippingReferenceNumber");
                isNull(contractorCompanyName, "contractorCompanyName");
                isNull(contractorEmail, "contractorEmail");
                break;
            case MATERIAL:
                notNull(super.getConsigneeCompanyName(), "consigneeCompanyName");
                notNull(super.getConsigneeEmail(), "consigneeEmail");
                notNull(super.getValidUntil(), "validUntil");
                isNull(shippingReferenceNumbers, "shippingReferenceNumber");
                notNull(material, "material");
                isNull(contractorCompanyName, "contractorCompanyName");
                isNull(contractorEmail, "contractorEmail");
                break;
            case SELF:
                isNull(productCategoryCodeList, "productCategoryCodeList");
                isNull(processTypes, "processTypeCodeList");
                break;
            default:
                throw new UneceException(UneceError.CERTIFICATION_TYPE_NOT_FOUND);
        }
    }

    public CertificationRequest(String consigneeCompanyName, String consigneeEmail, String contractorCompanyName,
                                String contractorEmail, String certificationTypeCode, DocumentRequest documentUpload,
                                String processingStandardName, String assessmentName, List<String> productCategoryCodeList,
                                List<MaterialPresentable> outputMaterials, List<ProcessType> processTypes,
                                List<String> shippingReferenceNumbers, Date validFrom, Date validUntil,
                                String certificateReferenceNumber, String notes, MaterialPresentable material,
                                CertificationSubject subject, String certificatePageUrl, boolean isInvitation) {
        super(consigneeCompanyName, consigneeEmail, validFrom, validUntil, certificationTypeCode, documentUpload,
                processingStandardName, notes, isInvitation);
        this.contractorCompanyName = contractorCompanyName;
        this.contractorEmail = contractorEmail;
        this.assessmentName = assessmentName;
        this.productCategoryCodeList = productCategoryCodeList;
        this.outputMaterials = outputMaterials;
        this.processTypes = processTypes;
        this.shippingReferenceNumbers = shippingReferenceNumbers;
        this.certificateReferenceNumber = certificateReferenceNumber;
        this.material = material;
        this.subject = subject;
        this.certificatePageUrl = certificatePageUrl;
    }
}
