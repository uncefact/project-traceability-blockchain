package ch.supsi.request.position;

import ch.supsi.exception.UneceException;
import ch.supsi.presentable.MaterialPresentable;
import ch.supsi.request.UneceRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class PositionRequest extends UneceRequest {

    private Long id;
    private MaterialPresentable material;

    @Override
    public void validate() throws UneceException {
        notNull(id, "id");
        notNull(material, "material");
    }
}
