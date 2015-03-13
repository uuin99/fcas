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

import fcas.mng.svc.service.OlnClsMngtService;
import fcas.sys.com.servlet.SystemMsg;

/**
 * @logicalName   OlnClsMngtController
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class OlnClsMngtController {
    @Resource(name = "olnclsMngtService")
    private OlnClsMngtService olnclsMngtService;

    /** 온라인문의 화면 Start **/
    
    /**
	 * 온라인문의 화면 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/OlnClsMngt/selectOlnClsInqView.do")
    public String selectOlnClsInqView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "mng/svc/fcas_oln_cls_001";
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/OlnClsMngt/selectOlnClsInqList.do")
    public ModelAndView selectOlnClsInqList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return olnclsMngtService.selectOlnClsList(model);
    }

    /**
	 * 단일 Data를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/OlnClsMngt/selectOlnClsInq.do")
    public ModelAndView selectOlnClsInq (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return olnclsMngtService.selectOlnCls(model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/OlnClsMngt/insertOrUpdateOlnClsInq.do")
    public ModelAndView insertOrUpdateOlnClsInq (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");
    	System.out.println(model);
    	try {
    		view = olnclsMngtService.insertOrUpdateOlnCls(model);

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
    @RequestMapping(value="/mng/svc/OlnClsMngt/deleteOlnClsInq.do")
    public ModelAndView deleteOlnClsInq(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = olnclsMngtService.deleteOlnClsInq(model);
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

    /** 온라인문의 화면 End **/    
    
    /** 고객문의 답변처리 화면 Start **/
    
    /**
	 * 온라인문의 화면 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/OlnClsMngt/selectOlnClsRepView.do")
    public String selectOlnClsRepView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "mng/svc/fcas_oln_cls_002";
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/OlnClsMngt/selectOlnClsRepList.do")
    public ModelAndView selectOlnClsRepList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return olnclsMngtService.selectOlnClsList(model);
    }

    /**
	 * 단일 Data를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/OlnClsMngt/selectOlnClsRep.do")
    public ModelAndView selectOlnClsRep (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return olnclsMngtService.selectOlnCls(model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/OlnClsMngt/updateOlnClsRep.do")
    public ModelAndView insertOrUpdateOlnClsRep (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");
    	System.out.println(model);
    	try {
    		view = olnclsMngtService.updateOlnClsRep(model);

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

    @RequestMapping(value="/mng/svc/OlnClsMngt/deleteOlnClsRep.do")
    public ModelAndView deleteOlnClsRep(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = olnclsMngtService.deleteOlnClsRep(model);
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
	/    
    
    /** 고객문의 답변처리 화면 End **/
    
}
