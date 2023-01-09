//package ch.supsi.service;
//
//import ch.supsi.repository.VoucherRepository;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.core.io.ResourceLoader;
//import org.springframework.stereotype.Service;
//
//import java.time.format.DateTimeFormatter;
//
//@Service
//public class VoucherService {
//
//    private static Logger logger = LoggerFactory.getLogger(VoucherService.class);
//    private final MailService mailService;
//
//    private final VoucherRepository voucherRepository;
//
//    private DateTimeFormatter formatter;
//
////    @Value("${unece.mailservice.redeemlinkpattern}")
////    private String redeemLinkPattern;
////
////    @Value("${unece.mailservice.registrationlink}")
////    private String registrationLink;
//
//    @Value("${unece.voucher.expirationdays}")
//    private Integer voucherExpirationDays;
//
//    @Value("${unece.voucher.length}")
//    private Integer voucherLength;
//
//    private final ResourceLoader resourceLoader;
//
//    @Autowired
//    public VoucherService(
//            MailService mailService,
//            VoucherRepository voucherRepository,
//            ResourceLoader resourceLoader
//    ) {
//        this.mailService = mailService;
//        this.voucherRepository = voucherRepository;
//        this.resourceLoader = resourceLoader;
//
//        this.formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy, HH:mm");
//    }
//
////    public void sendVoucher(Transaction transaction, User sender, String email) {
////        HashMap<String,String> data = new HashMap<>();
////        data.put("document", docType.getName() + " " + docType.getName());
////
////        Voucher voucher = generateVoucher(transaction, sender);
////        data.put("voucher_code",voucher.getVoucher());
////        data.put("voucher_expiration", this.formatter.format(voucher.getExpiration()));
////        data.put("recipient_firstname",sender.getFirstname()!=null?sender.getFirstname():"");
////        data.put("recipient_lastname",sender.getLastname()!=null?sender.getLastname():"");
////        data.put("mainpage_link_url",String.format(this.redeemLinkPattern,voucher.getVoucher()));
////        data.put("registration_link_url", this.registrationLink);
////        data.put("facility_name", sender.getCompany().getCompanyName());
////
////        String mailText = TemplateParser.parseTemplate(TemplateParser.TEMPLATE_VOUCHER,data, resourceLoader);
////        this.mailService.sendMail(email,"Transaction voucher", mailText);
////    }
//
////    public List<Voucher> getVouchers(Contract contract, User requestingUser) {
////        return this.voucherRepository.findByContractAndRequestingUser(contract, requestingUser);
////    }
//
////    public Voucher redeemVoucher(String voucher, User requestingUser)
////    {
////        logger.info("Voucher "+voucher+".");
////        Voucher v = voucherRepository.findByVoucher(voucher);
////        if (v == null)
////            return null;
////        v.setRedeemedBy(requestingUser);
////        return voucherRepository.save(v);
////    }
//
////    public void removeVoucher(String voucher){
////        voucherRepository.delete(voucherRepository.findByVoucher(voucher));
////    }
//
////    public Voucher getVoucherFromContract(Contract contract){
////        return voucherRepository.findByContract(contract);
////    }
//
////    private Voucher generateVoucher(Transaction transaction, User requestingUser)
////    {
////        Voucher voucher = new Voucher();
////        voucher.setTransaction(transaction);
////        voucher.setVoucher(VoucherGenerator.generate(this.voucherLength));
////        voucher.setExpiration(LocalDateTime.now().plusDays(this.voucherExpirationDays));
////        voucher.setRequestingUser(requestingUser);
////        voucher = this.voucherRepository.save(voucher);
////        return voucher;
////    }
//
//
//}
