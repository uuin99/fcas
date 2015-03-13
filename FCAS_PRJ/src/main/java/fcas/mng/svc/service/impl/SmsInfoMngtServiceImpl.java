package fcas.mng.svc.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.mng.svc.service.SmsInfoMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;
import fcas.sys.com.utl.SmsSendUtil;

/**
 * @logicalName   ShopMngtServiceImpl
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("smsinfomngtService")
public class SmsInfoMngtServiceImpl extends AbstractServiceImpl implements SmsInfoMngtService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /**
	 * SMS 실시간 전송한다.
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertSendSms(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;
		int totlCnt = 0;
    	int succCnt = 0;
    	int failCnt = 0;
    	String infoMsg = "";
		try{
			Map<String, Object> loginMap = (HashMap<String, Object>)commonDAO.selectData("smsmngt.getSmsIdPass", model);
			LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
	    	if(loginMap.get("REV_TIME_VALID").toString().startsWith("COM_ERR_")){
	    		view.addObject("data", null);
	        	view.addObject("total", 0);    		
	    		view.addObject("success", false);
	        	view.addObject("message", SystemMsg.getMsg(loginMap.get("REV_TIME_VALID").toString()));
	        	return view;
	    	}
	    	SmsSendUtil smsUtil = new SmsSendUtil(loginMap.get("ID").toString(), loginMap.get("PASS").toString());
	    	List<Map<String, Object>> insert_dataList = CommonUtil.getListFromJson(model.get("SEND_LIST").toString());
	    	totlCnt = insert_dataList.size();
	    	if (insert_dataList != null && !insert_dataList.isEmpty()) {
	            for (Map<String, Object> map : insert_dataList) {
	            	Map<String, Object> tempModel = smsUtil.sendSms(map.get("CELL_NO").toString(), model.get("SMS_FROM").toString(), model.get("SMS_DATE") == null ? "" : model.get("SMS_DATE").toString(), model.get("SMS_MSG").toString(), "G", map.get("USER_ID") == null ? "" : map.get("USER_ID").toString(), map.get("USER_NM").toString(), loginModel.getUserId());
	            	extCnt += commonDAO.insertData("smsmngt.insertSmsInfo", tempModel);
	            	if("0".equals(smsUtil.getRetCode())){
	            		succCnt ++;
	            	}else {
	            		failCnt ++;
	            	}
	            }
			}
	    	infoMsg = "(총 "+totlCnt+"건 중 성공 "+succCnt+"건, 실패 "+failCnt+"건)";
			view.addObject("data", null);
	    	view.addObject("total", extCnt);
	    	view.addObject("success", true);
	    	view.addObject("message", SystemMsg.getMsg("COM_RST_0006") + infoMsg); //저장을 완료하였습니다.
	    	return view;	    	
		}catch(Exception ex){
			ex.printStackTrace();
			infoMsg = "(총 "+totlCnt+"건 중 "+succCnt+"건 성공 후 실패)";
			view.addObject("data", null);
	    	view.addObject("total", extCnt);
	    	view.addObject("success", false);
	    	view.addObject("message", SystemMsg.getMsg("COM_ERR_0085") +  infoMsg); //저장을 완료하였습니다.
	    	view.addObject("error", ex.getLocalizedMessage());
	    	return view;
		}
	}

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectSmsMngtList(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("smsmngt.getSmsSendList", model);
    }
    
    /**
	 * 사용자 정보를 페이지가 있는 List로 조회한다.
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectUserInfoList(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("smsmngt.getUserInfoList", model);
    }
    
    /**
	 * SMS 서비스 업체의 Login 정보를 호출한다.
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public HashMap<String, Object> selectSmsLoginInfo(Map<String, Object> model) throws Exception {
        return (HashMap<String, Object>)commonDAO.selectData("smsmngt.getSmsIdPass", model);
    }        
    
}
