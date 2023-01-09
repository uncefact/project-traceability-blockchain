package ch.supsi.repository.transaction.trade;

import ch.supsi.model.company.Company;
import ch.supsi.model.transaction.certification.CertificationTransaction;
import ch.supsi.model.transaction.trade.ContractTrade;
import ch.supsi.model.transaction.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ContractTradeRepository extends JpaRepository<ContractTrade, Long> {

    ContractTrade findByContractorReferenceNumber(String contractorReferenceNumber);

    List<ContractTrade> findByContractorCompanyName(String contractorCompanyName);

    List<ContractTrade> findByConsigneeCompanyName(String consigneeCompanyName);

    @Query("SELECT c FROM ContractTrade c WHERE c.document.id = :documentId AND (c.consignee = :company OR c.contractor = :company)")
    List<ContractTrade> findAllByDocumentIdAndConsigneeOrContractor(Long documentId, Company company);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE ContractTrade c " +
            "SET c.consigneeReferenceNumber = :consigneeReferenceNumber, c.status = :transactionStatus, c.consigneeDate = :consigneeDate " +
            "WHERE c.id = :id")
    void updateConfirmedContractTradeFields(Long id, String consigneeReferenceNumber, TransactionStatus transactionStatus, Date consigneeDate);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE ContractTrade c " +
            "SET c.processingStandard.name = :processingStandardName " +
            "WHERE c.id = :id")
    void updateContractTradeFields(Long id, String processingStandardName);


    List<ContractTrade> findAllByCertificationTransaction(CertificationTransaction certificationTransaction);
}
