package ch.supsi.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CustodialWalletCredentials {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String privateKey;

    private String publicKey;

    public CustodialWalletCredentials(String privateKey, String publicKey){
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }
}
