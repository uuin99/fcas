package fcas.mng.svc.web;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fcas.mng.svc.service.NecConMngtService;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.servlet.SystemMsg;

/**
 * @logicalName   DataCntController
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class NecConMngtController {
    @Resource(name = "necconmngtService")
    private NecConMngtService necconmngtService;
    
    /* FA 연계작업현황 Start */
    
    /**
	 * FA 연계작업현황 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/NecConMngt/selectNecPrgsView.do")
    public String selectNecPrgsView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	
    	return "mng/svc/fcas_nec_prgs_001";
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/NecConMngt/selectNecPrgsList.do")
    public ModelAndView selectNecPrgsList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return necconmngtService.selectNecPrgsList(model);
    }
    
    /**
	 * 예약 스케쥴 등록을 실행한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/NecConMngt/insertNecApmtAddBatch.do")
    public ModelAndView insertNecApmtAddBatch (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {


    	ModelAndView view = new ModelAndView("jsonView");
    	System.out.println(model);
    	try {
    		view = necconmngtService.insertNecApmtAddBatch(model);
    	} catch(ServiceException se){
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", se.getLocalizedMessage());
        	view.addObject("error", se.getLocalizedMessage());    		    		
    	} catch(Exception ex) {
     		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg("COM_ERR_0001"));//저장에 실패하였습니다.
        	view.addObject("error", ex.getLocalizedMessage());
    	}
    	
    	return view;    	
    }    
    
    /* FA 연계작업 현황 End */
    
    /* FA 연계작업 관리 Start */

    /**
	 * FA 연계작업관리 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/NecConMngt/selectNecApmtMngtView.do")
    public String selectNecApmtMngtView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	
    	return "mng/svc/fcas_nec_apmt_001";
    }    
    
    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/NecConMngt/selectNecApmtMngtList.do")
    public ModelAndView selectNecApmtMngtList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return necconmngtService.selectNecApmtMngtList(model);
    }
    
    /**
	 * 단일 Data를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/NecConMngt/selectNecApmtMngt.do")
    public ModelAndView selectNecApmtMngt (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return necconmngtService.selectNecApmtMngt(model);
    }
    
    /**
	 * 저장과 수정을 실행한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/NecConMngt/insertOrUpdateNecApmt.do")
    public ModelAndView insertOrUpdateNecApmt (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
	    	ModelAndView view = new ModelAndView("jsonView");
	    	System.out.println(model);
	    	try {
	    		view = necconmngtService.insertOrUpdateNecApmt(model);
	    	} catch(ServiceException se){
	    		view = null; view = new ModelAndView("jsonView");
	    		view.addObject("data", null);
	        	view.addObject("total", 0);
	        	view.addObject("success", false);
	        	view.addObject("message", se.getLocalizedMessage());
	        	view.addObject("error", se.getLocalizedMessage());    		    		
	    	} catch(Exception ex) {
	     		view = null; view = new ModelAndView("jsonView");
	    		view.addObject("data", null);
	        	view.addObject("total", 0);
	        	view.addObject("success", false);
	        	view.addObject("message", SystemMsg.getMsg("COM_ERR_0001"));//저장에 실패하였습니다.
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
    @RequestMapping(value="/mng/svc/NecConMngt/deleteNecApmt.do")
    public ModelAndView deleteNecApmt (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");
    	System.out.println(model);
    	try {
    		view = necconmngtService.deleteNecApmt(model);
    	} catch(ServiceException se){
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", se.getLocalizedMessage());
        	view.addObject("error", se.getLocalizedMessage());    	    		
    	} catch(Exception ex) {
     		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg("COM_ERR_0003"));//저장에 실패하였습니다.
        	view.addObject("error", ex.getLocalizedMessage());
    	}
    	
    	return view;    	
    }        
    
    /* FA 연계작업 관리 End */
    
    /* Nec 결과 Log Start */

    /**
	 * Nec 결과 Log 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/NecConMngt/selectNecLogMngtView.do")
    public String selectNecLogMngtView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	
    	return "mng/svc/fcas_nec_log_001";
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/NecConMngt/selectNecLogMngtList.do")
    public ModelAndView selectNecLogMngtPrgsList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return necconmngtService.selectNecLogMngtPrgsList(model);
    }    
    
    /* Nec 결과 Log End */

}
