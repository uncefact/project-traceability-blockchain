package ch.supsi.request;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;

import java.util.List;

public abstract class UneceRequest {
    public abstract void validate() throws UneceException;

    protected void notNull(Object value, String name) throws UneceException {
        if (value == null)
            throw new UneceException(UneceError.PARAMETER_MISSING, name);
    }

    protected void notEmptyStringArray(List<String> array, String name) throws UneceException {
        if (array.size() == 0)
            throw new UneceException(UneceError.INVALID_VALUE, name);
    }

    protected void isNull(Object value, String name) throws UneceException {
        if (value != null)
            throw new UneceException(UneceError.UNRECOGNIZED_PARAMETER, name);
    }

    protected void notEmptyString(String value, String name) throws UneceException {
        if (value.isEmpty())
            throw new UneceException(UneceError.INVALID_VALUE, name);
    }

    protected void notOnlyWitheSpace(String value, String name) throws UneceException {
        if (value.trim().isEmpty())
            throw new UneceException(UneceError.INVALID_VALUE, name);
    }
}
