package ch.supsi.repository.transaction.trade;

import ch.supsi.model.transaction.trade.OrderDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDocumentTypeRepository extends JpaRepository<OrderDocumentType, String> {
}
