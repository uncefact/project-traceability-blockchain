package ch.supsi.controller;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.User;
import ch.supsi.model.transaction.TransactionStatus;
import ch.supsi.model.transaction.certification.CertificationTransaction;
import ch.supsi.model.transaction.trade.ContractTrade;
import ch.supsi.model.transaction.trade.OrderTrade;
import ch.supsi.model.transaction.trade.ShippingTrade;
import ch.supsi.request.transaction.ConfirmationTransactionRequest;
import ch.supsi.service.*;
import ch.supsi.util.UneceServer;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;

@RestController
@RequestMapping("/transactions")
//@PreAuthorize("hasPermission('company', 'trader')")
public class TransactionController {

    private final TransactionService transactionService;
    private final TradeService tradeService;
    private final CertificationService certificationService;
    private final MailService mailService;
    private final CompanyService companyService;
    private final LoginService loginService;

    public TransactionController(TransactionService transactionService, TradeService tradeService, CertificationService certificationService, MailService mailService, CompanyService companyService, LoginService loginService) {
        this.transactionService = transactionService;
        this.tradeService = tradeService;
        this.certificationService = certificationService;
        this.mailService = mailService;
        this.companyService = companyService;
        this.loginService = loginService;
    }

    @PostMapping("/{id}/confirmation")
    @Operation(summary = "Confirm a transaction", security = @SecurityRequirement(name = "bearerAuth"))
    public String confirmTransaction(@PathVariable Long id, @RequestBody ConfirmationTransactionRequest confirmationTransactionRequest, @RequestParam(name = "type") String transactionType) throws UneceException {
        confirmationTransactionRequest.validate();
        confirmationTransactionRequest.setConsigneeDate(new Date());
        if (confirmationTransactionRequest.getConsigneeReferenceNumber() != null && confirmationTransactionRequest.getConsigneeReferenceNumber().equals(""))
            confirmationTransactionRequest.setConsigneeReferenceNumber(null);

        User loggedUser = this.loginService.get(UneceServer.getLoggedUsername()).getUser();

        switch (transactionType){
            case "contract":
                ContractTrade contractTrade = this.tradeService.getContractFromID(id);
                if (transactionService.isNotConsigneeEmployee(contractTrade.getConsignee()))
                    throw new ResponseStatusException(UneceError.UNAUTHORIZED.getHttpStatus(), "User is not authorize to confirm this trade", new UneceException(UneceError.UNAUTHORIZED));
                transactionService.updateContractConfirmation(id, confirmationTransactionRequest);
                if (!confirmationTransactionRequest.getTransactionStatus().equals(TransactionStatus.REFUSED))
                    transactionService.updateContractPositionsFromRequest(confirmationTransactionRequest.getPositions());
                break;
            case "order":
                OrderTrade orderTrade = this.tradeService.getOrderFromID(id);
                if (transactionService.isNotConsigneeEmployee(orderTrade.getConsignee()))
                    throw new ResponseStatusException(UneceError.UNAUTHORIZED.getHttpStatus(), "User is not authorize to confirm this trade", new UneceException(UneceError.UNAUTHORIZED));
                transactionService.updateOrderConfirmation(id, confirmationTransactionRequest);
                if (!confirmationTransactionRequest.getTransactionStatus().equals(TransactionStatus.REFUSED))
                    transactionService.updateOrderPositionsFromRequest(confirmationTransactionRequest.getPositions());
                break;
            case "shipping":
                ShippingTrade shippingTrade = this.tradeService.getShippingFromID(id);
                if (transactionService.isNotConsigneeEmployee(shippingTrade.getConsignee()))
                    throw new ResponseStatusException(UneceError.UNAUTHORIZED.getHttpStatus(), "User is not authorize to confirm this trade", new UneceException(UneceError.UNAUTHORIZED));
                transactionService.updateShippingConfirmation(id, confirmationTransactionRequest);
                if (!confirmationTransactionRequest.getTransactionStatus().equals(TransactionStatus.REFUSED))
                    transactionService.updateShippingPositionsFromRequest(confirmationTransactionRequest.getPositions());
                break;
            case "certification":
                CertificationTransaction certificationTransaction = this.certificationService.getCertificateFromId(id);
                if(!loggedUser.getCompany().getCompanyName().equals(certificationTransaction.getApprover().getCompanyName()))
                    throw new ResponseStatusException(UneceError.UNAUTHORIZED.getHttpStatus(), "User is not authorize to confirm this certification", new UneceException(UneceError.UNAUTHORIZED));

                transactionService.updateCertificationConfirmation(id, confirmationTransactionRequest);

                for(ShippingTrade shippingTrade1 : this.tradeService.getAllShippingByCertification(certificationTransaction))
                    this.mailService.sendShippingCertifiedToConsignee(shippingTrade1);
                break;
            default:
                throw new UneceException(UneceError.INVALID_VALUE, "Wrong transaction type!");
        }
        return "Transaction successfully confirmed";
    }

}
