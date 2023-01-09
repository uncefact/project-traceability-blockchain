package ch.supsi.request;

import ch.supsi.exception.UneceException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class LoginRequest extends UneceRequest{
    private String username;
    private String password;

    @Override
    public void validate() throws UneceException {
        notNull(username, "username");
        notNull(password, "password");
    }
}
