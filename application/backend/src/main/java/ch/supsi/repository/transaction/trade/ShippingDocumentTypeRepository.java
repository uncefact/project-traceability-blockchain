package ch.supsi.repository.transaction.trade;

import ch.supsi.model.transaction.trade.ShippingDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShippingDocumentTypeRepository extends JpaRepository<ShippingDocumentType, String> {
}
