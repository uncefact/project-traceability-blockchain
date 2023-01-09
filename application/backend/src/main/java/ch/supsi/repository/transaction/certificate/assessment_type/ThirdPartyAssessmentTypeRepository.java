package ch.supsi.repository.transaction.certificate.assessment_type;

import ch.supsi.model.transaction.certification.assessment_type.ThirdPartyAssessmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ThirdPartyAssessmentTypeRepository extends JpaRepository<ThirdPartyAssessmentType, String> {
}
