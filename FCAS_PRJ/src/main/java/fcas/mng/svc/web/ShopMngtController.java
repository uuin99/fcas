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

import fcas.mng.svc.service.ShopMngtService;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   ShopMngtController
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class ShopMngtController {
    @Resource(name = "shopMngtService")
    private ShopMngtService shopMngtService;

    /**
	 * 매장 관리 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/ShopMngt/selectShopMngtView.do")
    public String selectShopMngtView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	return "mng/svc/fcas_shop_001";
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/ShopMngt/selectShopList.do")
    public ModelAndView selectShopList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	return shopMngtService.selectListPageShopMngt(model);
    }

    /**
	 * 단일 Data를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/ShopMngt/selectShop.do")
    public ModelAndView selectShop (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	return shopMngtService.selectShop(model);
    }


    /**
	 * 저장과 수정을 실행한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/ShopMngt/insertOrUpdateShop.do")
    public ModelAndView insertOrUpdateShop (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = shopMngtService.insertOrUpdateListShop(model);
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
    @RequestMapping(value="/mng/svc/ShopMngt/deleteShop.do")
    public ModelAndView deleteShop(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = shopMngtService.deleteListShop(model);
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
	 * 매장 관리 화면을 요청한다. (고객사용)
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/ShopMngt/selectMyShopMngtView.do")
    public String selectMyShopMngtView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	return "mng/svc/fcas_my_shop_001";
    }

    /**
	 * 페이지가 있는 List를 조회한다. (고객사용)
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/ShopMngt/selectMyShopList.do")
    public ModelAndView selectMyShopList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
		model.put("COMP_ID" , loginModel.getCompId());

		return shopMngtService.selectListPageShopMngt(model);

    }
}
