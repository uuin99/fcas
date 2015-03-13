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

import fcas.mng.com.service.CodeMngtService;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.servlet.SystemCode;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;

/**
 * @logicalName   Code Management Controller.
 * @description   
 * @version       $Rev: 1.0 $
 */
@Controller
public class CodeMngtController {
    @Resource(name = "codemngtService")
    private CodeMngtService codemngtService;
    
    /**
	 * 공통코드 관리 화면을 호출한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return String
	 * @exception 
	 */
    @RequestMapping(value="/mng/com/CodeMngt/selectCodeMngtView.do")
    public String selectCodeMngtView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "mng/com/fcas_code_001";
    }
    
    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/mng/com/CodeMngt/selectCodeMngt.do")
    public ModelAndView selectCodeMngt(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	return codemngtService.selectListPageCodeMngt(model);
    }
    
    /**
	 * 저장과 수정을 실행한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/mng/com/CodeMngt/insertOrUpdateCodeMngt.do")
    public ModelAndView insertOrUpdateCodeMngt(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	ModelAndView view = new ModelAndView("jsonView");
    	
    	try {
    		view = codemngtService.insertOrUpdateListCodeMngt(model);
    		
    		//Momory Init
        	SystemCode sysCd = SystemCode.getInstance();
    		sysCd.initCode();
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
	 * 삭제를 실행한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/mng/com/CodeMngt/deleteCodeMngt.do")
    public ModelAndView deleteCodeMngt(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	ModelAndView view = new ModelAndView("jsonView");
    	
    	try {
    		view = codemngtService.deleteListCodeMngt(model);
    		
    		//Momory Init
        	SystemCode sysCd = SystemCode.getInstance();
    		sysCd.initCode();
    	} catch(ServiceException se){
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg(se.getLocalizedMessage()));
        	view.addObject("error", se.getLocalizedMessage());    		
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
