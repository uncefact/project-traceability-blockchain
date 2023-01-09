package ch.supsi.service;

import ch.supsi.exception.UneceException;
import ch.supsi.model.User;
import ch.supsi.model.company.Company;
import ch.supsi.model.transaction.Transaction;
import ch.supsi.model.transaction.trade.ShippingTrade;
import ch.supsi.request.onboarding.TotalOnboardingRequest;
import ch.supsi.request.onboarding.UserOnboardingRequest;
import ch.supsi.util.TemplateParser;
import ch.supsi.util.UneceServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.Arrays;
import java.util.HashMap;

@Service
public class MailService {

    private final JavaMailSender javaMailSender;

    private final String[] SECRETARY_EMAIL_ADDRESSES = new String[]{"mail@mail.ch", "mail2@mail.ch"};

    @Autowired
    private Environment environment;

    @Value("${spring.mail.username}")
    private String senderMail;

    @Value("${unece.mailservice.confirmLinkTradePattern}")
    private String confirmLinkTradePattern;

    @Value("${unece.mailservice.confirmLinkCertificationPattern}")
    private String confirmLinkCertificationPattern;

    @Value("${unece.mailservice.companyInvitationLinkPattern}")
    private String companyInvitationLinkPattern;

    @Value("${unece.mailservice.employeeInvitationLinkPattern}")
    private String employeeInvitationLinkPattern;

    @Value("${unece.mailservice.registrationlink}")
    private String registrationLink;

    private final ResourceLoader resourceLoader;
    private final LoginService loginService;

    public MailService(JavaMailSender javaMailSender, ResourceLoader resourceLoader, LoginService loginService) {
        this.javaMailSender = javaMailSender;
        this.resourceLoader = resourceLoader;
        this.loginService = loginService;
    }

    public void sendConfirmationTradeEmail(Transaction transaction, String recipientEmail, String transactionType) throws UneceException {
        User sender = loginService.get(UneceServer.getLoggedUsername()).getUser();
        HashMap<String,String> data = new HashMap<>();

        data.put("document_type", transaction.getDocumentType().getCode() + " - " + transaction.getDocumentType().getName());
        data.put("sender_firstname", sender.getFirstname()!=null?sender.getFirstname():"");
        data.put("sender_lastname", sender.getLastname()!=null?sender.getLastname():"");
        data.put("confirmation_link_url", this.confirmLinkTradePattern
                .replace("$companyIndustry$", transaction.getConsignee().getCompanyIndustry().getName())
                .replace("$id$", String.valueOf(transaction.getId())) + "?type=" + transactionType);
        data.put("registration_link_url", this.registrationLink);
        data.put("transaction_type", transactionType.toUpperCase());
        data.put("company_name", sender.getCompany().getCompanyName());

        String mailText = TemplateParser.parseTemplate(TemplateParser.TEMPLATE_TRADE_CONFIRMATION, data, resourceLoader);
        sendMail(new String[]{recipientEmail},"Trade confirmation", mailText);
    }

    public void sendConfirmationCertificationEmail(Transaction transaction, String recipientEmail, String transactionType) throws UneceException {
        User sender = loginService.get(UneceServer.getLoggedUsername()).getUser();
        HashMap<String,String> data = new HashMap<>();

        data.put("document_type", transaction.getDocumentType().getCode() + " - " + transaction.getDocumentType().getName());
        data.put("sender_firstname", sender.getFirstname()!=null?sender.getFirstname():"");
        data.put("sender_lastname", sender.getLastname()!=null?sender.getLastname():"");
        data.put("confirmation_link_url", this.confirmLinkCertificationPattern
                .replace("$companyIndustry$", transaction.getConsignee().getCompanyIndustry().getName())
                .replace("$type$", transactionType.toLowerCase()).replace("$id$", String.valueOf(transaction.getId())));
        data.put("registration_link_url", this.registrationLink);
        data.put("transaction_type", transactionType);
        data.put("company_name", sender.getCompany().getCompanyName());

        String mailText = TemplateParser.parseTemplate(TemplateParser.TEMPLATE_CERTIFICATION_CONFIRMATION, data, resourceLoader);
        sendMail(new String[]{recipientEmail},"Certification confirmation", mailText);
    }

    public void sendColleagueInvitationEmailFromRequest(UserOnboardingRequest colleagueInvitationRequest, String tokenCode) throws UneceException {
        User sender = loginService.get(UneceServer.getLoggedUsername()).getUser();
        HashMap<String,String> data = new HashMap<>();

        data.put("firstname", colleagueInvitationRequest.getUserFirstName() != null ? colleagueInvitationRequest.getUserFirstName() : "");
        data.put("lastname", colleagueInvitationRequest.getUserLastName() != null ? colleagueInvitationRequest.getUserLastName() : "");
        data.put("sender_firstname", sender.getFirstname()!=null?sender.getFirstname():"");
        data.put("sender_lastname", sender.getLastname()!=null?sender.getLastname():"");
        data.put("registration_link_url", this.employeeInvitationLinkPattern.replace("$token$", tokenCode));
        data.put("company_name", sender.getCompany().getCompanyName());

        String mailText = TemplateParser.parseTemplate(TemplateParser.TEMPLATE_COLLEAGUE_INVITATION, data, resourceLoader);
        sendMail(new String[]{colleagueInvitationRequest.getUserEmailAddress()},"Colleague on-boarding", mailText);
    }

    public void sendCompanyInvitationEmail(String recipientEmail, String tokenCode, boolean isSupplier) throws UneceException {
        User sender = loginService.get(UneceServer.getLoggedUsername()).getUser();
        HashMap<String,String> data = new HashMap<>();

        data.put("sender_firstname", sender.getFirstname()!=null?sender.getFirstname():"");
        data.put("sender_lastname", sender.getLastname()!=null?sender.getLastname():"");
        data.put("registration_link_url", this.companyInvitationLinkPattern.replace("$token$", tokenCode));
        data.put("company_name", sender.getCompany().getCompanyName());

        if (isSupplier){
            String mailText = TemplateParser.parseTemplate(TemplateParser.TEMPLATE_SUPPLIER_INVITATION, data, resourceLoader);
            sendMail(new String[]{recipientEmail},"Supplier on-boarding", mailText);
        }
        else {
            String mailText = TemplateParser.parseTemplate(TemplateParser.TEMPLATE_COMPANY_INVITATION, data, resourceLoader);
            sendMail(new String[]{recipientEmail},"Company on-boarding", mailText);
        }
    }

    public void sendCompanyInvitationNotificationEmail(Company invitedCompany) throws UneceException {
        User sender = loginService.get(UneceServer.getLoggedUsername()).getUser();
        HashMap<String,String> data = new HashMap<>();

        data.put("sender_firstname", sender.getFirstname()!=null?sender.getFirstname():"");
        data.put("sender_lastname", sender.getLastname()!=null?sender.getLastname():"");
        data.put("company_name", sender.getCompany().getCompanyName());
        data.put("invited_company_name", invitedCompany.getCompanyName());

        String mailText = TemplateParser.parseTemplate(TemplateParser.TEMPLATE_COMPANY_INVITATION_NOTIFICATION, data, resourceLoader);
        sendMail(SECRETARY_EMAIL_ADDRESSES,"Notification of a new company invitation", mailText);
    }

    public void sendShippingCertifiedToConsignee(ShippingTrade shippingTrade){
        HashMap<String,String> data = new HashMap<>();
        data.put("platform_link", this.confirmLinkTradePattern.replace("$id$", String.valueOf(shippingTrade.getId())) + "?type=shipping");
        data.put("shipping_reference", shippingTrade.getContractorReferenceNumber());
        data.put("registration_link_url", this.registrationLink);

        String mailText = TemplateParser.parseTemplate(TemplateParser.TEMPLATE_SHIPPING_ACCEPTED,data, resourceLoader);
        sendMail(new String[]{shippingTrade.getConsigneeEmail()},"Shipping Certified", mailText);
    }


    @Async
    public void sendMail(String[] mailAddresses, String subject, String content) {
        if (!Arrays.asList(environment.getActiveProfiles()).contains("local"))
            try {
                MimeMessage message = this.javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message,true);

                helper.setFrom(this.senderMail);
                helper.setTo(mailAddresses);
                helper.setSubject(subject);
                helper.setText(content, true);
                javaMailSender.send(message);
            }
            catch(MessagingException e) {
                e.printStackTrace();
            }
    }
}
