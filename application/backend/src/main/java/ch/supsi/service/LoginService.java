package ch.supsi.service;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.login.Login;
import ch.supsi.model.User;
import ch.supsi.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    private final LoginRepository loginRepository;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public LoginService(
            LoginRepository loginRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.loginRepository = loginRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Login get(String username) throws UneceException {
        if (username == null || username.length() == 0)
            throw new UneceException(UneceError.INVALID_USERNAME);

        Login login = this.loginRepository.findLoginByUsernameAndExpiredIsNull(username.toLowerCase());

        if (login == null)
            throw new UneceException(UneceError.USER_NOT_FOUND);
        return login;
    }

    public Login get(User user) throws UneceException {
        return this.loginRepository.findByUserAndExpiredIsNull(user);
    }

    public Login post(User user, String username, String password) throws UneceException {
        if (user == null)
            throw new UneceException(UneceError.INVALID_VALUE);

        if (username == null || username.length() == 0)
            throw new UneceException(UneceError.INVALID_USERNAME);

        if (password == null || password.length() < 4)
            throw new UneceException(UneceError.INVALID_PASSWORD);

        Login login = this.loginRepository.findLoginByUsernameAndExpiredIsNull(username.toLowerCase());

        if (login != null)
            throw new UneceException(UneceError.USERNAME_ALREADY_TAKEN);

        return this.loginRepository.save(
                new Login()
                .setUser(user)
                .setUsername(username)
                .setPassword(this.passwordEncoder.encode(password))
        );
    }

    public Login update(Login login) throws UneceException {
        if (login.getUsername() == null || login.getUsername().length() == 0)
            throw new UneceException(UneceError.INVALID_USERNAME);

        if (login.getPassword() == null || login.getPassword().length() < 4)
            throw new UneceException(UneceError.INVALID_PASSWORD);

        login.setPassword(this.passwordEncoder.encode(login.getPassword()));
        return this.loginRepository.save(login);
    }

    public boolean checkPassword(String dbPassword, String password){
        return this.passwordEncoder.matches(password, dbPassword);
    }
}
