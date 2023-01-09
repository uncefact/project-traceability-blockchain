package ch.supsi.service;

import ch.supsi.model.Token;
import ch.supsi.model.company.Company;
import ch.supsi.repository.TokenRepository;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import javax.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;

@Service
public class TokenService {

    private final TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public Token get(String tokenCode){
        Optional<Token> token = tokenRepository.findById(tokenCode);
        return token.orElse(null);
    }

    public Token save(Token token){
        token.setTokenCode(UUID.randomUUID().toString());
        return tokenRepository.save(token);
    }

    public Company getCompanyFromRegistrationToken(String tokenCode){
        Optional<Token> token = tokenRepository.findById(tokenCode);
        return token.map(Token::getCompany).orElse(null);
    }

    @Transactional
    public void removeTokenFromCode(String tokenCode){
        tokenRepository.deleteByTokenCode(tokenCode);
    }

}
