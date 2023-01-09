package ch.supsi.core.request;

import ch.supsi.exception.UneceException;
import org.junit.Before;
import org.junit.Test;

public abstract class UneceRequestTestTemplate {

    @Before
    public abstract void init();

    @Test
    public abstract void testGetters();

    @Test
    public abstract void testSuccessfulValidation() throws UneceException;

    @Test
    public abstract void testFailingValidation() throws UneceException;
}
