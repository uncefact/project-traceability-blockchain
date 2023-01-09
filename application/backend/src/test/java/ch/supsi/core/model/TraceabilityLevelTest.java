package ch.supsi.core.model;

import ch.supsi.model.TraceabilityLevel;
import static org.junit.Assert.*;

public class TraceabilityLevelTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        TraceabilityLevel traceabilityLevel = new TraceabilityLevel();
        assertNull(traceabilityLevel.getName());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        String name = "TraceabilityLevelTest";
        TraceabilityLevel traceabilityLevel = new TraceabilityLevel();
        traceabilityLevel.setName(name);
        assertEquals(name, traceabilityLevel.getName());
    }
}
