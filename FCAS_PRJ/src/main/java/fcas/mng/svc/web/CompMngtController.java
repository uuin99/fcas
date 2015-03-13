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

import fcas.mng.svc.service.CompMngtService;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.servlet.SystemMsg;

/**
 * @logicalName   CompMngtController
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class CompMngtController {
    @Resource(name = "compMngtService")
    private CompMngtService compMngtService;

    /**
	 * 고객사 관리 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/CompMngt/selectCompMngtView.do")
    public String selectCompMngtView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "mng/svc/fcas_comp_001";
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/CompMngt/selectCompList.do")
    public ModelAndView selectCompList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return compMngtService.selectListPageCompMngt(model);
    }

    /**
	 * 단일 Data를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/CompMngt/selectComp.do")
    public ModelAndView selectComp (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return compMngtService.selectComp(model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/CompMngt/insertOrUpdateComp.do")
    public ModelAndView insertOrUpdateShop (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");
    	System.out.println(model);
    	try {
    		view = compMngtService.insertOrUpdateListComp(model);
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
    @RequestMapping(value="/mng/svc/CompMngt/deleteComp.do")
    public ModelAndView deleteComp(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = compMngtService.deleteListComp(model);
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
    /**
	 * 정의된 값의 중복여부를 Checking 함.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */   
    @RequestMapping(value="/mng/svc/CompMngt/selectDistinctValue.do")
    public ModelAndView selectDistinctValue (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return compMngtService.selectDistinctValue(model);
    }    
    
    /**업체명 Combo 정의 Start**/
    /**
	 * 일반적인 업체명 Combo.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */   
    @RequestMapping(value="/mng/svc/CompMngt/selectCompCombo.do")
    public ModelAndView selectCompCombo (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	return compMngtService.selectCompCombo(model);
    }    
    /**업체명 Combo 정의 End**/    
}
