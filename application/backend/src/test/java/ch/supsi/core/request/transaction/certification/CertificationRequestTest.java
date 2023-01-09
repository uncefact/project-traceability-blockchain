package ch.supsi.core.request.transaction.certification;

import ch.supsi.core.request.UneceRequestTestTemplate;
import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.ProcessType;
import ch.supsi.model.transaction.certification.CertificationSubject;
import ch.supsi.presentable.MaterialPresentable;
import ch.supsi.request.DocumentRequest;
import ch.supsi.request.transaction.certification.CertificationRequest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

public class CertificationRequestTest extends UneceRequestTestTemplate {

    private CertificationRequest certificationRequest;
    private Date date;
    private DocumentRequest documentRequest;
    private MaterialPresentable material;
    private List<MaterialPresentable> outputMaterials;
    private ProcessType processType;

    @Override
    public void init() {
        date = new Date();
        documentRequest = new DocumentRequest("", "", "");
        material = new MaterialPresentable();
        outputMaterials = Collections.singletonList(new MaterialPresentable());
        processType = new ProcessType("processTypeCode", "processTypeName", null);
        certificationRequest = new CertificationRequest(
                "consigneeCompanyName",
                "consigneeEmail",
                "contractorCompanyName",
                "contractorEmail",
                "documentTypeCode",
                documentRequest,
                "processingStandardName",
                "assessmentName",
                Collections.singletonList("prodCategoryCode"),
                outputMaterials,
                Collections.singletonList(processType),
                Collections.singletonList("shippingRefNumber"),
                date,
                date,
                "1234",
                "notes",
                material,
                CertificationSubject.SELF,
                null,
                false
        );
    }

    @Override
    public void testGetters() {
        assertEquals("consigneeCompanyName", certificationRequest.getConsigneeCompanyName());
        assertEquals("consigneeEmail", certificationRequest.getConsigneeEmail());
        assertEquals("contractorCompanyName", certificationRequest.getContractorCompanyName());
        assertEquals("contractorEmail", certificationRequest.getContractorEmail());
        assertEquals("documentTypeCode", certificationRequest.getDocumentTypeCode());
        assertEquals(documentRequest, certificationRequest.getDocumentUpload());
        assertEquals("processingStandardName", certificationRequest.getProcessingStandardName());
        assertEquals("assessmentName", certificationRequest.getAssessmentName());
        assertEquals(Collections.singletonList("prodCategoryCode"), certificationRequest.getProductCategoryCodeList());
        assertEquals(outputMaterials, certificationRequest.getOutputMaterials());
        assertEquals(Collections.singletonList(processType), certificationRequest.getProcessTypes());
        assertEquals(Collections.singletonList("shippingRefNumber"), certificationRequest.getShippingReferenceNumbers());
        assertEquals(date, certificationRequest.getValidFrom());
        assertEquals(date, certificationRequest.getValidUntil());
        assertEquals("1234", certificationRequest.getCertificateReferenceNumber());
        assertEquals("notes", certificationRequest.getNotes());
        assertEquals(material, certificationRequest.getMaterial());
        assertEquals(CertificationSubject.SELF, certificationRequest.getSubject());
        assertFalse(certificationRequest.isInvitation());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        // test SELF validation
        certificationRequest.setProductCategoryCodeList(null);
        certificationRequest.setProcessTypes(null);
        certificationRequest.validate();

        // test SCOPE validation
        certificationRequest.validate();

        // test TRANSACTION validation
        certificationRequest.setSubject(CertificationSubject.TRANSACTION);
        certificationRequest.setContractorCompanyName(null);
        certificationRequest.setContractorEmail(null);
        certificationRequest.setValidUntil(null);
        certificationRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        certificationRequest.setSubject(CertificationSubject.SCOPE);
        certificationRequest.setConsigneeEmail(null);
        try {
            certificationRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
