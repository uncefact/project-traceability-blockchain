package ch.supsi.model.processing_standard;

import ch.supsi.model.SustainabilityCriterion;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
@Getter @Setter
@NoArgsConstructor
public abstract class ProcessingStandardRoot {

    @Id
    private String name;

    private String logoPath = null;

    private String siteUrl = null;

    @ManyToOne
    private SustainabilityCriterion sustainabilityCriterion;

    public ProcessingStandardRoot(String name) {
        this.name = name;
    }

    public ProcessingStandardRoot(String name, final String logoPath, final String siteUrl, SustainabilityCriterion sustainabilityCriterion){
        this.name = name;
        this.logoPath = logoPath;
        this.siteUrl = siteUrl;
        this.sustainabilityCriterion = sustainabilityCriterion;
    }
}
