package ch.supsi.controller;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.company.Company;
import ch.supsi.model.User;
import ch.supsi.model.position.Position;
import ch.supsi.model.transaction.TransactionStatus;
import ch.supsi.model.transaction.trade.*;
import ch.supsi.presentable.ProcessingStandardPresentable;
import ch.supsi.presentable.TradePresentable;
import ch.supsi.presentable.confirmation.ConfirmationTradePresentable;
import ch.supsi.presentable.table.TableTradePresentable;
import ch.supsi.request.transaction.trade.*;
import ch.supsi.service.*;
import ch.supsi.util.UneceServer;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.beans.IntrospectionException;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/trades")
public class TradeController {

    private final TradeService tradeService;
    private final LoginService loginService;
    private final CompanyService companyService;
    private final DocumentService documentService;
    private final MailService mailService;
    private final TransactionService transactionService;
    private final ProcessingStandardService processingStandardService;
    private final CertificationService certificationService;

    public TradeController(TradeService tradeService, MailService mailService, LoginService loginService, CompanyService companyService, DocumentService documentService, TransactionService transactionService, ProcessingStandardService processingStandardService, CertificationService certificationService) {
        this.tradeService = tradeService;
        this.loginService = loginService;
        this.companyService = companyService;
        this.documentService = documentService;
        this.mailService = mailService;
        this.transactionService = transactionService;
        this.processingStandardService = processingStandardService;
        this.certificationService = certificationService;
    }

    @GetMapping("/contracts")
//    @PreAuthorize("hasPermission('company', 'trader')")
    public List<TableTradePresentable> getContracts() throws UneceException {
        Company company = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();
        Set<ContractTrade> contracts = new HashSet<>(tradeService.getContractsFromContractorCompanyName(company.getCompanyName()));
        contracts.addAll(tradeService.getContractsFromConsigneeCompanyName(company.getCompanyName()));
        return contracts.stream()
                .map(contract -> new TableTradePresentable(contract, tradeService.getPositionsFromContractId(contract.getId())))
                .collect(Collectors.toList());
    }

    @GetMapping("/orders")
//    @PreAuthorize("hasPermission('company', 'trader')")
    public List<TableTradePresentable> getOrders() throws UneceException {
        Company company = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();
        Set<OrderTrade> orders = new HashSet<>(tradeService.getOrdersFromContractorCompanyName(company.getCompanyName()));
        orders.addAll(tradeService.getOrdersFromConsigneeCompanyName(company.getCompanyName()));
        return orders.stream()
                .map(order -> new TableTradePresentable(order, tradeService.getPositionsFromOrderId(order.getId())))
                .collect(Collectors.toList());
    }

    @GetMapping("/shippings")
    public List<TableTradePresentable> getShippings() throws UneceException {
        Company company = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();
        return this.tradeService.getAllShippingByCompanyName(company.getCompanyName())
                .stream()
                .map(s -> new TableTradePresentable(s, tradeService.getPositionsFromShippingId(s.getId())))
                .collect(Collectors.toList());
    }

    @GetMapping("/shippingsByCompany")
    public List<TradePresentable> getShippingsByCompany(@RequestParam(name = "companyName") String companyName) {
        //This method is used for Certification
        // TODO add control that the requester user has correct visibility level
        return this.tradeService.getAllShippingByCompanyName(companyName)
                .stream()
                .map(s -> {
                    TradePresentable shippingPresentable = new TradePresentable(s, this.tradeService.getPositionsFromShippingId(s.getId()));
                    if(s.getCertificationTransaction() != null)
                        shippingPresentable.setCertified(true);
                    return shippingPresentable;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/contracts/{id}")
//    @PreAuthorize("hasPermission('company', 'trader')")
    public ConfirmationTradePresentable getContractById(@PathVariable Long id) throws UneceException {
        ContractTrade contractFromID = tradeService.getContractFromID(id);
        if (contractFromID == null)
            throw new UneceException(UneceError.TRANSACTION_NOT_FOUND);
        if (!transactionService.isLoggedUserConsigneeOrContractor(contractFromID))
            throw new ResponseStatusException(UneceError.FORBIDDEN.getHttpStatus(), "You don't have access to this transaction!", new UneceException(UneceError.FORBIDDEN));
        return new ConfirmationTradePresentable(contractFromID, tradeService.getPositionsFromContractId(id));
    }

    @GetMapping("/orders/{id}")
//    @PreAuthorize("hasPermission('company', 'trader')")
    public ConfirmationTradePresentable getOrderById(@PathVariable Long id) throws UneceException {
        OrderTrade orderFromID = tradeService.getOrderFromID(id);
        if (orderFromID == null)
            throw new UneceException(UneceError.TRANSACTION_NOT_FOUND);
        if (!transactionService.isLoggedUserConsigneeOrContractor(orderFromID))
            throw new ResponseStatusException(UneceError.FORBIDDEN.getHttpStatus(), "You don't have access to this transaction!", new UneceException(UneceError.FORBIDDEN));
        return new ConfirmationTradePresentable(orderFromID, tradeService.getPositionsFromOrderId(id));
    }

    @GetMapping("/shippings/{id}")
//    @PreAuthorize("hasPermission('company', 'trader')")
    public ConfirmationTradePresentable getShippingById(@PathVariable Long id) throws UneceException {
        ShippingTrade shippingFromID = tradeService.getShippingFromID(id);
        if (shippingFromID == null)
            throw new UneceException(UneceError.TRANSACTION_NOT_FOUND);
        if (!transactionService.isLoggedUserConsigneeOrContractor(shippingFromID))
//            TODO: it is needed a way to throw an error message to the frontend in order to display a custom message depending on the problem
            throw new ResponseStatusException(UneceError.FORBIDDEN.getHttpStatus(), "You don't have access to this transaction!", new UneceException(UneceError.FORBIDDEN));
        return new ConfirmationTradePresentable(shippingFromID, tradeService.getPositionsFromShippingId(id));
    }

    @PostMapping(value = "/contract/create")
    @Operation(summary = "Create a new contract", security = @SecurityRequirement(name = "bearerAuth"))
//    @PreAuthorize("hasPermission('company', 'trader')")
    public TradePresentable createContract(@RequestBody ContractRequest contractRequest) throws UneceException {
        contractRequest.validate();
        ContractTrade savedTrade = new ContractTrade();
        List<Position> positionsSaved = null;
        try {
            if (contractRequest.isInvitation())
                companyService.inviteCompanyFromTransactionRequest(contractRequest, false);
            savedTrade = tradeService.saveContract((ContractTrade) this.updateTrade(savedTrade, contractRequest));
            savedTrade.setContractorReferenceNumber(contractRequest.getContractorReferenceNumber().equals("") ? null : contractRequest.getContractorReferenceNumber());
            positionsSaved = tradeService.saveContractPositionsForContract(contractRequest.getPositions(), savedTrade);

            mailService.sendConfirmationTradeEmail(savedTrade, savedTrade.getConsigneeEmail(), "contract");
        } catch (IllegalAccessException | IntrospectionException | InvocationTargetException e) {
            e.printStackTrace();
            savedTrade = null;
        }
        return new TradePresentable(savedTrade, positionsSaved);
    }

    @PostMapping("/order/create")
    @Operation(summary = "Create a new order", security = @SecurityRequirement(name = "bearerAuth"))
//    @PreAuthorize("hasPermission('company', 'trader')")
    public TradePresentable createOrder(@RequestBody OrderRequest orderRequest) throws UneceException {
        orderRequest.validate();
        OrderTrade savedTrade = new OrderTrade();
        List<Position> positionsSaved = null;
        try {
            if (orderRequest.isInvitation())
                companyService.inviteCompanyFromTransactionRequest(orderRequest, false);
            this.updateTrade(savedTrade, orderRequest);
            savedTrade.setContractorRootReference(tradeService.getContractFromContractorReferenceNumber(orderRequest.getContractorRootReferenceNumber()));
            savedTrade.setContractorReferenceNumber(orderRequest.getContractorReferenceNumber().equals("") ? null : orderRequest.getContractorReferenceNumber());
            savedTrade = tradeService.saveOrder(savedTrade);
            positionsSaved = tradeService.saveOrderPositionsForOrder(orderRequest.getPositions(), savedTrade);

            mailService.sendConfirmationTradeEmail(savedTrade, savedTrade.getConsigneeEmail(), "order");
        } catch (IllegalAccessException | IntrospectionException | InvocationTargetException e) {
            e.printStackTrace();
            savedTrade = null;
        }
        return new TradePresentable(savedTrade, positionsSaved);
    }

    @PostMapping("/shipping/create")
    @Operation(summary = "Create a new contract", security = @SecurityRequirement(name = "bearerAuth"))
//    @PreAuthorize("hasPermission('company', 'trader')")
    public TradePresentable createShipping(@RequestBody ShippingRequest shippingRequest) throws UneceException {
        shippingRequest.validate();
        ShippingTrade savedTrade = new ShippingTrade();
        List<Position> positionsSaved = null;
        try {
            if (shippingRequest.isInvitation())
                companyService.inviteCompanyFromTransactionRequest(shippingRequest, false);
            this.updateTrade(savedTrade, shippingRequest);
            savedTrade.setContractorReferenceNumber(shippingRequest.getContractorReferenceNumber());
            savedTrade.setContractorParentReference(tradeService.getOrderFromContractorReferenceNumber(shippingRequest.getContractorParentReferenceNumber()));
            savedTrade = tradeService.saveShipping(savedTrade);
            positionsSaved = tradeService.saveShippingPositionsForShipping(shippingRequest.getPositions(), savedTrade);

            mailService.sendConfirmationTradeEmail(savedTrade, savedTrade.getConsigneeEmail(), "shipping");
        } catch (IllegalAccessException | IntrospectionException | InvocationTargetException e) {
            e.printStackTrace();
            savedTrade = null;
        }
        return new TradePresentable(savedTrade, positionsSaved);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a trade", security = @SecurityRequirement(name = "bearerAuth"))
    public void updateTrade(@PathVariable Long id, @RequestBody UpdateTradeRequest updateTradeRequest) throws UneceException {
        updateTradeRequest.validate();
        tradeService.updateTradeFromRequest(id, updateTradeRequest);
    }


    @GetMapping("/processingStandards")
//    @PreAuthorize("hasPermission('company', 'trader')")
    public List<ProcessingStandardPresentable> getTradeProcessingStandards() throws UneceException {
        Company loggedCompany = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();
        return certificationService.getTransactionCertificationReferencedStandards(loggedCompany.getCompanyIndustry()).stream().map(ProcessingStandardPresentable::new).collect(Collectors.toList());
    }

    private <T extends Trade> Trade updateTrade(T savedTrade, TradeRequest tradeRequest) throws IllegalAccessException, IntrospectionException, InvocationTargetException, UneceException {
        User loggedUser = loginService.get(UneceServer.getLoggedUsername()).getUser();

        savedTrade.setConsigneeEmail(tradeRequest.getConsigneeEmail());
        savedTrade.setValidFrom(tradeRequest.getValidFrom());
        savedTrade.setValidUntil(tradeRequest.getValidUntil());
        savedTrade.setNotes(tradeRequest.getNotes());
        savedTrade.setConsignee(companyService.getCompanyFromName(tradeRequest.getConsigneeCompanyName()));
        savedTrade.setDocumentType(documentService.getDocumentTypeFromCode(tradeRequest.getDocumentTypeCode()));
        savedTrade.setContractorDate(new Date());
        savedTrade.setContractor(loggedUser.getCompany());
        savedTrade.setContractorEmail(loggedUser.getEmail());
        savedTrade.setApprover(savedTrade.getConsignee());
        savedTrade.setStatus(TransactionStatus.PENDING);
        savedTrade.setDocument(documentService.saveDocumentFromRequest(tradeRequest.getDocumentUpload()));
        savedTrade.setProcessingStandard(processingStandardService.getProcessingStandardByName(tradeRequest.getProcessingStandardName()));

        return savedTrade;
    }

}
