package fcas.sys.com.utl;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import fcas.sys.com.model.LoginModel;

/**
 * @logicalName   Common Utility.
 * @description   Common Utility.
 * @version       $Rev: 1.0 $
 */
public class SessionUtil {

	private static SessionUtil one = new SessionUtil();

	public static SessionUtil getInstance() {
         if(one==null) {   one = new SessionUtil();   }
         return one;
    }

	/**
	 * 현재 로그인 된 LoginModel 을 반환한다
	 * @param list
	 * @param cnt
	 * @param bool
	 * @param msg
	 * @return ModelAndView
	 * @exception
	 */
	public LoginModel getLoginModel(){

		ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
		HttpServletRequest req = servletRequestAttributes.getRequest();

		LoginModel loginModel = (LoginModel)req.getSession().getAttribute("LoginModel");

		return loginModel;
	}

}
