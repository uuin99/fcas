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

import fcas.mng.com.service.SysUseHistService;
import fcas.sys.com.service.CommonService;

/**
 * @logicalName   System Use History Service Controller.
 * @description   
 * @version       $Rev: 1.0 $
 */
@Controller
public class SysUseHistController {
    @Resource(name = "sysusehistService")
    private SysUseHistService sysusehistService;
    
    @Resource(name = "commonService")
    private CommonService commonService;
    
    /**
	 * 시스템 사용 이력 화면을 호출한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return String
	 * @exception 
	 */	
    @RequestMapping(value="/mng/com/SysUseHist/selectHistView.do")
    public String selectMsgMngtView( HttpServletRequest request, HttpServletResponse response , ModelMap model ) throws Exception {
    	return "mng/com/fcas_hist_001";
	}
    
    /**
	 * 시스템 사용 이력을 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/mng/com/SysUseHist/selectHistList.do")
    public ModelAndView selectHistList(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	System.out.println(model);
    	commonService.insertFcaHistSearch("fcas_hist_001", "A", model);
    	return sysusehistService.selectListPageHist(model);
    }
    
}
