package ch.supsi.repository.transaction.trade;

import ch.supsi.model.transaction.trade.ContractDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractDocumentTypeRepository extends JpaRepository<ContractDocumentType, String> {
}
