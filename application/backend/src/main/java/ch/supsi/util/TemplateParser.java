package ch.supsi.util;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UncheckedIOException;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;

public class TemplateParser {

    public static final String TEMPLATE_TRADE_CONFIRMATION ="confirmation_trade";
    public static final String TEMPLATE_COMPANY_INVITATION ="company_invitation";
    public static final String TEMPLATE_SUPPLIER_INVITATION ="supplier_invitation";
    public static final String TEMPLATE_COLLEAGUE_INVITATION ="colleague_invitation";
    public static final String TEMPLATE_COMPANY_INVITATION_NOTIFICATION ="company_invitation_notification";
    public static final String TEMPLATE_CERTIFICATION_CONFIRMATION ="confirmation_certification";
    public static final String TEMPLATE_STATUS="contract_status";
    public static final String TEMPLATE_SHIPPING_ACCEPTED="shipping_certification_accepted";

    private TemplateParser(){}

    public static String parseTemplate(String name, Map<String,String> textVariables, ResourceLoader resourceLoader) {
        try {
            String template = asString(resourceLoader.getResource("classpath:mail_templates/"+name+".html"));
            for(String key: textVariables.keySet()) {
                template = template.replace("$$"+key.toUpperCase()+"$$", textVariables.get(key));
            }
            return template;
        }
        catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private static String asString(Resource resource) {
        try (Reader reader = new InputStreamReader(resource.getInputStream(), UTF_8)) {
            return FileCopyUtils.copyToString(reader);
        }
        catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
