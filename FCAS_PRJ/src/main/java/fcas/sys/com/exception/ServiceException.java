package fcas.sys.com.exception;

@SuppressWarnings("serial")
public class ServiceException extends RuntimeException {

	public ServiceException() {
        super();
    }

    public ServiceException(String message) {
        super(message);
    }
}
