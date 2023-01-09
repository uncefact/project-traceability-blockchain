package ch.supsi.service;

import ch.supsi.model.company.Company;
import ch.supsi.model.Material;
import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.position.ContractPosition;
import ch.supsi.model.position.OrderPosition;
import ch.supsi.model.position.Position;
import ch.supsi.model.position.ShippingPosition;
import ch.supsi.model.transaction.Transaction;
import ch.supsi.model.transaction.certification.CertificationTransaction;
import ch.supsi.model.transaction.trade.ContractTrade;
import ch.supsi.model.transaction.trade.OrderTrade;
import ch.supsi.model.transaction.trade.ShippingTrade;
import ch.supsi.model.transaction.trade.Trade;
import ch.supsi.repository.MaterialRepository;
import ch.supsi.repository.position.ContractPositionRepository;
import ch.supsi.repository.position.OrderPositionRepository;
import ch.supsi.repository.position.ShippingPositionRepository;
import ch.supsi.repository.transaction.trade.ContractTradeRepository;
import ch.supsi.repository.transaction.trade.OrderTradeRepository;
import ch.supsi.repository.transaction.trade.ShippingTradeRepository;
import ch.supsi.request.transaction.trade.UpdateTradeRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TradeService {

    private final ContractTradeRepository contractTradeRepository;
    private final OrderTradeRepository orderTradeRepository;
    private final ShippingTradeRepository shippingTradeRepository;
    private final ContractPositionRepository contractPositionRepository;
    private final OrderPositionRepository orderPositionRepository;
    private final ShippingPositionRepository shippingPositionRepository;
    private final MaterialRepository materialRepository;
    private final MaterialService materialService;

    public TradeService(ContractTradeRepository contractTradeRepository, OrderTradeRepository orderTradeRepository, ShippingTradeRepository shippingTradeRepository, ContractPositionRepository contractPositionRepository, OrderPositionRepository orderPositionRepository, ShippingPositionRepository shippingPositionRepository, MaterialRepository materialRepository, MaterialService materialService) {
        this.contractTradeRepository = contractTradeRepository;
        this.orderTradeRepository = orderTradeRepository;
        this.shippingTradeRepository = shippingTradeRepository;
        this.contractPositionRepository = contractPositionRepository;
        this.orderPositionRepository = orderPositionRepository;
        this.shippingPositionRepository = shippingPositionRepository;
        this.materialRepository = materialRepository;
        this.materialService = materialService;
    }

    public ContractTrade getContractFromID(Long id){
        return contractTradeRepository.getOne(id);
    }

    public List<ContractTrade> getContractsFromContractorCompanyName(String contractorCompanyName){
        return contractTradeRepository.findByContractorCompanyName(contractorCompanyName);
    }

    public List<ContractTrade> getContractsFromConsigneeCompanyName(String consigneeCompanyName){
        return contractTradeRepository.findByConsigneeCompanyName(consigneeCompanyName);
    }

    public List<OrderTrade> getOrdersFromContractorCompanyName(String contractorCompanyName){
        return orderTradeRepository.findByContractorCompanyName(contractorCompanyName);
    }

    public List<OrderTrade> getOrdersFromConsigneeCompanyName(String consigneeCompanyName){
        return orderTradeRepository.findByConsigneeCompanyName(consigneeCompanyName);
    }

    public List<ShippingTrade> getShippingFromContractorCompanyName(String contractorCompanyName){
        return shippingTradeRepository.findByContractorCompanyName(contractorCompanyName);
    }

    public List<ShippingTrade> getShippingFromConsigneeCompanyName(String consigneeCompanyName){
        return shippingTradeRepository.findByConsigneeCompanyName(consigneeCompanyName);
    }


    public List<ShippingTrade> getAllShippingByCompanyName(String companyName){
        Set<ShippingTrade> shipping = new HashSet<>(this.getShippingFromContractorCompanyName(companyName));
        shipping.addAll(this.getShippingFromConsigneeCompanyName(companyName));
        return new ArrayList<>(shipping);
    }


    public ContractTrade getContractFromContractorReferenceNumber(String contractorReferenceNumber){
        return contractTradeRepository.findByContractorReferenceNumber(contractorReferenceNumber);
    }

    public OrderTrade getOrderFromContractorReferenceNumber(String contractorReferenceNumber){
        return orderTradeRepository.findByContractorReferenceNumber(contractorReferenceNumber);
    }

    public ShippingTrade getShippingByContractorReferenceNumber(String contractorReferenceNumber){
        return this.shippingTradeRepository.findByContractorReferenceNumber(contractorReferenceNumber);
    }

    public OrderTrade getOrderFromID(Long id){
        return orderTradeRepository.getOne(id);
    }

    public ShippingTrade getShippingFromID(Long id){
        return shippingTradeRepository.getOne(id);
    }

    public ContractTrade saveContract(ContractTrade contract){
        return contractTradeRepository.save(contract);
    }

    public OrderTrade saveOrder(OrderTrade order){
        return orderTradeRepository.save(order);
    }

    public ShippingTrade saveShipping(ShippingTrade shipping){
        return shippingTradeRepository.save(shipping);
    }

    @Transactional
    public void updateTradeFromRequest(Long id, UpdateTradeRequest updateTradeRequest){
        switch (updateTradeRequest.getTradeType()){
            case "contract":
                this.updateContractTrade(id, updateTradeRequest);
                break;
            case "order":
                this.updateOrderTrade(id, updateTradeRequest);
                break;
            case "shipping":
                this.updateShippingTrade(id, updateTradeRequest);
                break;
        }
    }

    public List<Position> saveContractPositionsForContract(List<ContractPosition> positions, ContractTrade contractTrade) throws UneceException {
        List<Position> positionsSaved = new ArrayList<>();
        for (ContractPosition position: positions){
            position.setContractTrade(contractTrade);
            setCorrectOutputMaterial(position);
            position.setConsigneeMaterial(materialService.getCachedCompanyConsigneeMaterialFromPositions(position.getContractorMaterial().getId(),contractTrade.getConsignee()));
            if (position.getUnit().getCode().equals(""))
                position.setUnit(null);
            positionsSaved.add(contractPositionRepository.save(position));
        }
        return positionsSaved;
    }

    public List<Position> saveOrderPositionsForOrder(List<OrderPosition> positions, OrderTrade orderTrade) throws UneceException {
        List<Position> positionsSaved = new ArrayList<>();
        for (OrderPosition position: positions){
            position.setOrderTrade(orderTrade);
            setCorrectOutputMaterial(position);
            position.setConsigneeMaterial(materialService.getCachedCompanyConsigneeMaterialFromPositions(position.getContractorMaterial().getId(),orderTrade.getConsignee()));
            if (position.getUnit().getCode().equals(""))
                position.setUnit(null);
            positionsSaved.add(orderPositionRepository.save(position));
        }
        return positionsSaved;
    }

    public List<Position> saveShippingPositionsForShipping(List<ShippingPosition> positions, ShippingTrade shippingTrade) throws UneceException {
        List<Position> positionsSaved = new ArrayList<>();
        for (ShippingPosition position: positions){
            position.setShippingTrade(shippingTrade);
            setCorrectOutputMaterial(position);
            position.setConsigneeMaterial(materialService.getCachedCompanyConsigneeMaterialFromPositions(position.getContractorMaterial().getId(),shippingTrade.getConsignee()));
            if (position.getUnit().getCode().equals(""))
                position.setUnit(null);
            positionsSaved.add(shippingPositionRepository.save(position));
        }
        return positionsSaved;
    }


    public List<Position> getPositionsFromContractId(Long id){
        return contractPositionRepository.findAllByContractTradeID(id);
    }

    public List<Position> getPositionsFromOrderId(Long id){
        return orderPositionRepository.findAllByOrderTradeId(id);
    }

    public List<Position> getPositionsFromShippingId(Long id){
        return shippingPositionRepository.findAllByShippingTradeId(id);
    }

    public List<ShippingTrade> getAllShippingByCertification(CertificationTransaction certificationTransaction) {
        return this.shippingTradeRepository.findAllByCertificationTransaction(certificationTransaction);
    }

    public Trade getTradeByCertification(CertificationTransaction certificationTransaction) {
        List<ShippingTrade> shippingTrades = this.shippingTradeRepository.findAllByCertificationTransaction(certificationTransaction);
        List<OrderTrade> orderTrades = this.orderTradeRepository.findAllByCertificationTransaction(certificationTransaction);
        List<ContractTrade> contractTrades = this.contractTradeRepository.findAllByCertificationTransaction(certificationTransaction);
        List<Trade> trades = new ArrayList<>();
        trades.addAll(shippingTrades);
        trades.addAll(orderTrades);
        trades.addAll(contractTrades);
        if(trades.size()==0)
            return null;//Certification is related to a transformation
        return trades.get(0);//For now, only one certificate per trade
    }

    public List<Company> getAllConsigneesByCompany(Company companyContractor){
        return this.shippingTradeRepository.findAllByContractor(companyContractor).stream().map(Transaction::getConsignee).collect(Collectors.toList());
    }

    private void updateContractTrade(Long id, UpdateTradeRequest updateTradeRequest){
        this.contractTradeRepository.updateContractTradeFields(id, updateTradeRequest.getProcessingStandardName());
    }

    private void updateOrderTrade(Long id, UpdateTradeRequest updateTradeRequest){
        this.orderTradeRepository.updateOrderTradeFields(id, updateTradeRequest.getProcessingStandardName());
    }

    private void updateShippingTrade(Long id, UpdateTradeRequest updateTradeRequest){
        this.shippingTradeRepository.updateShippingTradeFields(id, updateTradeRequest.getProcessingStandardName());
    }

    private void setCorrectOutputMaterial(Position position) throws UneceException {
        Material material = materialRepository.getOne(position.getContractorMaterial().getId());
        if (!material.isInput())
            position.setContractorMaterial(material);
        else
            throw new UneceException(UneceError.MATERIAL_INCOMPATIBLE);
    }
}
