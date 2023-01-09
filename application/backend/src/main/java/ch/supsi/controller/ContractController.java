//package ch.supsi.controller;
//
//import ch.supsi.service.CoreService;
//import ch.supsi.service.DocumentService;
//import ch.supsi.service.VoucherService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//
//@RestController
//@RequestMapping("/contracts")
//public class ContractController {
//    @Autowired
//    private DocumentService documentService;
//
//    @Autowired
//    private CoreService coreService;
//
//    @Autowired
//    private VoucherService voucherService;
//
////    @PostMapping("/{id}/validate")
////    @ResponseBody
////    public UneceResponseEntity postContractValidate(@PathVariable long id, @RequestParam(value = "action") String action,
////                                                    @RequestParam(value = "explanationValidation") String explanation) {
////        Contract contract = coreService.get(id);
////        if (action.equals("Validate")) {
////            contract.setStatus(ContractStatus.APPROVED);
////        } else if (action.equals("Reject")) {
////            contract.setStatus(ContractStatus.REJECTED);
////        }
////        contract.setExplanationValidation(explanation);
////        contract.setValidationDate(new Date());
////        coreService.updateContract(contract);
////        voucherService.removeVoucher(voucherService.getVoucherFromContract(contract).getVoucher());
////        return new UneceResponseEntity(new InfoResponse("Validation success"));
////    }
//
////    @GetMapping("/{id}")
////    public Contract contract(@PathVariable long id) {
////        return coreService.get(id);
////    }
//
////    @PostMapping("/create")
////    public Contract post(Contract contract, @RequestParam("doc") List<MultipartFile> files, Model model) throws IOException {
////        contract.setDateCreation(new Date());
////        contract.setStatus(ContractStatus.TO_APPROVE);
////        contract.setCreatedBy(coreService.getUser(UneceServer.getLoggedUsername()));
////
////        String consigneeEmail = contract.getConsigneeEmail() == null ? UneceServer.getLoggedUsername() : contract.getConsigneeEmail();
////        String contractorEmail = contract.getContractorEmail() == null ? UneceServer.getLoggedUsername() : contract.getContractorEmail();
////
////        if (consigneeEmail.charAt(consigneeEmail.length() - 1) == ',')
////            contract.setConsigneeEmail(consigneeEmail.substring(0, consigneeEmail.length() - 1));
////        else
////            contract.setConsigneeEmail(consigneeEmail);
////
////        if (contractorEmail.charAt(contractorEmail.length() - 1) == ',')
////            contract.setContractorEmail(contractorEmail.substring(0, contractorEmail.length() - 1));
////        else
////            contract.setContractorEmail(contractorEmail);
////
////        if (contract.getConsignee().equalsIgnoreCase("")) contract.setConsignee(contract.getFacilityName());
////        else if (contract.getContractor().equalsIgnoreCase("")) contract.setContractor(contract.getFacilityName());
////        String mailToSend = UneceServer.getLoggedUsername().equalsIgnoreCase(contract.getConsigneeEmail()) ? contract.getContractorEmail() : contract.getConsigneeEmail();
////        Contract contractSaved = coreService.post(contract, coreService.getUser(UneceServer.getLoggedUsername()), mailToSend);
////
////        for (MultipartFile file : files) {
////            if (!file.isEmpty()) {
//////            contract.setDocPDF(file.getBytes());
////                Document document = new Document(file.getOriginalFilename(), file.getContentType(), contractSaved, file.getBytes());
////                documentService.post(document);
////            }
////        }
////
////        model.addAttribute("contract", contractSaved);
////        return contractSaved;
////    }
//
////    @GetMapping(value = "/docs/{docId}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
////    public byte[] doc(@PathVariable long docId, HttpServletResponse response) {
////        Document doc = documentService.getDocumentFromId(docId);
////        response.setHeader("Content-Disposition", "attachment; filename=\"" + doc.getFileName() + "\"");
////        return doc.getDoc();
////    }

//}
