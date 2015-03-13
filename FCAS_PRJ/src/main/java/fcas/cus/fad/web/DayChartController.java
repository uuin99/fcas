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

import fcas.cus.fad.service.DayChartService;
import fcas.sys.com.service.CommonService;

/**
 * @logicalName   Day Chart Controller.
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class DayChartController {
    @Resource(name = "daychartService")
    private DayChartService daychartService;

    @Resource(name = "commonService")
    private CommonService commonService;

    /**
	 * 현황조회 - 일별을 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/DayChart/selectDayChartView.do")
    public String selectDayChartView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/fad/fcas_chart_day_001";
    }

    /**
	 * Day Chart를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/DayChart/selectDayChart.do")
    public ModelAndView selectDayChart(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_chart_day_001", "A", model);
    	//Chart는 Model의 Key를 검색 조건으로 사용되므로 사용된 내역은 삭제.
    	model.remove("SC_MAP");
    	model.remove("SC_MENU_DIV");
    	model.remove("SC_MENU_CD");
    	/*조회 로그 생성 End*/
    	return daychartService.selectDayChart(model);
    }


    /**
	 * 현황조회 - 일별을 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/DayChart/selectDayChartViewNew.do")
    public String selectDayChartViewNew(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/fad/fcas_chart_day_002";
    }
    /**
	 * Day Chart를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/DayChart/selectDayChartNew.do")
    public ModelAndView selectDayChartNew(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_chart_day_002", "A", model);
    	//Chart는 Model의 Key를 검색 조건으로 사용되므로 사용된 내역은 삭제.
    	model.remove("SC_MAP");
    	model.remove("SC_MENU_DIV");
    	model.remove("SC_MENU_CD");
    	/*조회 로그 생성 End*/
    	return daychartService.selectDayChartNew(model);
    }

    /**
	 * 현황조회 - 일별을 호출한다.(고객사권한)
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/DayChart/selectDayChartViewCpa.do")
    public String selectDayChartViewCpa(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/fad/fcas_chart_day_003";
    }
    /**
	 * Day Chart를 조회한다. (고객사권한)
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/DayChart/selectDayChartCpa.do")
    public ModelAndView selectDayChartCpa(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_chart_day_003", "A", model);
    	//Chart는 Model의 Key를 검색 조건으로 사용되므로 사용된 내역은 삭제.
    	model.remove("SC_MAP");
    	model.remove("SC_MENU_DIV");
    	model.remove("SC_MENU_CD");
    	/*조회 로그 생성 End*/
    	return daychartService.selectDayChartCpa(model);
    }
}
