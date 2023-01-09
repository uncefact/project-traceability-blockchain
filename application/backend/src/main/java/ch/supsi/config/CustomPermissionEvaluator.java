package ch.supsi.config;

import ch.supsi.exception.UneceException;
import ch.supsi.model.User;
import ch.supsi.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.io.Serializable;

@Component
public class CustomPermissionEvaluator implements PermissionEvaluator {

    @Autowired
    private LoginService loginService;

    @Override
    public boolean hasPermission(Authentication authentication, Object accessType, Object permission) {
        if (authentication != null) {
            User user;
            try {
                user = loginService.get(authentication.getName()).getUser();
                if (accessType.equals("company"))
                    return user.getCompany().getPartnerType() == null || user.getCompany().getPartnerType().equals(permission);

            } catch (UneceException e) {
                e.printStackTrace();
            }

        }
        return false;
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable serializable, String s, Object o) {
        return false;
    }

}