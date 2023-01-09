package ch.supsi.repository;

import ch.supsi.model.login.Login;
import ch.supsi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface LoginRepository extends JpaRepository<Login, Long> {

    @Query("SELECT l FROM Login l WHERE l.username = :username AND l.expired is null")
    Login findLoginByUsernameAndExpiredIsNull(String username);

    Login findByUserAndExpiredIsNull(User user);

    List<Login> findByUserIn(Collection<User> users);
}
