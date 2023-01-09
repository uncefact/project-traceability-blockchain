package ch.supsi.core.exception;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import org.junit.Test;

import static org.junit.Assert.*;

public class UneceExceptionTest {

    @Test(expected = UneceException.class)
    public void constructorTest() throws UneceException {
        UneceException uneceException = new UneceException(UneceError.INTERNAL_SERVER_ERROR);
        assertNotNull(uneceException);
        assertEquals("INTERNAL_SERVER_ERROR", uneceException.getMessage());
        assertEquals(UneceError.INTERNAL_SERVER_ERROR, uneceException.getError());
        assertNull(uneceException.getDetails());
        throw uneceException;
    }

    @Test(expected = UneceException.class)
    public void constructor2Test() throws UneceException {
        UneceException innerException = new UneceException(UneceError.USER_NOT_FOUND);
        UneceException uneceException = new UneceException(UneceError.INTERNAL_SERVER_ERROR, innerException);
        assertNotNull(uneceException);
        assertEquals("INTERNAL_SERVER_ERROR", uneceException.getMessage());
        assertEquals(UneceError.INTERNAL_SERVER_ERROR, uneceException.getError());
        assertEquals("USER_NOT_FOUND", uneceException.getDetails());
        throw uneceException;
    }

    @Test(expected = UneceException.class)
    public void constructor3Test() throws UneceException {
        UneceException uneceException = new UneceException(UneceError.INTERNAL_SERVER_ERROR, "test");
        assertNotNull(uneceException);
        assertEquals("INTERNAL_SERVER_ERROR", uneceException.getMessage());
        assertEquals(UneceError.INTERNAL_SERVER_ERROR, uneceException.getError());
        assertEquals("test", uneceException.getDetails());
        throw uneceException;
    }
}
