package ch.supsi.repository.transaction.trade;

import ch.supsi.model.company.Company;
import ch.supsi.model.transaction.certification.CertificationTransaction;
import ch.supsi.model.transaction.trade.ShippingTrade;
import ch.supsi.model.transaction.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ShippingTradeRepository extends JpaRepository<ShippingTrade, Long> {

    ShippingTrade findByContractorReferenceNumber(String contractorReferenceNumber);

    List<ShippingTrade> findByContractorCompanyName(String contractorCompanyName);

    List<ShippingTrade> findByConsigneeCompanyName(String consigneeCompanyName);

    @Query("SELECT s FROM ShippingTrade s WHERE s.document.id = :documentId AND (s.consignee = :company OR s.contractor = :company)")
    List<ShippingTrade> findAllByDocumentIdAndConsigneeOrContractor(Long documentId, Company company);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE ShippingTrade s " +
            "SET s.consigneeReferenceNumber = :consigneeReferenceNumber, s.status = :transactionStatus, s.consigneeDate = :consigneeDate " +
            "WHERE s.id = :id")
    void updateConfirmedShippingTradeFields(Long id, String consigneeReferenceNumber, TransactionStatus transactionStatus, Date consigneeDate);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE ShippingTrade s " +
            "SET s.processingStandard.name = :processingStandardName " +
            "WHERE s.id = :id")
    void updateShippingTradeFields(Long id, String processingStandardName);

    List<ShippingTrade> findAllByCertificationTransaction(CertificationTransaction certificationTransaction);

    List<ShippingTrade> findAllByContractor(Company companyContractor);
}
