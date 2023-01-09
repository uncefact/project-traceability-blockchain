package ch.supsi.repository.transaction.certificate.assessment_type;

import ch.supsi.model.transaction.certification.assessment_type.SelfCertificationAssessmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SelfCertificationAssessmentTypeRepository extends JpaRepository<SelfCertificationAssessmentType, String> {
}
