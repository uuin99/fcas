package fcas.sys.com.web;

import java.net.InetAddress;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fcas.sys.com.model.LoginModel;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.service.LoginService;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;


/**
 * @logicalName   LoginController
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class LoginController {
    @Resource(name = "loginService")
    private LoginService loginService;

    @Resource(name = "commonService")
    private CommonService commonService;

	protected Log log = LogFactory.getLog("egovframework");

    /**
	 * 로그인 초기화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/sys/com/Login/selectLoginView.do")
    public String selectLoginView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	ModelAndView noticeData = loginService.selectNoticeData(model);
    	List noticeList = (ArrayList) noticeData.getModel().get("data");

    	for (int i=0; i<noticeList.size(); i++) {
    		String no = ""+(i+1);
    		HashMap map = (HashMap) noticeList.get(i);

    		model.addAttribute("data_seq_"+no, map.get("SEQ"));
    		model.addAttribute("data_title_"+no, map.get("SUBJ"));
        	model.addAttribute("data_date_"+no, map.get("DATE"));
        	model.addAttribute("data_file_"+no, map.get("FILE_NM"));
        	model.addAttribute("data_content_"+no, map.get("CNTS"));
    	}

    	return "login";
    }

    /**
	 * 로그인을 처리한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/sys/com/Login/actionLogin.do")
    public String actionLogin (HttpServletRequest request,
    		HttpServletResponse response,
    		Map<String, Object> commandMap,
    		ModelMap model
    		) throws Exception {


    	// id pw 체크 로직 수행후
    	Map result = loginService.selectUserCheck( commandMap );
    	//log.debug("result:"+result);


    	if( result == null ) {
    		model.addAttribute("msg", SystemMsg.getMsg("COM_IFO_0004") ); //"로그인 정보가 올바르지 않습니다."
    		return "forward:/sys/com/Login/selectLoginView.do";
    	}

    	// 사용중지자는 로그인 못하게 막는다
    	if( "99".equals( result.get("USER_STAT") ) ) {
    		model.addAttribute("msg", SystemMsg.getMsg("COM_ERR_0048") ); // 사용중지된 사용자 입니다.
    		return "forward:/sys/com/Login/selectLoginView.do";
    	}

    	if( "10".equals( result.get("USER_STAT") ) ) {
    		model.addAttribute("msg", SystemMsg.getMsg("COM_ERR_0049") ); // 서비스 대기중인 사용자 입니다.
    		return "forward:/sys/com/Login/selectLoginView.do";
    	}

    	// 재로그인 일 경우 if 문 로직을 수행한다.
    	if(commandMap.get("reLogin").toString().equals("Y") ) {
	    	// 기존 로그인 정보를 가져와서 그 사람 세션 을 끊어줌..
	    	Map sessionDbInfo = loginService.selectSessionDb( commandMap );
	    	if (sessionDbInfo != null) {
	        	InetAddress inet= InetAddress.getLocalHost();
	        	sessionDbInfo.put("NOW_SERVER_IP", inet.getHostAddress());
	        	sessionDbInfo.put("NOW_SERVER_PORT", request.getServerPort());
	        	LoginModel.invalidate( sessionDbInfo );
	    	}
	    	// 세션 DB에서도 해당 요청 모두 삭제해준다.
	    	Map map = new java.util.HashMap();
	    	map.put("LOGIN_ID", commandMap.get("LOGIN_ID") );
	    	loginService.deleteSessionDb( map );
    	}

    	// 세션 db에 존재하는 로그인 요청인지 검사한다.
    	Map sessionInfo = loginService.selectSessionDbInfo( commandMap );
    	//int sessionCnt = loginService.selectSessionDbCount( commandMap );
    	boolean sessionLoginFlag = false; // 세션에 정보가 있더라도.. 세션 종료시간인 2시간 이전 접속자는 무조건 메세지 띄우는거 없이 접속 시킨다.

    	if( sessionInfo != null ) {
	    	String logindttm = sessionInfo.get("LOGIN_DTTM").toString();
	    	String nowDttm = sessionInfo.get("NOW_DTTM").toString();
	    	// 로그인 시간과  현재 DB시간을 비교하여 분 단위로 환산 하여... 120 분 즉 2시간이 지난 접속자일 경우 메세지 띄움없이 무조건 로그인 시킨다.
		    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		    Date beginDate = formatter.parse(logindttm);
		    Date endDate = formatter.parse(nowDttm);
		    long min = (endDate.getTime() - beginDate.getTime()) / (60 * 1000);
		    log.debug("이전 접속정보:"+min+"분 전 접속자....");

		    if( min >= 120) { // 접속 한지 두시간이 지났다면.. 세션 경고 메세지 없이 무조건 로그인한다. 단 , 기존 세션db 삭제후 로그인한다.
		    	sessionLoginFlag = true;

		    	// 기존 로그인 정보를 가져와서 그 사람 세션 을 끊어줌.. ( 혹시 기존접속자가 있을수도 있으므로 invalidate 시킨다.)
		    	Map sessionDbInfo = loginService.selectSessionDb( commandMap );
		    	if (sessionDbInfo != null) {
		        	InetAddress inet= InetAddress.getLocalHost();
		        	sessionDbInfo.put("NOW_SERVER_IP", inet.getHostAddress());
		        	sessionDbInfo.put("NOW_SERVER_PORT", request.getServerPort());
		        	LoginModel.invalidate( sessionDbInfo );
		    	}
		    	// 세션 DB에서도 해당 요청 모두 삭제해준다.
		    	Map map = new java.util.HashMap();
		    	map.put("LOGIN_ID", commandMap.get("LOGIN_ID") );
		    	loginService.deleteSessionDb( map );


		    } else {
		    	sessionLoginFlag = false;
		    }
    	}

    	if(sessionInfo == null || sessionLoginFlag) {
	        if (result != null && result.get("USER_ID") != null && !result.get("USER_ID").equals("")) {
	        	// 로그인 모델을 생성하여 세션에 저장한다
	        	LoginModel loginModel = new LoginModel();

	        	loginModel.setLoginId( result.get("LOGIN_ID").toString() );
	        	loginModel.setLoginPwd( CommonUtil.base64Encoder( CommonUtil.getObjToString( result.get("LOGIN_PWD").toString() ) ) ); // 암호화 한 값을 저장

	        	loginModel.setUserId( result.get("USER_ID").toString() );
	        	loginModel.setUserNm( result.get("USER_NM").toString() );
	        	loginModel.setUserType( result.get("USER_TYPE").toString() );
	        	loginModel.setAuth( result.get("AUTH").toString() );
	        	loginModel.setAuthType( result.get("AUTH_TYPE").toString() );
	        	loginModel.setCompDiv( result.get("COMP_DIV").toString() );
	        	loginModel.setUserIp( request.getRemoteAddr() );
	        	loginModel.setCompId( result.get("COMP_ID").toString() );

	        	loginModel.setLogoFileNm( result.get("LOGO_FILE_NM").toString() );

	        	loginModel.setCompNm( result.get("COMP_NM").toString() );
	        	loginModel.setShopId( result.get("SHOP_ID").toString() );
	        	loginModel.setShopNm( result.get("SHOP_NM").toString() );
	        	loginModel.setDeptNm( result.get("DEPT_NM").toString() );
	        	loginModel.setPosiNm( result.get("POSI_NM").toString() );
	        	loginModel.setCellNo( result.get("CELL_NO").toString() );
	        	loginModel.setTelNo( result.get("TEL_NO").toString() );
	        	loginModel.setFaxNo( result.get("FAX_NO").toString() );
	        	loginModel.setEmailId( result.get("EMAIL_ID").toString() );
	        	loginModel.setEmailDomain( result.get("EMAIL_DOMAIN").toString() );
	        	loginModel.setLoginPwdChngDate( result.get("LOGIN_PWD_CHNG_DATE").toString() );


	        	request.getSession().setAttribute("LoginModel", loginModel);

	        	// 로그인한 세션의 정보를 세션db에 저장한다.
	        	InetAddress inet= InetAddress.getLocalHost();

	        	commandMap.put("SESSION_ID", request.getSession().getId());
	        	commandMap.put("SERVER_IP", inet.getHostAddress());
	        	commandMap.put("SERVER_PORT", request.getServerPort());

	        	loginService.insertSessionDb( commandMap );

	        	commonService.insertFcaHistSession("A");
	        } else {
	        	model.addAttribute("msg", SystemMsg.getMsg("COM_IFO_0004") ); //"로그인 정보가 올바르지 않습니다."
	        	return "forward:/sys/com/Login/selectLoginView.do";
	        }
    	} else {
        	//model.addAttribute("msg", "비정상적으로 종료 하셨거나 다른 컴퓨터에서 로그인 정보가 존재합니다." );
        	model.addAttribute("loginFail", "fail" );
        	// 재로그인시..
        	//System.out.println(commandMap);
        	model.addAttribute("commandMap", commandMap );

        	return "forward:/sys/com/Login/selectLoginView.do";
    	}

    	return "redirect:/sys/com/Main/mainPage.do";
    	//return "main";
    }

    /**
	 * 로그아웃을 처리한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/sys/com/Login/actionLogout.do")
    public String actionLogout (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model
    		) throws Exception {

    	commonService.insertFcaHistSession("B");

    	// 세션 db에서 삭제해준다.
    	LoginModel loginModel = (LoginModel)request.getSession().getAttribute("LoginModel");
    	Map map = new java.util.HashMap();
    	map.put("LOGIN_ID", loginModel.getLoginId() );
    	loginService.deleteSessionDb( map );

    	// 세션 삭제
    	//request.getSession().setAttribute("LoginModel", null);
    	request.getSession().invalidate();

    	//return selectLoginView(request, response, model);
    	return "redirect:/sys/com/Login/selectLoginView.do";
    }

    /**
	 * 현재 세션을 본다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/sys/com/Login/selectUserSessionView.do")
    public String selectUserSessionView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	LoginModel loginModel = (LoginModel)request.getSession().getAttribute("LoginModel");

    	Map map = loginModel.getAllSession();
    	//log.debug(loginModel.getAllSession());

        java.util.Set set = map.entrySet();
        java.util.Iterator i = set.iterator();
        log.debug("-현재 생성된 세션 List----------------");
        int cnt = 0;
        while (i.hasNext()) {
            log.debug(i.next());
            cnt++;
        }
        log.debug("-총:"+cnt+"건----------------------");

    	log.debug( loginModel.getUserId()+"/"+loginModel.getUserIp() ) ;

    	return "session";
    }

    /**
	 * List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/sys/com/Login/selectMainMenu.do")
    public ModelAndView selectMainMenu(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return loginService.selectMainMenu(model);
    }
}
