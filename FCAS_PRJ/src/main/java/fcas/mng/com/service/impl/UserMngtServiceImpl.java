package fcas.mng.com.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import egovframework.rte.fdl.idgnr.EgovIdGnrService;
import fcas.sys.com.model.LoginModel;
import fcas.mng.com.service.UserMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   User Management Service Impl.
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("usermngtService")
public class UserMngtServiceImpl extends AbstractServiceImpl implements UserMngtService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    @Resource(name = "commonService")
    private CommonService commonService;

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListPageUserMngt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("usermngt.selectUserList", model);
    }

    /**
	 * 단일 Data를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectUser(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("usermngt.selectUser", model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateUser(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
		String userId = CommonUtil.getObjToString(model.get("USER_ID"));

		//신규
		if("".equals(userId)){

			// 로직추가 : 서버단 loginId 중복을 체크한다 (동시에 같은 id로 변경할경우 클라이언트 벨리데이션을 통과하였더라도 서버단 벨리데이션을 실행한다.)
			model.put("SESSION_LOGIN_ID",model.get("PRE_LOGIN_ID").toString());
        	int cnt = (Integer)commonDAO.selectData("usermngt.selectLoginId", model);

        	if(cnt == 0) {

        		userId = commonService.getSequenceValue("USER_ID", 11 , "PE-XY2M2D2" , "SS");

    			model.put("USER_ID", userId);
    			model.put("REGI_ID", loginModel.getUserId());

    			// 비밀번호 암호화

    			model.put("LOGIN_PWD", CommonUtil.base64Encoder( CommonUtil.getObjToString(model.get("LOGIN_PWD") ) ) );

    			// 로직 추가..
    			// 권한이 엉뚱하게 들어가는것을 서비스익셉션으로 막아준다.
    			Map chkMap = (Map)commonDAO.selectData("usermngt.selectCheckAuth", model);

    			//System.out.println(chkMap);

    			if("0".equals( chkMap.get("COMP_DIV") ) && ( "B".equals( chkMap.get("AUTH_TYPE") ) || "C".equals( chkMap.get("AUTH_TYPE") ) ) ) {
    				throw new ServiceException( SystemMsg.getMsg("COM_ERR_0047") ); //고객사 구분과 권한 유형이 일치하지 않습니다.
    			}

    			if( ! "0".equals( chkMap.get("COMP_DIV") ) && ( ! "B".equals( chkMap.get("AUTH_TYPE") ) && ! "C".equals( chkMap.get("AUTH_TYPE") ) ) ) {
    				throw new ServiceException( SystemMsg.getMsg("COM_ERR_0047") ); //고객사 구분과 권한 유형이 일치하지 않습니다.
    			}

    			extCnt += commonDAO.insertData("usermngt.insertUser", model);

        	} else {
        		throw new ServiceException( SystemMsg.getMsg("COM_ERR_0034") ); //로그인ID가 이미 사용중입니다.
        	}


		//수정
		}else {
			model.put("UPDT_ID", loginModel.getUserId());


			// 로그인 id 가 변경되어 넘어오는 경우..
			if( ! CommonUtil.getObjToString(model.get("LOGIN_ID")).equals( CommonUtil.getObjToString(model.get("PRE_LOGIN_ID") ) ) ) {
				model.put("LOGIN_ID_CHNG_DATE", "Y");
			}
			
			// 비밀번호가 변경되어 넘어오는 경우..
			if( ! CommonUtil.getObjToString(model.get("LOGIN_PWD")).equals( CommonUtil.getObjToString(model.get("PRE_LOGIN_PWD") ) ) ) {
				model.put("LOGIN_PWD_CHNG_DATE", "Y");
			}			

			// 사용자 상태가 사용중지 일경우 사용중지일자를 박아준다.
			if( "99".equals( CommonUtil.getObjToString(model.get("USER_STAT") ) ) ) {
				model.put("STOP_DT", "Y");
			}


			// 로직추가 : 서버단 loginId 중복을 체크한다 (동시에 같은 id로 변경할경우 클라이언트 벨리데이션을 통과하였더라도 서버단 벨리데이션을 실행한다.)
			model.put("SESSION_LOGIN_ID",model.get("PRE_LOGIN_ID").toString());
        	int cnt = (Integer)commonDAO.selectData("usermngt.selectLoginId", model);

        	if(cnt == 0) {

    			// 로직 추가..
    			// 권한이 엉뚱하게 들어가는것을 서비스익셉션으로 막아준다.
    			Map chkMap = (Map)commonDAO.selectData("usermngt.selectCheckAuth", model);

    			//System.out.println(chkMap);


    			if("0".equals( chkMap.get("COMP_DIV") ) && ( "B".equals( chkMap.get("AUTH_TYPE") ) || "C".equals( chkMap.get("AUTH_TYPE") ) ) ) {
    				throw new ServiceException( SystemMsg.getMsg("COM_ERR_0047") ); //고객사 구분과 권한 유형이 일치하지 않습니다.
    			}

    			if( ! "0".equals( chkMap.get("COMP_DIV") ) && ( ! "B".equals( chkMap.get("AUTH_TYPE") ) && ! "C".equals( chkMap.get("AUTH_TYPE") ) ) ) {
    				throw new ServiceException( SystemMsg.getMsg("COM_ERR_0047") ); //고객사 구분과 권한 유형이 일치하지 않습니다.
    			}


        		extCnt += commonDAO.updateData("usermngt.updateUser", model);
        	} else {
        		throw new ServiceException( SystemMsg.getMsg("COM_ERR_0034") ); //로그인ID가 이미 사용중입니다.
        	}

			// 로그인 id 가 변경되어 넘어오는 경우..
			if( ! CommonUtil.getObjToString(model.get("LOGIN_ID")).equals( CommonUtil.getObjToString(model.get("PRE_LOGIN_ID") ) ) ) {
				// 로직추가 : 로그인 id 변경시에 세션정보를 바뀐 로그인id로 갱신해준다.
				loginModel.setLoginId(CommonUtil.getObjToString(model.get("LOGIN_ID")));
				ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
				HttpServletRequest req = servletRequestAttributes.getRequest();
				req.getSession().setAttribute("LoginModel", loginModel);
			}
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0001")); //저장을 완료하였습니다.

    	return view;
	}


    /**
	 * 수정을 실행한다. (자기 자신것만 수정)
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView updateUserMyinfo(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();


		model.put("UPDT_ID", loginModel.getUserId());
		model.put("USER_ID", loginModel.getUserId());


		// 로그인 id 가 변경되어 넘어오는 경우..
		if( ! CommonUtil.getObjToString(model.get("LOGIN_ID")).equals( CommonUtil.getObjToString(model.get("PRE_LOGIN_ID") ) ) ) {
			model.put("LOGIN_ID_CHNG_DATE", "Y");
		}


		// 로그인 PWD 가 변경되어 넘어오는 경우..
		String loginPwd =   CommonUtil.getObjToString(model.get("LOGIN_PWD"));
		String preLoginPwd = CommonUtil.getObjToString(model.get("PRE_LOGIN_PWD")); // 이미 암호화 된값


		if( ! loginPwd.equals( preLoginPwd ) ) {
			model.put("LOGIN_PWD_CHNG_DATE", "Y");
			model.put("LOGIN_PWD", CommonUtil.base64Encoder( loginPwd ) ); // 암호화

			// 2012 08 29 세션에 비빈번호 변경일자를 넣기로 하여서 비번 변경시 세션을 최신화 시켜준다.
			SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMdd");
			String now = fmt.format(new Date());
			loginModel.setLoginPwdChngDate(now);
			ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
			HttpServletRequest req = servletRequestAttributes.getRequest();
			req.getSession().setAttribute("LoginModel", loginModel);
		}


		// 로직추가 : 서버단 loginId 중복을 체크한다 (동시에 같은 id로 변경할경우 클라이언트 벨리데이션을 통과하였더라도 서버단 벨리데이션을 실행한다.)
		model.put("SESSION_LOGIN_ID",loginModel.getLoginId());
    	int cnt = (Integer)commonDAO.selectData("usermngt.selectLoginId", model);


    	if(cnt == 0) {
    		extCnt += commonDAO.updateData("usermngt.updateUserMyInfo", model);
    	} else {
    		throw new ServiceException( SystemMsg.getMsg("COM_ERR_0034") ); //로그인ID가 이미 사용중입니다.
    	}

		// 로그인 id 가 변경되어 넘어오는 경우..
		if( ! CommonUtil.getObjToString(model.get("LOGIN_ID")).equals( CommonUtil.getObjToString(model.get("PRE_LOGIN_ID") ) ) ) {
			// 로직추가 : 로그인 id 변경시에 세션정보를 바뀐 로그인id로 갱신해준다.
			loginModel.setLoginId(CommonUtil.getObjToString(model.get("LOGIN_ID")));
			ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
			HttpServletRequest req = servletRequestAttributes.getRequest();
			req.getSession().setAttribute("LoginModel", loginModel);
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0001")); //저장을 완료하였습니다.

    	return view;
	}


    /**
	 * 삭제를 실행한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView deleteUser(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		extCnt += commonDAO.deleteData("usermngt.deleteUser", model);

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003")); //삭제를 완료하였습니다.

    	return view;
	}


    /**
	 * 정의된 값의 중복여부를 Checking 함.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectCheckLoginId(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;
		String retCode = "COM_ERR_0012";//{param1}은(는) 현재 존재하는 값으로 사용이 불가능합니다.
		extCnt = (Integer)commonDAO.selectData("usermngt.selectCheckLoginId", model);

		if(extCnt == 0){
			retCode = "COM_RST_0005";//{param1}은(는) 사용이 가능합니다.
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg(retCode));
    	view.addObject("messageCode", retCode);

    	return view;
	}


    /***********Combo 정의 영역 Start*******************/
    /**
	 * 영업담당자 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectSalesMnge(Map<String, Object> model) throws Exception {
    	return commonDAO.selectListJsonView("usermngt.selectSalesMnge", model);
	}
    /***********Combo 정의 영역 End*******************/


    // test
    public List selectUserList(Map<String, Object> model) throws Exception {
    	return (List)commonDAO.selectList("usermngt.selectRxTestList", model);
    }
    // test
    public List selectUserList2(Map<String, Object> model) throws Exception {
    	return (List)commonDAO.selectList("usermngt.selectRxTestList2", model);
    }

}
