package ch.supsi.model.transformation_plan;

import ch.supsi.model.DocumentType;
import ch.supsi.model.TraceabilityLevel;
import ch.supsi.model.TransparencyLevel;
import ch.supsi.model.company.Company;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class TransformationPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @ManyToOne
    @JoinColumn(nullable = true)
    private Company company;

    @Column
    private Date validFrom;

    @Column
    private Date validUntil;

    @Column
    private String notes;

    @ManyToOne
    private DocumentType documentType;

    @ManyToOne
    private TraceabilityLevel traceabilityLevel;

    @ManyToOne
    private TransparencyLevel transparencyLevel;

    private Date creationDate;

    public TransformationPlan(String name, Company company, Date validFrom, Date validUntil, String notes, Date creationDate) {
        this.name = name;
        this.company = company;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.notes = notes;
        this.creationDate = creationDate;
    }

    public TransformationPlan(String name, Company company, DocumentType documentType){
        this.name = name;
        this.company = company;
        this.documentType = documentType;
    }
}
