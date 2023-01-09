package ch.supsi.request.transformation_plan;

import ch.supsi.exception.UneceException;
import ch.supsi.request.UneceRequest;
import ch.supsi.request.position.TransformationPlanPositionRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class TransformationPlanRequest extends UneceRequest {
    private String name;
    private List<TransformationPlanPositionRequest> positionRequestList;
    private List<String> processCodeList;
    private List<String> processingStandardList;
    private String productCategoryCode;
    private Date validFrom;
    private Date validUntil;
    private String notes;
    private String traceabilityLevelName;
    private String transparencyLevelName;

    @Override
    public void validate() throws UneceException {
        notNull(name, "name");
        notNull(positionRequestList, "positionRequestList");
        notNull(processCodeList, "processCodeList");
        notNull(validFrom, "validFrom");
        notNull(validUntil, "validUntil");
        notNull(traceabilityLevelName, "traceabilityLevelName");
        notNull(transparencyLevelName, "transparencyLevelName");
        notEmptyStringArray(processCodeList, "processCodeList");
        for (TransformationPlanPositionRequest transformationPlanPositionRequest : positionRequestList) {
            transformationPlanPositionRequest.validate();
        }
    }

}
