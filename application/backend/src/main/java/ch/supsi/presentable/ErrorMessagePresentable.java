package ch.supsi.presentable;

public class ErrorMessagePresentable {
    private String message;
    private String reason;

    public ErrorMessagePresentable(String message, String reason) {
        this.message = message;
        this.reason = reason;
    }

    public String getMessage() {
        return message;
    }

    public String getReason() {
        return reason;
    }
}
