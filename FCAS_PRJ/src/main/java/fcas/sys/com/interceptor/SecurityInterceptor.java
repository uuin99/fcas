package fcas.sys.com.interceptor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import net.sf.json.JSONObject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import fcas.sys.com.model.LoginModel;
import fcas.sys.com.servlet.SystemMsg;


@Service("securityInterceptor")
public class SecurityInterceptor extends HandlerInterceptorAdapter {

	protected Log log = LogFactory.getLog("egovframework");

    // 세션체크를 하지 않을 action 배열
    private static String[] nonChkListUrl = new String[6];

    static{
    	// .do 중 로그인 세션을 체크하지 않는 요청의 배열
    	nonChkListUrl[0] = "/sys/com/Login/selectLoginView.do"; // 최초 로그인 페이지
    	nonChkListUrl[1] = "/sys/com/Login/actionLogin.do"; // 로그인 액션
    	nonChkListUrl[2] = "/sys/com/Login/actionLogout.do"; // 로그아웃 액션
    	nonChkListUrl[3] = "/sys/com/Login/selectUserSessionView.do"; // test용 현재세션 보기
    	nonChkListUrl[4] = "/sys/com/Common/getPublicBrdFileDownload.do"; //공지사항 File Download.
    	nonChkListUrl[5] = "/sys/com/Common/getPublicBrdSearch.do"; //공지사항 Count Up.
    }


	public boolean preHandle( HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        String uri = request.getRequestURI();
        boolean ajaxFlag = false;
        if( "XMLHttpRequest".equals(request.getHeader("x-requested-with")) ) {
        	ajaxFlag = true;
        }


        boolean isOk = false;
		for(int ii = 0 ; ii < nonChkListUrl.length ; ii++){
		    if(uri.indexOf(nonChkListUrl[ii]) == -1){
		        isOk = true;
		    } else {
		        isOk = false;
		        break;
		    }
		}

        log.debug("URI-SecurityInterceptor:"+uri+" ... ajaxFlag :"  +ajaxFlag + " ... isOk:"+isOk);

	    if(isOk) {

	        LoginModel loginModel = (LoginModel)request.getSession().getAttribute("LoginModel");

	        if (loginModel == null) {

	        	if(ajaxFlag) {

	        		showAjaxMessage( SystemMsg.getMsg("COM_IFO_0006")+" - 9002" , response); // "사용자 세션이 종료되었습니다."
	        		return false;
	        	} else {
	        		request.setAttribute("msg", SystemMsg.getMsg("COM_IFO_0006")+" - 9003" ); // "사용자 세션이 종료되었습니다."
	        		throw new fcas.sys.com.exception.SecurityException();
	        	}

	        } else {

	        	// 로그인 정보가 있더라도 sysMsg 에 따라서 다른 동작을 해준다.
	        	if(loginModel.getSysMsgCode() != null) {

		        	if(ajaxFlag) {


		        		if(loginModel.getSysMsgCode().equals("duplicationLogin")) {
		        			request.getSession().invalidate();
		        			showAjaxMessage(  SystemMsg.getMsg("COM_IFO_0007") , response ); // "다른 컴퓨터에서 해당id로 로그인 하여 세션이 종료되었습니다."
		        			return false;
		        		}

		        	} else {
		        		if(loginModel.getSysMsgCode().equals("duplicationLogin")) {
		        			request.getSession().invalidate();
		        			request.setAttribute("msg", SystemMsg.getMsg("COM_IFO_0007") ); // "다른 컴퓨터에서 해당id로 로그인 하여 세션이 종료되었습니다."
		        			throw new fcas.sys.com.exception.SecurityException();
		        		}
		        	}
	        	}


		        // 로그인 정보가 있다면..
		        // 각각의 uri 별로 권한을 체크 한다.

	            /*
	            String userId = loginModel.getUserId();
				String auth = loginModel.getAuth();

	            String program = xxxService.selectPgmInfo(userId , auth);

	            if (program == null) {
	                throw new SecurityChkException("해당 동작에 대한 권한이 없습니다.");
	            }
	    		*/

	        }

	    }

		return true;
	}

	public void showAjaxMessage(String msg , HttpServletResponse response) throws Exception {

	    Map<String, Object> data = new HashMap<String, Object>();
	    data.put( "success", false );
	    data.put( "message", msg );
	    data.put( "reqLogin", "true" );
	    JSONObject json = new JSONObject();
	    json.putAll( data );
	    //System.out.printf( "JSON: %s", json.toString(2) );
	    //System.out.println( "JSON: "+ json.toString() );

	    response.setContentType("text/html; charset=UTF-8");
	    response.getWriter().print(  json.toString()  );


	}

	public void postHandle( HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

	}


}