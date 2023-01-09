package ch.supsi.core.model;

import ch.supsi.model.TransparencyLevel;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class TransparencyLevelTest extends ModelTestTemplate{
    @Override
    public void testConstructor() throws Exception {
        TransparencyLevel transparencyLevel = new TransparencyLevel();
        assertNull(transparencyLevel.getName());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        String name = "TransparencyLevelTest";
        TransparencyLevel transparencyLevel = new TransparencyLevel();
        transparencyLevel.setName(name);
        assertEquals(name, transparencyLevel.getName());
    }
}
