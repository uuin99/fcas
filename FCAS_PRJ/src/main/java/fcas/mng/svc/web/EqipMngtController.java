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

import fcas.mng.svc.service.EqipMngtService;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;

/**
 * @logicalName   EqipMngtController
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class EqipMngtController {
    @Resource(name = "eqipMngtService")
    private EqipMngtService eqipMngtService;

    /**
	 * 카메라 관리 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/EqipMngt/selectEqipMngtView.do")
    public String selectEqipMngtView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "mng/svc/fcas_eqip_001";
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/EqipMngt/selectEqipList.do")
    public ModelAndView selectEqipList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return eqipMngtService.selectListPageEqipMngt(model);
    }


    /**
	 * 저장과 수정을 실행한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/EqipMngt/insertOrUpdateEqip.do")
    public ModelAndView insertOrUpdateEqip (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {


    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = eqipMngtService.insertOrUpdateListEqip(model);

    	} catch(ServiceException se) {
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", se.getMessage() );
        	view.addObject("error", se.getLocalizedMessage());
    	}  catch(Exception ex) {
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
    @RequestMapping(value="/mng/svc/EqipMngt/deleteEqip.do")
    public ModelAndView deleteEqip(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = eqipMngtService.deleteListEqip(model);

    	} catch(Exception ex) {
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg(CommonUtil.getExpToMsg(ex,"COM_ERR_0003")));//삭제에 실패하였습니다.
        	view.addObject("error", ex.getLocalizedMessage());
    	}

    	return view;
    }
}
