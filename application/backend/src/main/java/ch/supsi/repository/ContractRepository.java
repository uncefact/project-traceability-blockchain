//package ch.supsi.repository;
//
//import ch.supsi.model.company.Company;
//import ch.supsi.model.contract.Contract;
//import ch.supsi.model.User;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public interface ContractRepository extends JpaRepository<Contract, Long> {
//    Page<Contract> findAllByConsigneeOrContractor(String consignee, String contractor, Pageable pageable);
//
//    @Query("SELECT c FROM Contract c WHERE c.createdBy IN (" +
//            "SELECT u FROM User u WHERE u.company = :company)")
//    Page<Contract> findAllByCompanyUser(Company company, Pageable pageable);
//
////    @Query("SELECT v.contract FROM Voucher v WHERE v.redeemedBy = :user")
////    Page<Contract> findAllByRedeemUSer(@Param("user") User user, Pageable pageable);
//}