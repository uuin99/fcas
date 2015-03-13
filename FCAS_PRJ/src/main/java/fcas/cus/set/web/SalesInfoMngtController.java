package fcas.cus.set.web;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fcas.cus.set.service.SalesInfoMngtService;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   Sales Info Management Controller.
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class SalesInfoMngtController {
    @Resource(name = "salesinfomngtService")
    private SalesInfoMngtService salesinfomngtService;

    /**
	 * 공통코드 관리 화면을 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/set/SalesInfoMngt/selectSalesInfoMngtView.do")
    public String selectSalesInfoMngtView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/set/fcas_sales_info_001";
    }

    /**
	 * List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/set/SalesInfoMngt/selectSalesInfoMngt.do")
    public ModelAndView selectSalesInfoMngt(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
		model.put("COMP_ID" , loginModel.getCompId());

    	return salesinfomngtService.selectListSalesInfoMngt(model);
    }

    /**
	 * List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/set/SalesInfoMngt/selectSalesInfoDetlMngt.do")
    public ModelAndView selectSalesInfoDetlMngt(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return salesinfomngtService.selectListSalesInfoDetlMngt(model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/set/SalesInfoMngt/insertOrUpdateSalesInfoMngt.do")
    public ModelAndView insertOrUpdateSalesInfoMngt(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = salesinfomngtService.insertOrUpdateListSalesInfoMngt(model);
    	} catch(ServiceException se) {
    		se.printStackTrace();
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", se.getMessage() );
        	view.addObject("error", se.getLocalizedMessage());
    	} catch(Exception ex) {
    		ex.printStackTrace();
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
    @RequestMapping(value="/cus/set/SalesInfoMngt/deleteSalesInfoDetlAll.do")
    public ModelAndView deleteUser(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = salesinfomngtService.deleteSalesInfoDetlAll(model);

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
