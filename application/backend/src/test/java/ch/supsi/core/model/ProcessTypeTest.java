package ch.supsi.core.model;

import ch.supsi.model.ProcessType;
import ch.supsi.model.Role;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class ProcessTypeTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        ProcessType processType = new ProcessType();
        assertNull(processType.getCode());
        assertNull(processType.getName());
        assertNull(processType.getRoles());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        ProcessType processType = new ProcessType();
        processType.setCode("123456");
        assertEquals(processType.getCode(), "123456");
        processType.setName("Process name");
        assertEquals(processType.getName(), "Process name");

        Set<Role> roles = new HashSet<>(Collections.singletonList(new Role("roleTest", null)));
        processType.setRoles(roles);
        assertEquals(roles, processType.getRoles());

        ProcessType processType1 = new ProcessType("PCODE", "Process Type 1", roles);
        assertEquals("Process Type 1", processType1.getName());
        assertEquals("PCODE", processType1.getCode());
        assertEquals(roles, processType1.getRoles());

    }
}
