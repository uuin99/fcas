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

import fcas.mng.svc.service.AddrMngtService;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.servlet.SystemMsg;

/**
 * @logicalName   AddrMngtController
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class AddrMngtController {
    @Resource(name = "addrMngtService")
    private AddrMngtService addrMngtService;

    /**
	 * 주소 관리 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/AddrMngt/selectAddrMngtView.do")
    public String selectAddrMngtView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "mng/svc/fcas_addr_001";
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/AddrMngt/selectAddrList.do")
    public ModelAndView selectAddrList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return addrMngtService.selectListPageAddrMngt(model);
    }


    /**
	 * 저장과 수정을 실행한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/AddrMngt/insertOrUpdateAddr.do")
    public ModelAndView insertOrUpdateAddr (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {


    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = addrMngtService.insertOrUpdateListAddr(model);

    	} catch(ServiceException se) {
     		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", se.getMessage() );// "다건 저장시 중복된 KEY가 존재합니다."
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
    @RequestMapping(value="/mng/svc/AddrMngt/deleteAddr.do")
    public ModelAndView deleteAddr(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = addrMngtService.deleteListAddr(model);

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
	 * 주소조회 Popup에서 페이지가 있는 List를 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/AddrMngt/selectAddrConvPopupList.do")
    public ModelAndView selectAddrConvPopupList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return addrMngtService.selectListPageAddrConvPopup(model);
    }   
    
    /**
	 * Kwth 주소조회 Popup에서 페이지가 있는 List를 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/svc/AddrMngt/selectKwthAddrPopupList.do")
    public ModelAndView selectKwthAddrPopupList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return addrMngtService.selectListPageKwthAddrPopup(model);
    }    
    
}
