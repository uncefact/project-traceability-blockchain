package ch.supsi.util;

import org.springframework.security.core.context.SecurityContextHolder;

public class UneceServer {

    public static String getLoggedUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

}
