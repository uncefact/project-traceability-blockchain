package ch.supsi.request.transformation_plan;

import ch.supsi.exception.UneceException;
import ch.supsi.request.UneceRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@AllArgsConstructor
public class TransformationPlanUpdateRequest extends UneceRequest {

    private List<String> processingStandardList;
    private String traceabilityLevelName;
    private String transparencyLevelName;

    @Override
    public void validate() throws UneceException {
        notNull(traceabilityLevelName, "traceabilityLevelName");
        notNull(transparencyLevelName, "transparencyLevelName");
    }
}
