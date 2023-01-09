package ch.supsi.request;

import ch.supsi.exception.UneceException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UserRequest extends UneceRequest {

    private String password;
    private String firstname;
    private String lastname;
    private String address1;
    private String address2;
    private String zip;
    private String city;
    private String phone;
    private String state;

    @Override
    public void validate() throws UneceException {
        notNull(firstname, "firstname");
        notNull(lastname, "lastname");
    }
}
