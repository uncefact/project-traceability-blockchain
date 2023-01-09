package ch.supsi.model.transaction.certification;

import ch.supsi.model.ProductCategory;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class CertificationTransactionProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "certification_transaction_id", referencedColumnName = "id")
    private CertificationTransaction certificationTransaction;

    @ManyToOne
    @JoinColumn(name = "product_category_id", referencedColumnName = "code")
    private ProductCategory productCategory;

    public CertificationTransactionProductCategory(CertificationTransaction certificationTransaction, ProductCategory productCategory) {
        this.certificationTransaction = certificationTransaction;
        this.productCategory = productCategory;
    }

}
