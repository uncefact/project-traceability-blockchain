//package ch.supsi.model;
//
//import lombok.*;
//
//import javax.persistence.Entity;
//import javax.persistence.GeneratedValue;
//import javax.persistence.Id;
//import javax.persistence.OneToOne;
//import java.time.LocalDateTime;
//
//@Entity
//@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(of = {"voucher"})
//public class Voucher {
//
//    @Id
//    @GeneratedValue
//    private Long id;
//
//    private String voucher;
//
////    TODO: sarebbe da mappare ad una superclasse di transazione in modo tale che sia i contratti, ordini e shipping possano avere un voucher
////    @OneToOne
////    private Trade trade;
//
//    @OneToOne
//    private User requestingUser;
//
//    @OneToOne
//    private User redeemedBy;
//
//    LocalDateTime expiration;
//
//
//}
