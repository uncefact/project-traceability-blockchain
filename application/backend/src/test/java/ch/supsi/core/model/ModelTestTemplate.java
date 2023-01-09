package ch.supsi.core.model;

import org.junit.Test;
import org.springframework.test.context.ActiveProfiles;

public abstract class ModelTestTemplate {

    @Test
    public abstract void testConstructor() throws Exception;

    @Test
    public abstract void testGettersAndSetters() throws Exception;
}
