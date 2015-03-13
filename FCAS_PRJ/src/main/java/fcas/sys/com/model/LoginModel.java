package fcas.sys.com.model;

import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * @logicalName   LoginModel Class
 * @description
 * @version       $Rev: 1.0 $
 */
public class LoginModel implements HttpSessionListener {

	protected static Log log = LogFactory.getLog("egovframework");

    private static Map<String, HttpSession> sessions = new HashMap<String, HttpSession>();

	// USER_ID
    private String userId;

    // 사용자 이름
    private String userNm;

    // 권한
    private String auth;

    // 사용자 유형
    private String userType;

    // 유저 IP
    private String userIp;

    // 로그인 ID
	private String loginId;

	// 로그인 IP
	private String loginPwd;

	private String compId;
	private String compNm;
	private String shopId;
	private String shopNm;
	private String deptNm;
	private String posiNm;
	private String cellNo;
	private String telNo;
	private String faxNo;
	private String emailId;
	private String emailDomain;
	private String authType;
	private String compDiv;

	private String sysMsgCode;
	private String loginPwdChngDate;
	private String logoFileNm;




	public String getLogoFileNm() {
		return logoFileNm;
	}

	public void setLogoFileNm(String logoFileNm) {
		this.logoFileNm = logoFileNm;
	}

	public String getAuthType() {
		return authType;
	}

	public void setAuthType(String authType) {
		this.authType = authType;
	}

	public String getCompDiv() {
		return compDiv;
	}

	public void setCompDiv(String compDiv) {
		this.compDiv = compDiv;
	}

	public String getLoginPwdChngDate() {
		return loginPwdChngDate;
	}

	public void setLoginPwdChngDate(String loginPwdChngDate) {
		this.loginPwdChngDate = loginPwdChngDate;
	}

	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public String getLoginPwd() {
		return loginPwd;
	}

	public void setLoginPwd(String loginPwd) {
		this.loginPwd = loginPwd;
	}

	public String getCompId() {
		return compId;
	}

	public void setCompId(String compId) {
		this.compId = compId;
	}

	public String getCompNm() {
		return compNm;
	}

	public void setCompNm(String compNm) {
		this.compNm = compNm;
	}

	public String getShopId() {
		return shopId;
	}

	public void setShopId(String shopId) {
		this.shopId = shopId;
	}

	public String getShopNm() {
		return shopNm;
	}

	public void setShopNm(String shopNm) {
		this.shopNm = shopNm;
	}

	public String getDeptNm() {
		return deptNm;
	}

	public void setDeptNm(String deptNm) {
		this.deptNm = deptNm;
	}

	public String getPosiNm() {
		return posiNm;
	}

	public void setPosiNm(String posiNm) {
		this.posiNm = posiNm;
	}

	public String getCellNo() {
		return cellNo;
	}

	public void setCellNo(String cellNo) {
		this.cellNo = cellNo;
	}

	public String getTelNo() {
		return telNo;
	}

	public void setTelNo(String telNo) {
		this.telNo = telNo;
	}

	public String getFaxNo() {
		return faxNo;
	}

	public void setFaxNo(String faxNo) {
		this.faxNo = faxNo;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getEmailDomain() {
		return emailDomain;
	}

	public void setEmailDomain(String emailDomain) {
		this.emailDomain = emailDomain;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserNm() {
		return userNm;
	}

	public void setUserNm(String userNm) {
		this.userNm = userNm;
	}

	public String getAuth() {
		return auth;
	}

	public void setAuth(String auth) {
		this.auth = auth;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public String getUserIp() {
		return userIp;
	}

	public void setUserIp(String userIp) {
		this.userIp = userIp;
	}

    public String getSysMsgCode() {
		return sysMsgCode;
	}

	public void setSysMsgCode(String sysMsgCode) {
		this.sysMsgCode = sysMsgCode;
	}

	@Override
    public void sessionCreated(HttpSessionEvent event) {
    	//log.debug("세션 생성");
        sessions.put(event.getSession().getId(), event.getSession());
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
    	//log.debug("세션 종료");
        sessions.remove(event.getSession().getId());
    }

    public static void invalidate(Map sessionInfo) {

    	// 삭제할 세션 정보를 가져온다.
    	String sessionId = sessionInfo.get("SESSION_ID").toString();

    	// 삭제할 세션의 서버url (즉 db상에 저장된 정보
    	String serverUrl = sessionInfo.get("SERVER_IP").toString()+":"+sessionInfo.get("SERVER_PORT").toString();

    	// 현재 접속중인 서버url
    	String nowServerUrl = sessionInfo.get("NOW_SERVER_IP").toString()+":"+sessionInfo.get("NOW_SERVER_PORT").toString();

    	// 로드 밸런싱 되어 있을것에 대비 하여
    	// 현재 내가 접속해 있는 서버를 가져와서 서버 정보가.. 디비에 저장된 서버 정보와 같다면 세션 아이디를 삭제하고
    	// 같지 않다면 디비에 저장되어있는 서버 IP로 접속하여 해당 세션ID 를 삭제 해준다..
    	if( serverUrl.equals( nowServerUrl )) {
    		log.debug("세션 값을 강제로 삭제합니다."+sessionId);
        	HttpSession session = sessions.get(sessionId);
        	if (session != null) {
        		LoginModel loginModel = (LoginModel)session.getAttribute("LoginModel");
        		loginModel.setSysMsgCode("duplicationLogin");
        		session.setAttribute("LoginModel", loginModel);
        		//session.invalidate();
            } else {

            }
    	}

    	// 타 서버세션 값은.. 개발 중에 같은id로 로그인시 타임아웃 문제가 있어.  운영시에만 적용한다.
    	/*
    	else {
    		log.debug("타 서버 세션 값을 강제로 삭제합니다."+sessionId);

    		// 다른서버에 접속된 user 이므로 해당 서버로 접속하여 삭제한다.
     	   try {
     		   	String query = "sessionId="+sessionId;
				String u = "http://"+serverUrl+"/sessionDelete.jsp?";

			    URL url = new URL( u+query );
			    URLConnection urlCon = url.openConnection();
			    HttpURLConnection httpCon = (HttpURLConnection)urlCon;

				BufferedReader in = new BufferedReader(new InputStreamReader(httpCon.getInputStream()));
				in.close();

			} catch (MalformedURLException me) {
				me.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
    	}
    	*/
    }

    public static boolean invalidate(String sessionId) {
    	//log.debug("http통신으로 호출된 세션 값을 강제로 삭제합니다."+sessionId);

       	//Map map = getAllSession();
       	//java.util.Set set = map.entrySet();
        //java.util.Iterator i = set.iterator();
        //while (i.hasNext()) {
        //    log.debug(i.next());
        //}

        HttpSession session = sessions.get(sessionId);

        if (session != null) {
    		LoginModel loginModel = (LoginModel)session.getAttribute("LoginModel");
    		loginModel.setSysMsgCode("duplicationLogin");
    		session.setAttribute("LoginModel", loginModel);
        	//session.invalidate();
            return true;
        } else {
            return false;
        }
    }

    public static Map getAllSession() {
        return sessions;
    }

}
