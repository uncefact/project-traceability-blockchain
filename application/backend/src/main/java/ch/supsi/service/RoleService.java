package ch.supsi.service;

import ch.supsi.model.Role;
import ch.supsi.model.company.Company;
import ch.supsi.repository.RoleRepository;
import ch.supsi.repository.company.CompanyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {

    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;

    public RoleService(RoleRepository roleRepository, CompanyRepository companyRepository) {
        this.roleRepository = roleRepository;
        this.companyRepository = companyRepository;
    }

    public Role getRoleByName(String name){
        Optional<Role> role = roleRepository.findById(name);
        return role.orElse(null);
    }

    public List<Role> getAllRoles(String invitedCompanyName) {
        Company invitedCompany = companyRepository.findByCompanyName(invitedCompanyName);
        return roleRepository.findRolesByCompanyIndustriesContains(invitedCompany.getCompanyIndustry());
    }
}
