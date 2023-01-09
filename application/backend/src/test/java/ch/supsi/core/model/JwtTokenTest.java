package ch.supsi.core.model;

import ch.supsi.model.JwtToken;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;


public class JwtTokenTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        JwtToken jwtToken = new JwtToken();
        assertNull(jwtToken.getToken());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        JwtToken jwtToken = new JwtToken();
        jwtToken.setToken("tokenTest");
        assertEquals("tokenTest", jwtToken.getToken());
    }
}
