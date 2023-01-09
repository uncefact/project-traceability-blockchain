package ch.supsi.config;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

public class JwtSettings {
    public static final SecretKey JWT_SIGNING_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    public static final String JWT_ISSUER = "unece_cotton_issuer";
    public static final String JWT_AUDIENCE = "unece_cotton_app";
    public static final Long JWT_EXPIRATION = 864000000L;

}
