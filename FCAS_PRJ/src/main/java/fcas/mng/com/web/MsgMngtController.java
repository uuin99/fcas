package fcas.mng.com.web;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fcas.mng.com.service.MsgMngtService;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;

/**
 * @logicalName   Message Management Controller.
 * @description   
 * @version       $Rev: 1.0 $
 */
@Controller
public class MsgMngtController {
    @Resource(name = "msgmngtService")
    private MsgMngtService msgmngtService;
    
    @Resource(name = "commonService")
    private CommonService commonService;
    
    /**
	 * 메시지코드화면을 호출한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return String
	 * @exception 
	 */	
    @RequestMapping(value="/mng/com/MsgMngt/selectMsgMngtView.do")
    public String selectMsgMngtView( HttpServletRequest request, HttpServletResponse response , ModelMap model ) throws Exception {
    	return "mng/com/fcas_msg_001";
	}
    
    /**
	 * 메시지코드를 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/mng/com/MsgMngt/selectMsgMngt.do")
    public ModelAndView selectMsgMngt(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*commonService.insertFcaHistSearch("fcas_msg_001", "A", model);*/
    	return msgmngtService.selectListPageMsgMngt(model);
    }
    
    /**
	 * 메시지 코드 저장과 수정을 실행한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/mng/com/MsgMngt/insertOrUpdateMsgMngt.do")
    public ModelAndView insertOrUpdateMsgMngt(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	ModelAndView view = new ModelAndView("jsonView");
    	System.out.println(model);
    	try {
    		view = msgmngtService.insertOrUpdateListMsgMngt(model);
    		/*//입력 Data 존재 시
    		if (! "0".equals(view.getModel().get("inCnt"))) {
    			commonService.insertfcaHistTrans("fcas_msg_001", "B");
    		}
    		//수정 Data 존재 시
    		if (! "0".equals(view.getModel().get("upCnt"))) {
    			commonService.insertfcaHistTrans("fcas_msg_001", "D");
    		}*/
    	} catch(Exception ex) {
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg(CommonUtil.getExpToMsg(ex,"COM_ERR_0001")));//저장에 실패하였습니다.
        	view.addObject("error", ex.getLocalizedMessage());
    	}
    	
    	return view;
    }
    
    /**
	 * 메시지 코드 삭제를 실행한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/mng/com/MsgMngt/deleteMsgMngt.do")
    public ModelAndView deleteMngMngt(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	ModelAndView view = new ModelAndView("jsonView");
    	
    	try{
    		view = msgmngtService.deleteListMngMngt(model);
    		/*//삭제한 이력 존재 시
    		if(! "0".equals(view.getModel().get("total"))){
    			commonService.insertfcaHistTrans("fcas_msg_001", "E");
    		}*/
    	} catch(Exception ex) {
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg("COM_ERR_0003"));//삭제에 실패하였습니다.
        	view.addObject("error", ex.getLocalizedMessage());
    	}
    	
        return view;
    }    
}
