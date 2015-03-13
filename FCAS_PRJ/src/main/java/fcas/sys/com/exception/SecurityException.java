package fcas.sys.com.exception;

@SuppressWarnings("serial")
public class SecurityException extends RuntimeException {

	public SecurityException() {
        super();
    }

    public SecurityException(String message) {
        super(message);
    }
}
