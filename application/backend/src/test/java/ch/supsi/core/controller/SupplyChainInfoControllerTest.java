package ch.supsi.core.controller;

import ch.supsi.exception.UneceException;
import ch.supsi.model.company.Company;
import ch.supsi.model.CustodialWalletCredentials;
import ch.supsi.model.Material;
import ch.supsi.model.User;
import ch.supsi.model.login.Login;
import ch.supsi.model.position.ContractPosition;
import ch.supsi.model.transaction.trade.ContractTrade;
import ch.supsi.model.transaction.trade.OrderTrade;
import ch.supsi.model.transaction.trade.ShippingTrade;
import ch.supsi.repository.*;
import ch.supsi.repository.company.CompanyRepository;
import ch.supsi.repository.position.ContractPositionRepository;
import ch.supsi.repository.transaction.trade.ContractTradeRepository;
import ch.supsi.repository.transaction.trade.OrderTradeRepository;
import ch.supsi.repository.transaction.trade.ShippingTradeRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class SupplyChainInfoControllerTest extends UneceControllerTestTemplate {

    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private LoginRepository loginRepository;
    @Autowired
    private CustodialWalletCredentialsRepository walletCredentialsRepository;
    @Autowired
    private ShippingTradeRepository shippingTradeRepository;
    @Autowired
    private OrderTradeRepository orderTradeRepository;
    @Autowired
    private ContractTradeRepository contractTradeRepository;
    @Autowired
    private MaterialRepository materialRepository;
    @Autowired
    private ContractPositionRepository contractPositionRepository;


    private final String PATH = "/supplychain";

    private Company company1;
    private Company company2;
    private User user1;
    private User user2;
    private Login userLogin1;
    private Login userLogin2;
    private Material material;


    @Before
    public void init() {
        this.company1 = new Company("ethAddress1", "company1", "codeTest1", null);
        this.company1 = this.companyRepository.save(this.company1);

        this.company2 = new Company("ethAddress2", "company2", "codeTest2", null);
        this.company2 = this.companyRepository.save(this.company2);

        this.user1 = new User();
        this.user1.setEmail("emailTest1");
        this.user1.setCompany(this.company1);
        this.user1 = this.userRepository.save(this.user1);
        this.userLogin1 = this.loginRepository.save(new Login()
                .setUsername("usernametest1")
                .setPassword(new BCryptPasswordEncoder().encode("usernametest1"))
                .setUser(this.user1));

        this.user2 = new User();
        this.user2.setEmail("emailTest2");
        this.user2.setCompany(this.company2);
        this.user2 = this.userRepository.save(this.user2);
        this.userLogin2 = this.loginRepository.save(new Login()
                .setUsername("usernametest2")
                .setPassword(new BCryptPasswordEncoder().encode("usernametest2"))
                .setUser(this.user2));

        this.material = this.materialRepository.save(new Material("Test mat 1", null, false));
    }


    @Test
    public void getPredecessorsSuccessTest() throws Exception {
        ShippingTrade shippingTrade = new ShippingTrade();
        shippingTrade.setContractor(this.company1);
        shippingTrade.setConsignee(this.company2);
        this.shippingTradeRepository.save(shippingTrade);

        ContractTrade contractTrade = new ContractTrade();
        contractTrade.setContractor(this.company1);
        contractTrade.setConsignee(this.company2);
        this.contractTradeRepository.save(contractTrade);

        OrderTrade orderTrade = new OrderTrade();
        orderTrade.setContractor(this.company1);
        orderTrade.setConsignee(this.company2);
        this.orderTradeRepository.save(orderTrade);

        this.mock().perform(get(this.userLogin2.getUsername(), PATH + "/predecessors", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$.[0].ethAddress", is(this.company1.getEthAddress())))
                .andExpect(jsonPath("$.[0].companyName", is(this.company1.getCompanyName())));
    }

    @Test
    public void getPredecessorsEmptyArrayTest() throws Exception {
        this.mock().perform(get(this.userLogin2.getUsername(), PATH + "/predecessors", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test(expected = AssertionError.class)
    public void getSupplyChainTestFailed() throws Exception {
        // material doesn't exist
        this.mock().perform(get(this.userLogin1.getUsername(), PATH, true).param("materialId", "35"))
                .andExpect(status().isNotFound())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UneceException))
                .andExpect(result -> assertEquals(HttpStatus.NOT_FOUND.getReasonPhrase(), result.getResolvedException().getMessage()));

        ContractTrade contractTrade = new ContractTrade();
        ContractPosition contractPosition = new ContractPosition(this.material, null, null, null, null);
        contractTrade.setContractor(this.company1);
        contractTrade.setConsignee(this.company2);
        contractPosition.setContractTrade(contractTrade);
        this.contractTradeRepository.save(contractTrade);
        this.contractPositionRepository.save(contractPosition);

        // logged company is not owner and neither has trades with this material (as consignee)
        this.mock().perform(get(this.userLogin2.getUsername(), PATH, true).param("materialId", "1"))
                .andExpect(status().isForbidden())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UneceException))
                .andExpect(result -> assertEquals(HttpStatus.FORBIDDEN.getReasonPhrase(), result.getResolvedException().getMessage()));

    }

}
