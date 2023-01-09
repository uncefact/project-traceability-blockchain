package ch.supsi.exception;

import ch.supsi.enums.UneceError;

public class UneceException extends Exception {
    private UneceError error;
    private String details;
    private Throwable e;

    public UneceException(UneceError error)
    {
        super(error.getMessage());
        this.error = error;
    }

    public UneceException(UneceError error, Throwable e)
    {
        super(error.getMessage(),e);
        this.error = error;
        this.e = e;
    }

    public UneceException(UneceError error, String details)
    {
        super(error.getMessage());
        this.error = error;
        this.details = details;
    }

    public UneceError getError()
    {
        return this.error;
    }

    public String getDetails() {
        if(this.details == null && this.e != null)
            return e.getMessage();
        else
            return details;
    }
}
