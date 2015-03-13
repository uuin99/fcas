package fcas.sys.com.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import fcas.sys.com.model.LoginModel;
import fcas.sys.com.exception.SecurityException;
import fcas.sys.com.servlet.SystemMsg;


public class SecurityFilter implements Filter {

	protected Log log = LogFactory.getLog("egovframework");

    private void doCheckSession(HttpServletRequest request) {
        String uri = request.getRequestURI();
        //log.debug("URI-SecurityFilter:"+uri);

        // SecurityFilter 에서는 .jsp에 접근시 로그인 세션이 살아있는지 체크하며
        // .do 요청에 대해서는 SecurityInterceptor 에서 제어한다.

        if (uri.endsWith(".jsp")) {
        	if (!uri.endsWith("pcinfoinsert.jsp")){
            if (!uri.endsWith("pcinfoselect.jsp")){
        	if (!uri.endsWith("index.jsp")) {
        		LoginModel loginModel = (LoginModel)request.getSession().getAttribute("LoginModel");

    	        if (loginModel == null) {
    	        	request.setAttribute("msg", SystemMsg.getMsg("COM_IFO_0006")+" - 9001" ); // "사용자 세션이 종료되었습니다."
    	        	throw new fcas.sys.com.exception.SecurityException();

    	        } else {

    	        	// 로그인 정보가 있더라도 sysMsg 에 따라서 다른 동작을 해준다.
    	        	if(loginModel.getSysMsgCode() != null) {

    	        		if(loginModel.getSysMsgCode().equals("duplicationLogin")) {
    	        			request.getSession().invalidate();
    	        			request.setAttribute("msg", SystemMsg.getMsg("COM_IFO_0007") ); // "다른 컴퓨터에서 해당id로 로그인 하여 세션이 종료되었습니다."
    	        			throw new fcas.sys.com.exception.SecurityException();
    	        		}
    	        	}

    	        }
        	}
            }
        	}
        }
    }

    public void init(FilterConfig arg0) throws ServletException {

    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        try {
            doCheckSession((HttpServletRequest) request);
            chain.doFilter(request, response);
        }
        catch (SecurityException se) {
            ((HttpServletResponse) response).sendError(999, se.getMessage());
        }
    }

    public void destroy() {

    }
}
