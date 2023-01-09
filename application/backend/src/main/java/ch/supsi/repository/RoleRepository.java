package ch.supsi.repository;

import ch.supsi.model.Role;
import ch.supsi.model.company.CompanyIndustry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {

    List<Role> findRolesByCompanyIndustriesContains(CompanyIndustry companyIndustry);
}
