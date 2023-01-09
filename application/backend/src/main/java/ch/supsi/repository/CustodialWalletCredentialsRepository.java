package ch.supsi.repository;

import ch.supsi.model.CustodialWalletCredentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustodialWalletCredentialsRepository extends JpaRepository<CustodialWalletCredentials, Long> {
}
