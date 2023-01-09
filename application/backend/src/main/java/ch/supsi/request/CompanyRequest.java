package ch.supsi.request;

import ch.supsi.exception.UneceException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyRequest extends UneceRequest {

    private String name;
    private String code;
    private String state;
    private String city;
    private String zip;
    private String address1;
    private String address2;
    private Double latitude;
    private Double longitude;
    private String website;
    private String country;

    @Override
    public void validate() throws UneceException {
        notNull(name, "name");
        notNull(code, "code");
    }
}
