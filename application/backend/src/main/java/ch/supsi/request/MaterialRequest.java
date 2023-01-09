package ch.supsi.request;

import ch.supsi.exception.UneceException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class MaterialRequest extends UneceRequest {

    private String name;

    private String companyName;

    private boolean isInput;

    @Override
    public void validate() throws UneceException {
        notNull(name, "name");
        notNull(companyName, "companyName");
        notNull(isInput, "isInput");
    }
}
