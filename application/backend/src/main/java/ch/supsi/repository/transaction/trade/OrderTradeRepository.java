package ch.supsi.repository.transaction.trade;

import ch.supsi.model.company.Company;
import ch.supsi.model.transaction.certification.CertificationTransaction;
import ch.supsi.model.transaction.trade.OrderTrade;
import ch.supsi.model.transaction.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface OrderTradeRepository extends JpaRepository<OrderTrade, Long> {

    OrderTrade findByContractorReferenceNumber(String contractorReferenceNumber);

    List<OrderTrade> findByContractorCompanyName(String contractorCompanyName);

    List<OrderTrade> findByConsigneeCompanyName(String consigneeCompanyName);

    @Query("SELECT o FROM OrderTrade o WHERE o.document.id = :documentId AND (o.consignee = :company OR o.contractor = :company)")
    List<OrderTrade> findAllByDocumentIdAndConsigneeOrContractor(Long documentId, Company company);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE OrderTrade o " +
            "SET o.consigneeReferenceNumber = :consigneeReferenceNumber, o.status = :transactionStatus, o.consigneeDate = :consigneeDate " +
            "WHERE o.id = :id")
    void updateConfirmedOrderTradeFields(Long id, String consigneeReferenceNumber, TransactionStatus transactionStatus, Date consigneeDate);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE OrderTrade o " +
            "SET o.processingStandard.name = :processingStandardName " +
            "WHERE o.id = :id")
    void updateOrderTradeFields(Long id, String processingStandardName);

    List<OrderTrade> findAllByCertificationTransaction(CertificationTransaction certificationTransaction);
}
