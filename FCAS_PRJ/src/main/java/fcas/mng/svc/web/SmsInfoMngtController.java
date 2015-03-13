package fcas.mng.svc.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fcas.mng.svc.service.SmsInfoMngtService;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;
import fcas.sys.com.utl.SmsSendUtil;

/**
 * @logicalName   ShopMngtController
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class SmsInfoMngtController {
    @Resource(name = "smsinfomngtService")
    private SmsInfoMngtService smsinfomngtService;

    /**
	 * SMS 발송 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/SmsInfoMngt/selectSmsMngtView.do")
    public String selectShopMngtView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	return "mng/svc/fcas_sms_info_001";
    }
    
    /**
	 * SMS 발송과 SMS 발송 이력을 저장한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/SmsInfoMngt/insertSendSmsMngtView.do")
    public ModelAndView insertOrUpdateShop (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return smsinfomngtService.insertSendSms(model);
    }

    /**
	 * SMS 발송내역 조회를 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/SmsInfoMngt/selectSmsMngtListView.do")
    public String selectMyShopMngtView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	return "mng/svc/fcas_sms_info_002";
    }

    /**
	 * 페이지가 있는 List를 조회한다. (고객사용)
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/SmsInfoMngt/selectSmsMngtList.do")
    public ModelAndView selectMyShopList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

		return smsinfomngtService.selectSmsMngtList(model);
    }
    
    /**
	 * 페이지가 있는 List를 조회한다. (고객사용)
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/SmsInfoMngt/selectUserInfoList.do")
    public ModelAndView selectUserInfoList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

		return smsinfomngtService.selectUserInfoList(model);
    }    
}
