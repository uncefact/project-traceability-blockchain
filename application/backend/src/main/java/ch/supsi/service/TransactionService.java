package ch.supsi.service;

import ch.supsi.exception.UneceException;
import ch.supsi.model.company.Company;
import ch.supsi.model.Material;
import ch.supsi.model.User;
import ch.supsi.model.position.Position;
import ch.supsi.model.transaction.Transaction;
import ch.supsi.repository.MaterialRepository;
import ch.supsi.repository.position.ContractPositionRepository;
import ch.supsi.repository.position.OrderPositionRepository;
import ch.supsi.repository.position.ShippingPositionRepository;
import ch.supsi.repository.transaction.certificate.CertificationTransactionRepository;
import ch.supsi.repository.transaction.trade.ContractTradeRepository;
import ch.supsi.repository.transaction.trade.OrderTradeRepository;
import ch.supsi.repository.transaction.trade.ShippingTradeRepository;
import ch.supsi.request.position.PositionRequest;
import ch.supsi.request.transaction.ConfirmationTransactionRequest;
import ch.supsi.util.UneceServer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final ContractTradeRepository contractTradeRepository;
    private final OrderTradeRepository orderTradeRepository;
    private final ShippingTradeRepository shippingTradeRepository;
    private final ContractPositionRepository contractPositionRepository;
    private final OrderPositionRepository orderPositionRepository;
    private final ShippingPositionRepository shippingPositionRepository;
    private final MaterialRepository materialRepository;
    private final CertificationTransactionRepository certificationTransactionRepository;
    private final LoginService loginService;

    public TransactionService(ContractTradeRepository contractTradeRepository, OrderTradeRepository orderTradeRepository, ShippingTradeRepository shippingTradeRepository, ContractPositionRepository contractPositionRepository, OrderPositionRepository orderPositionRepository, ShippingPositionRepository shippingPositionRepository, MaterialRepository materialRepository, CertificationTransactionRepository certificationTransactionRepository, LoginService loginService) {
        this.contractTradeRepository = contractTradeRepository;
        this.orderTradeRepository = orderTradeRepository;
        this.shippingTradeRepository = shippingTradeRepository;
        this.contractPositionRepository = contractPositionRepository;
        this.orderPositionRepository = orderPositionRepository;
        this.shippingPositionRepository = shippingPositionRepository;
        this.materialRepository = materialRepository;
        this.certificationTransactionRepository = certificationTransactionRepository;
        this.loginService = loginService;
    }

    @Transactional
    public void updateContractConfirmation(Long id, ConfirmationTransactionRequest confirmationTransactionRequest){
        contractTradeRepository.updateConfirmedContractTradeFields(id, confirmationTransactionRequest.getConsigneeReferenceNumber(), confirmationTransactionRequest.getTransactionStatus(), confirmationTransactionRequest.getConsigneeDate());
    }

    @Transactional
    public void updateOrderConfirmation(Long id, ConfirmationTransactionRequest confirmationTransactionRequest){
        orderTradeRepository.updateConfirmedOrderTradeFields(id, confirmationTransactionRequest.getConsigneeReferenceNumber(), confirmationTransactionRequest.getTransactionStatus(), confirmationTransactionRequest.getConsigneeDate());
    }

    @Transactional
    public void updateShippingConfirmation(Long id, ConfirmationTransactionRequest confirmationTransactionRequest){
        shippingTradeRepository.updateConfirmedShippingTradeFields(id, confirmationTransactionRequest.getConsigneeReferenceNumber(), confirmationTransactionRequest.getTransactionStatus(), confirmationTransactionRequest.getConsigneeDate());
    }

    @Transactional
    public void updateCertificationConfirmation(Long id, ConfirmationTransactionRequest confirmationTransactionRequest){
        certificationTransactionRepository.updateCertificateFields(id, confirmationTransactionRequest.getCertificationReferenceNumber(), confirmationTransactionRequest.getTransactionStatus(), confirmationTransactionRequest.getConsigneeDate());
    }

    @Transactional
    public void updateContractPositionsFromRequest(List<PositionRequest> positionRequests){
        List<Material> contractorMaterials = contractPositionRepository.findAllByIdIn(positionRequests.stream().map(PositionRequest::getId).collect(Collectors.toList()))
                .stream().map(Position::getContractorMaterial).collect(Collectors.toList());
        cachePositionConsigneeMaterials(positionRequests, contractorMaterials);
    }

    @Transactional
    public void updateOrderPositionsFromRequest(List<PositionRequest> positionRequests){
        List<Material> contractorMaterials = orderPositionRepository.findAllByIdIn(positionRequests.stream().map(PositionRequest::getId).collect(Collectors.toList()))
                .stream().map(Position::getContractorMaterial).collect(Collectors.toList());
        cachePositionConsigneeMaterials(positionRequests, contractorMaterials);
    }

    @Transactional
    public void updateShippingPositionsFromRequest(List<PositionRequest> positionRequests){
        List<Material> contractorMaterials = shippingPositionRepository.findAllByIdIn(positionRequests.stream().map(PositionRequest::getId).collect(Collectors.toList()))
                .stream().map(Position::getContractorMaterial).collect(Collectors.toList());
        cachePositionConsigneeMaterials(positionRequests, contractorMaterials);
    }

    public boolean isNotConsigneeEmployee(Company consignee) throws UneceException {
        User loggedUser = loginService.get(UneceServer.getLoggedUsername()).getUser();
        return !loggedUser.getCompany().getCompanyName().equals(consignee.getCompanyName());
    }

    public boolean isLoggedUserConsigneeOrContractor(Transaction transaction) throws UneceException {
        String loggedCompanyName = loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany().getCompanyName();

        if (loggedCompanyName.equals(transaction.getConsignee().getCompanyName()) || loggedCompanyName.equals(transaction.getContractor().getCompanyName()) || loggedCompanyName.equals("SUPSI"))
            return true;
        return false;
    }

    private void cachePositionConsigneeMaterials(List<PositionRequest> positionRequests, List<Material> contractorMaterials){
        Map<Material, List<Position>> contractPositionsToUpdate = new HashMap<>();
        Map<Material, List<Position>> orderPositionsToUpdate = new HashMap<>();
        Map<Material, List<Position>> shippingPositionsToUpdate = new HashMap<>();
        Material contractorMaterial, consigneeMaterial;
        // get all the possible positions involved in the update (all the ones that have the contractor material specified)
        for (int i=0; i<positionRequests.size(); i++){      // positionRequests and contractorMaterials have the same size because the contractorMaterials are the ones associated with the positions of positionRequests
            contractorMaterial = contractorMaterials.get(i);
            consigneeMaterial = materialRepository.getOne(positionRequests.get(i).getMaterial().getId());
            contractPositionsToUpdate.put(consigneeMaterial, contractPositionRepository.findAllByContractorMaterial(contractorMaterial));
            orderPositionsToUpdate.put(consigneeMaterial, orderPositionRepository.findAllByContractorMaterial(contractorMaterial));
            shippingPositionsToUpdate.put(consigneeMaterial, shippingPositionRepository.findAllByContractorMaterial(contractorMaterial));

            // remove from the collection to update the positions that are already cached with the consignee material (in order to avoid useless updates)
            int positionIndex = i;
            if (!contractPositionsToUpdate.get(consigneeMaterial).isEmpty())
                contractPositionsToUpdate.get(consigneeMaterial).removeIf(p -> p.getConsigneeMaterial() != null && p.getConsigneeMaterial().getName().equals(positionRequests.get(positionIndex).getMaterial().getName()));
            if (!orderPositionsToUpdate.get(consigneeMaterial).isEmpty())
                orderPositionsToUpdate.get(consigneeMaterial).removeIf(p -> p.getConsigneeMaterial() != null && p.getConsigneeMaterial().getName().equals(positionRequests.get(positionIndex).getMaterial().getName()));
            if (!shippingPositionsToUpdate.get(consigneeMaterial).isEmpty())
                shippingPositionsToUpdate.get(consigneeMaterial).removeIf(p -> p.getConsigneeMaterial() != null && p.getConsigneeMaterial().getName().equals(positionRequests.get(positionIndex).getMaterial().getName()));
        }

        // update the consignee material inside every position per each kind of position (differ by trade typology)
        contractPositionsToUpdate.forEach((key, value) -> value.forEach(position -> contractPositionRepository.updateContractPosition(position.getId(), key)));
        orderPositionsToUpdate.forEach((key, value) -> value.forEach(position -> orderPositionRepository.updateOrderPosition(position.getId(), key)));
        shippingPositionsToUpdate.forEach((key, value) -> value.forEach(position -> shippingPositionRepository.updateShippingPosition(position.getId(), key)));
    }

}
