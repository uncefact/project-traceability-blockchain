//package ch.supsi.service;
//
//
//import ch.supsi.model.company.Company;
//import ch.supsi.model.contract.Contract;
//import ch.supsi.model.User;
//import ch.supsi.repository.company.CompanyRepository;
//import ch.supsi.repository.ContractRepository;
//import ch.supsi.repository.UserRepository;
//import ch.supsi.util.TemplateParser;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.core.io.ResourceLoader;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//public class CoreService {
//
//    private final CompanyRepository companyRepository;
//    private final UserRepository userRepository;
//    private final ContractRepository cr;
//
//    private final VoucherService voucherService;
//    private final MailService mailService;
//
//    private final ResourceLoader resourceLoader;
//
//    private PasswordEncoder encoder = new BCryptPasswordEncoder();
//
//    @Value("${unece.server.baseurl}")
//    private String baseUrl;
//
//    @Autowired
//    public CoreService(
//            VoucherService voucherService,
//            MailService mailService,
//            CompanyRepository companyRepository,
//            UserRepository userRepository,
//            ContractRepository contractRepository,
//            ResourceLoader resourceLoader
//    ) {
//        this.voucherService = voucherService;
//        this.mailService = mailService;
//        this.companyRepository = companyRepository;
//        this.userRepository = userRepository;
//        this.cr = contractRepository;
//        this.resourceLoader = resourceLoader;
//    }
//
//
////    @PostConstruct
////    public void init() throws IOException {
////       if (ur.findAll().size() == 0) {
////            //Entity weba = er.save(new Entity("WEBA"));
////            //Entity cri = er.save(new Entity("CRI"));
////
////            ur.save(new User("admin", encoder.encode("admin"), User.Role.ADMIN, "unece.noreply@supsi.ch"));
////            ur.save(new User("patrick.ceppi@gmail.com", encoder.encode("cri"), User.Role.PARTNER, "patrick.ceppi@gmail.com"));
////            User weba = ur.save(new User("patrick.ceppi@supsi.ch", encoder.encode("weba"), User.Role.PARTNER, "patrick.ceppi@supsi.ch"));
////
////
////            cr.save(new Contract( "patrick.ceppi@supsi.ch", "patrick.ceppi@gmail.com",
////                    Date.from(LocalDateTime.now().plusMonths(1).toInstant(ZoneOffset.UTC)),
////                    "seed",
////                    FileUtil.readAsByteArray(this.getClass().getResourceAsStream("/docs/cert.jpeg")),
////                    "certificate.jpg",
////                    weba));
////        }
////    }
//
////    public Contract updateContract(Contract c){
////        Contract contract = cr.save(c);
////        HashMap<String,String> data = new HashMap<>();
////        data.put("firstname",contract.getCreatedBy().getFirstname());
////        data.put("lastname",contract.getCreatedBy().getLastname());
////        data.put("status",contract.getStatus().name());
////        data.put("contractid",""+contract.getId());
////        data.put("process",contract.getProcess());
////        data.put("contractURL",this.baseUrl+"/contract/"+contract.getId());
////
////        this.mailService.sendMail(
////                contract.getCreatedBy().getEmail(),
////                "Contract status changed to "+contract.getStatus().name(),
////                TemplateParser.parseTemplate(TemplateParser.TEMPLATE_STATUS,data,resourceLoader));
////        return contract;
////    }    public Contract updateContract(Contract c){
////        Contract contract = cr.save(c);
////        HashMap<String,String> data = new HashMap<>();
////        data.put("firstname",contract.getCreatedBy().getFirstname());
////        data.put("lastname",contract.getCreatedBy().getLastname());
////        data.put("status",contract.getStatus().name());
////        data.put("contractid",""+contract.getId());
////        data.put("process",contract.getProcess());
////        data.put("contractURL",this.baseUrl+"/contract/"+contract.getId());
////
////        this.mailService.sendMail(
////                contract.getCreatedBy().getEmail(),
////                "Contract status changed to "+contract.getStatus().name(),
////                TemplateParser.parseTemplate(TemplateParser.TEMPLATE_STATUS,data,resourceLoader));
////        return contract;
////    }
//
////    public Contract post(Contract c, User user, String email){
////        Contract contract = cr.save(c);
////        voucherService.sendVoucher(contract, user, email);
////        return contract;
////    }
//
//    public Contract getContract(Long id){
//        return cr.findById(id).get();
//    }
//
////    public Page<Contract> getAllContracts(User user, Pageable pageable){
////        if(user.getRole().equals(User.Role.ADMIN))
////            return cr.findAll(pageable);
////        return cr.findAllByCreatedBy(user, pageable);
////    }
//
//    public Page<Contract> getAllCompanyContracts(User user, Pageable pageable){
//        if (user.getRole().equals(User.Role.ADMIN))
//            return cr.findAll(pageable);
//        return cr.findAllByCompanyUser(user.getCompany(), pageable);
//    }
//
////    public Page<Contract> getAllRedeemedContracts(String username, Pageable pageable){
////        User user = getUser(username);
////        return cr.findAllByRedeemUSer(user, pageable);
////    }
//
//    public Page<Company> getAllEntities(Pageable pageable){
//        return companyRepository.findAll(pageable);
//    }
//
//    public User findUserByEmail(String username) {
//        return userRepository.findByEmail(username);
//    }
//
//    public User saveUser(User user) {
//        Date currentDate = new Date();
////        user.setPassword(encoder.encode(user.getPassword()));
//        user.setRole(User.Role.PARTNER);
//        user.setRegistrationDate(currentDate);
//        user.setLastEditDate(currentDate);
//        return userRepository.save(user);
//    }
//
//    public User putUser(User user) {
//        user.setLastEditDate(new Date());
//        return userRepository.save(user);
//    }
//
//    public List<String> getEmailsFromFacilityId(Long id){
//        List<User> users = this.userRepository.findAll();
//        return users.parallelStream().filter(u -> u.getCompany().getId().equals(id)).map(User::getEmail).collect(Collectors.toList());
//    }
//
//
//}
