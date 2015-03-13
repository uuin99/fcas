package fcas.cus.fad.web;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fcas.cus.fad.service.DataClsService;
import fcas.sys.com.service.CommonService;

/**
 * @logicalName   DataCntController
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class DataClsController {
    @Resource(name = "dataClsService")
    private DataClsService dataClsService;

    @Resource(name = "commonService")
    private CommonService commonService;

    /**
	 * 일자별 성별/연령별수 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/DataCls/selectDailyClsView.do")
    public String selectDailyClsView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/fad/fcas_daily_cls_001";
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/DataCls/selectDailyClsList.do")
    public ModelAndView selectDailyClsList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_daily_cls_001", "A", model);
    	/*조회 로그 생성 End*/
    	return dataClsService.selectListDailyCls(model);
    }


    /**
	 * 시간별 성별/연령별수 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/DataCls/selectTimeClsView.do")
    public String selectTimeClsView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/fad/fcas_time_cls_001";
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/DataCls/selectTimeClsList.do")
    public ModelAndView selectTimeClsList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_time_cls_001", "A", model);
    	/*조회 로그 생성 End*/

    	return dataClsService.selectListTimeCls(model);
    }

}
