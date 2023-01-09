package ch.supsi.service;

import ch.supsi.model.login.Login;
import ch.supsi.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
public class UneceUserDetailsService implements UserDetailsService {
    private final LoginRepository loginRepository;

    @Autowired
    public UneceUserDetailsService(
            LoginRepository loginRepository
    )
    {
        this.loginRepository = loginRepository;
    }
    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        Login login = this.loginRepository.findLoginByUsernameAndExpiredIsNull(s);

        if (login == null)
            throw new UsernameNotFoundException(s);

        return new UserDetails() {
            @Override
            public Collection<? extends GrantedAuthority> getAuthorities() {
                return Collections.singletonList(new SimpleGrantedAuthority(login.getUser() != null ? "USER" : "ADMIN"));
            }

            @Override
            public String getPassword() {
                return login.getPassword();
            }

            @Override
            public String getUsername() {
                return login.getUsername();
            }

            @Override
            public boolean isAccountNonExpired() {
                return login.getExpires().equals(0L) || login.getExpires() >= System.currentTimeMillis();
            }

            @Override
            public boolean isAccountNonLocked() {
                return true;
            }

            @Override
            public boolean isCredentialsNonExpired() {
                return true;
            }

            @Override
            public boolean isEnabled() {
                return true;
            }
        };
    }
}
