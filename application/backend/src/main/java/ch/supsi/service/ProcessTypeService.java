package ch.supsi.service;

import ch.supsi.model.Role;
import ch.supsi.model.ProcessType;
import ch.supsi.repository.ProcessTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProcessTypeService {
    private final ProcessTypeRepository processTypeRepository;

    public ProcessTypeService(ProcessTypeRepository processTypeRepository) {
        this.processTypeRepository = processTypeRepository;
    }

    public List<ProcessType> getAllProcessTypes() {
        return processTypeRepository.findAll();
    }

    public ProcessType getProcessByCode(String code) {
        return processTypeRepository.findByCode(code);
    }

    public List<ProcessType> getAllProcessTypeRolesByRole(Role role){
        return processTypeRepository.findProcessTypesByRolesContains(role);
    }

//    public Process addProcess(Process process) {
//        return processRepository.save(process);
//    }
}
