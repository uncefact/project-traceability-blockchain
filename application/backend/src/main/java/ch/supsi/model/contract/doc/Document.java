//package ch.supsi.model.contract.doc;
//
//import ch.supsi.model.contract.Contract;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//import javax.persistence.*;
//
//@NoArgsConstructor
//@Getter
//@Setter
//@Entity
//public class Document {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String fileName;
//    private String contentType;
//
//    @ManyToOne
//    private Contract contract;
//
//    @Lob
//    private byte[] doc;
//
//    public Document(String fileName, String contentType, Contract contract, byte[] doc) {
//        this.fileName = fileName;
//        this.contentType = contentType;
//        this.contract = contract;
//        this.doc = doc;
//    }
//}
