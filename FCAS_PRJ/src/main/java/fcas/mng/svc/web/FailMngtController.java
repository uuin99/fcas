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

import fcas.mng.svc.service.FailMngtService;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   FailMngtController
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class FailMngtController {
    @Resource(name = "failmngtService")
    private FailMngtService failmngtService;

    /**
	 * 장애내역 조회 화면을 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/FailMngt/selectFailInfoView.do")
    public String selectFailInfoView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "mng/svc/fcas_fail_info_001";
    }


    /**
	 * 장애내역 접수 화면을 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/FailMngt/selectFailAcptView.do")
    public String selectFailAcptView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "mng/svc/fcas_fail_acpt_001";
    }

    /**
	 * 장애내역 처리 화면을 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/FailMngt/selectFailFinsView.do")
    public String selectFailFilsView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "mng/svc/fcas_fail_fins_001";
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/FailMngt/selectFailList.do")
    public ModelAndView selectFailList(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	return failmngtService.selectListPageFailMngt(model);
    }

    /**
	 * 페이지가 있는 List를 조회한다. ( 고객사용)
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/FailMngt/selectMyFailList.do")
    public ModelAndView selectMyFailList(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
		model.put("COMP_ID" , loginModel.getCompId());

    	return failmngtService.selectListPageFailMngt(model);
    }


    /**
	 * 단일 Data를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/FailMngt/selectFail.do")
    public ModelAndView selectFail (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return failmngtService.selectFail(model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/com/svc/FailMngt/insertOrUpdateFail.do")
    public ModelAndView insertOrUpdateFail (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = failmngtService.insertOrUpdateFail(model);

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
    @RequestMapping(value="/mng/svc/FailMngt/deleteFail.do")
    public ModelAndView deleteFail(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = failmngtService.deleteFail(model);

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



    /**
	 * 수정을 실행한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/com/svc/FailMngt/updateFailFins.do")
    public ModelAndView updateFailFins (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = failmngtService.updateFailFins(model);

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

}
