//package ch.supsi.model.contract;
//
//import ch.supsi.model.User;
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import ch.supsi.model.contract.doc.DocuTemplate;
//import ch.supsi.model.contract.doc.DocuType;
////import ch.supsi.model.contract.doc.Document;
//import lombok.*;
//import org.springframework.format.annotation.DateTimeFormat;
//
//import javax.persistence.*;
//import java.util.Date;
//import java.util.List;
//
//@Entity
//@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(of = {"process"})
//public class Contract {
//
////    public Contract(String contractor,
////                    String consignee,
////                    Date expirationDate,
////                    String process,
////                    byte[] docPDF,
////                    byte[] docXML,
////                    byte[] docJPG,
////                    String docFileName,
////                    User createdBy){
////        this.contractor = contractor;
////        this.consignee = consignee;
////        this.expirationDate = expirationDate;
////        this.process = process;
////        this.docPDF = docPDF;
////
////        this.status = ContractStatus.TO_APPROVE;
////        this.date = LocalDateTime.now();
////        this.docFileName = docFileName;
////        this.createdBy = createdBy;
////    }
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private Date dateCreation;
//
//    @ManyToOne
//    private User createdBy;
//
//    @DateTimeFormat(pattern = "yyyy-MM-dd")
//    private Date validUntilDate;
//    @DateTimeFormat(pattern = "yyyy-MM-dd")
//    private Date validFromDate;
//    private Date validationDate;
//
////    @OneToMany (mappedBy = "contract")
////    @JsonIgnore
////    @Basic(fetch=FetchType.LAZY)
////    private List<Document> documents;
//
//    @OneToOne(fetch = FetchType.EAGER)
//    private DocuTemplate docuTemplate;
//
//    private String explanationCreation;
//    private String explanationValidation;
//
////    if the user doesn't find the facility these fields will be inserted
//    private String facilityName;
//    private String firstName;
//    private String lastName;
//    @OneToOne(fetch = FetchType.EAGER)
//    private DocuType docuType;
//
//
//
////    @Lob
////    private byte[] docPDF;
////
////    @Lob
////    private byte[] docXML;
////
////    @Lob
////    private byte[] docJPG;
//
//
////    private String docContentType;
//
////    private String docFileName;
//
//    @Enumerated(EnumType.STRING)
//    private ContractStatus status;
//
//    private String process;
//
//    private String template;
//
//    //@ManyToOne
//    //private io.xview.core.model.partner.Entity vendor;
//    private String contractor;
//    private String contractorEmail;
//
//    //@ManyToOne
//    //private io.xview.core.model.partner.Entity buyer;to
//    private String consignee;
//    private String consigneeEmail;
//}
