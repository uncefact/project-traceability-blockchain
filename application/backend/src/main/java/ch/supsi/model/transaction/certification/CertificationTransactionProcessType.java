package ch.supsi.model.transaction.certification;

import ch.supsi.model.ProcessType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
@NoArgsConstructor
public class CertificationTransactionProcessType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "certification_transaction_id", referencedColumnName = "id")
    private CertificationTransaction certificationTransaction;

    @ManyToOne
//    @PrimaryKeyJoinColumns({
//            @PrimaryKeyJoinColumn(name = "process_type_code", referencedColumnName = "code"),
//            @PrimaryKeyJoinColumn(name = "process_type_role", referencedColumnName = "role")
//    })
    @JoinColumn(name = "process_type_id", referencedColumnName = "code")
    private ProcessType processType;

    public CertificationTransactionProcessType(CertificationTransaction certificationTransaction, ProcessType processType){
        this.certificationTransaction = certificationTransaction;
        this.processType = processType;
    }
}
