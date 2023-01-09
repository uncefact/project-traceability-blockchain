package ch.supsi.presentable.confirmation;

import ch.supsi.model.transaction.certification.CertificationSubject;
import ch.supsi.model.transaction.certification.CertificationTransaction;
import ch.supsi.presentable.MaterialPresentable;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class ConfirmationCertificationPresentable extends ConfirmationTransactionPresentable {
    private MaterialPresentable material;
    private List<String> shippingReferenceNumbers = new ArrayList<>();
    private String assessmentType;
    private List<String> productCategories;
    private List<String> processTypes;
    private CertificationSubject subject;
    private String certificateReferenceNumber;
    private String certificatePageUrl;
    private List<MaterialPresentable> outputMaterials;

    public ConfirmationCertificationPresentable(CertificationTransaction certification){
        super(certification);
        this.material = certification.getMaterial() != null ? new MaterialPresentable(certification.getMaterial()) : null;
        this.processTypes = certification.getProcessTypes() != null ? certification.getProcessTypes().stream().map(pt -> pt.getProcessType().getCode() + " - " + pt.getProcessType().getName()).collect(Collectors.toList()) : null;
        this.productCategories = certification.getProductCategories() != null ? certification.getProductCategories().stream().map(pt -> pt.getProductCategory().getCode() + " - " + pt.getProductCategory().getName()).collect(Collectors.toList()) : null;
        this.assessmentType = certification.getAssessmentType() != null ? certification.getAssessmentType().getName() : null;
        this.subject = certification.getSubject();
        this.certificateReferenceNumber = certification.getCertificateReferenceNumber();
        this.certificatePageUrl = certification.getCertificatePageUrl();
        this.outputMaterials = certification.getOutputMaterials() != null ? certification.getOutputMaterials().stream().map(MaterialPresentable::new).collect(Collectors.toList()) : null;
    }

    public void setShippingReferenceNumbers(List<String> shippingReferenceNumbers) {
        this.shippingReferenceNumbers = shippingReferenceNumbers;
    }

}
