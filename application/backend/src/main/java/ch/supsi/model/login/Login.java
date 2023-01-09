package ch.supsi.model.login;

import ch.supsi.model.UneceModel;
import ch.supsi.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Login extends UneceModel {
    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Long expires = 0L;

    @OneToOne
    private User user;

    public Login setUsername(String username) {
        this.username = username;
        return this;
    }
    public Login setPassword(String password) {
        this.password = password;
        return this;
    }
    public Login setUser(User user) {
        this.user = user;
        return this;
    }
}
