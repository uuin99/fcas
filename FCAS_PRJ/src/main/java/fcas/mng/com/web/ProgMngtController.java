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

import fcas.mng.com.service.ProgMngtService;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;

/**
 * @logicalName   Program Management Controller.
 * @description   
 * @version       $Rev: 1.0 $
 */
@Controller
public class ProgMngtController {
    @Resource(name = "progmngtService")
    private ProgMngtService progmngtService;
    
    /**
	 * 프로그램 관리 화면을 호출한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return String
	 * @exception 
	 */
    @RequestMapping(value="/mng/com/ProgMngt/selectProgMngtView.do")
    public String selectProgMngtView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "mng/com/fcas_prog_001";
    }
    
    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/mng/com/ProgMngt/selectProgMngt.do")
    public ModelAndView selectProgMngt(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	return progmngtService.selectListPageProgMngt(model);
    }
    
    /**
	 * 저장과 수정을 실행한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/mng/com/ProgMngt/insertOrUpdateProgMngt.do")
    public ModelAndView insertOrUpdateProgMngt(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	ModelAndView view = new ModelAndView("jsonView");
    	
    	try {
    		view = progmngtService.insertOrUpdateListProgMngt(model);
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
    @RequestMapping(value="/mng/com/ProgMngt/deleteProgMngt.do")
    public ModelAndView deleteProgMngt(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	ModelAndView view = new ModelAndView("jsonView");
    	
    	try {
    		view = progmngtService.deleteListProgMngt(model);
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
