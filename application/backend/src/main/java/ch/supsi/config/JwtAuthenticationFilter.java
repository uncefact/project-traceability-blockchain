package ch.supsi.config;

import io.jsonwebtoken.Jwts;
import org.json.JSONObject;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;

    public JwtAuthenticationFilter(
            AuthenticationManager authenticationManager
    )
    {
        this.authenticationManager = authenticationManager;
        setFilterProcessesUrl("/info/authenticate");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username,password);
        return this.authenticationManager.authenticate(authenticationToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        String username = request.getParameter("username");
        String role = authResult.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equalsIgnoreCase("ADMIN")) ? "ADMIN" : "USER";
        String token = Jwts.builder()
                .signWith(JwtSettings.JWT_SIGNING_KEY)
                .setHeaderParam("typ", "JWT")
                .setIssuer(JwtSettings.JWT_ISSUER)
                .setAudience(JwtSettings.JWT_AUDIENCE)
                .setSubject(username)
                .setExpiration(new Date(System.currentTimeMillis() + JwtSettings.JWT_EXPIRATION))
                .claim("role", role)
                .compact();


        JSONObject object = new JSONObject();
        object.put("token", token);
        response.addHeader("Content-Type", "Application/Json");
        response.getOutputStream().print(object.toString(3));

    }
}
