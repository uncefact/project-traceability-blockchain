package ch.supsi.presentable.table;

import ch.supsi.model.transaction.certification.CertificationSubject;
import ch.supsi.model.transaction.certification.CertificationTransaction;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TableCertificationPresentable extends TableTransactionPresentable {
    private String certificateReferenceNumber;
    private String assessmentType;
    private String referencedStandard;
    private CertificationSubject subject;

    public TableCertificationPresentable(CertificationTransaction certification){
        super(certification);
        this.certificateReferenceNumber = certification.getCertificateReferenceNumber();
        this.assessmentType = certification.getAssessmentType() != null ? certification.getAssessmentType().getName() : null;
        this.subject = certification.getSubject();
        this.referencedStandard = certification.getProcessingStandard() != null ? certification.getProcessingStandard().getName() : null;
    }
}
