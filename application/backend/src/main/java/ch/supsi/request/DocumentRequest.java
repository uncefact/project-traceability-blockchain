package ch.supsi.request;

import ch.supsi.exception.UneceException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DocumentRequest extends UneceRequest{

    private String name;
    private String contentType;
    private String content;

    @Override
    public void validate() throws UneceException {
        notNull(name, "name");
        notNull(content, "content");
        notNull(contentType, "contentType");
    }
}
