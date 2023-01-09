package ch.supsi.controller;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.*;
import ch.supsi.model.company.Company;
import ch.supsi.presentable.DocumentTypePresentable;
import ch.supsi.service.*;
import ch.supsi.util.UneceServer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final DocumentService documentService;
    private final LoginService loginService;
    private final TransformationPlanService transformationPlanService;
    private final SupplyChainInfoService supplyChainInfoService;
    private final CertificationService certificationService;
    private final TransactionService transactionService;

    public DocumentController(DocumentService documentService, LoginService loginService, TransformationPlanService transformationPlanService, SupplyChainInfoService supplyChainInfoService, CertificationService certificationService, TransactionService transactionService) {
        this.documentService = documentService;
        this.loginService = loginService;
        this.transformationPlanService = transformationPlanService;
        this.supplyChainInfoService = supplyChainInfoService;
        this.certificationService = certificationService;
        this.transactionService = transactionService;
    }

    @GetMapping("/types")
    public List<DocumentTypePresentable> getDocumentTypes(@RequestParam(name = "type") String transactionType) throws UneceException {
        List<DocumentType> documentTypes;
        switch (transactionType) {
            case "contract":
                documentTypes = documentService.getContractDocumentTypes();
                break;
            case "order":
                documentTypes = documentService.getOrderDocumentTypes();
                break;
            case "shipping":
                documentTypes = documentService.getShippingDocumentTypes();
                break;
            case "scope_certification":
                documentTypes = documentService.getScopeCertificationDocumentTypes();
                break;
            case "transaction_certification":
                documentTypes = documentService.getTransactionCertificationDocumentTypes();
                break;
            case "material_certification":
                documentTypes = documentService.getMaterialCertificationDocumentTypes();
                break;
            case "self_certification":
                documentTypes = documentService.getSelfCertificationDocumentTypes();
                break;
            default:
                throw new UneceException(UneceError.INVALID_VALUE, "Wrong transaction type filter for document types!");
        }
        return documentTypes.stream().map(DocumentTypePresentable::new).collect(Collectors.toList());
    }

    @RequestMapping(method = RequestMethod.GET, value = "/{docId}")
    public ResponseEntity<byte[]> getDocument(@PathVariable Long docId) throws UneceException {
        Optional<Document> doc = this.documentService.getDocumentById(docId);

        if (!doc.isPresent())
            throw new UneceException(UneceError.DOCUMENT_NOT_FOUND);

        Company currentCompany = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();

        //If I am the certifier or the subject under certification I am able to download the pdf, otherwise I have to check the supply chain
        boolean isDocumentInvolvedInMyTransactions = documentService.isDocumentInvolvedInMyTransactions(docId, currentCompany);
        boolean isDocumentDownloadableFromCompany = documentService.isDocumentDownloadableFromCompany(currentCompany, docId);
        if (isDocumentInvolvedInMyTransactions || isDocumentDownloadableFromCompany) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.get().getFileName() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(doc.get().getContent());
        }

        throw new UneceException(UneceError.UNAUTHORIZED);

//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
//                .body(doc.getContent());
    }
}
