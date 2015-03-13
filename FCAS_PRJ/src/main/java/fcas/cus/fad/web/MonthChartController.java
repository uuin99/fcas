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

import fcas.cus.fad.service.MonthChartService;
import fcas.sys.com.service.CommonService;

/**
 * @logicalName   Month Chart Controller.
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class MonthChartController {
    @Resource(name = "monthchartService")
    private MonthChartService monthchartService;

    @Resource(name = "commonService")
    private CommonService commonService;

    /**
	 * 현황조회 - 월별을 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/MonthChart/selectMonthChartView.do")
    public String selectMonthChartView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/fad/fcas_chart_month_001";
    }

    /**
	 * Month Chart를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/MonthChart/selectMonthChart.do")
    public ModelAndView selectMonthChart(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_chart_month_001", "A", model);
    	//Chart는 Model의 Key를 검색 조건으로 사용되므로 사용된 내역은 삭제.
    	model.remove("SC_MAP");
    	model.remove("SC_MENU_DIV");
    	model.remove("SC_MENU_CD");
    	/*조회 로그 생성 End*/
    	return monthchartService.selectMonthChart(model);
    }

    /**
	 * 현황조회 - 월별을 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/MonthChart/selectMonthChartViewNew.do")
    public String selectMonthChartViewNew(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/fad/fcas_chart_month_002";
    }


    /**
	 * Month Chart를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/MonthChart/selectMonthChartNew.do")
    public ModelAndView selectMonthChartNew(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_chart_month_002", "A", model);
    	//Chart는 Model의 Key를 검색 조건으로 사용되므로 사용된 내역은 삭제.
    	model.remove("SC_MAP");
    	model.remove("SC_MENU_DIV");
    	model.remove("SC_MENU_CD");
    	/*조회 로그 생성 End*/
    	return monthchartService.selectMonthChartNew(model);
    }


    /**
	 * 현황조회 - 월별(CPA)을 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/MonthChart/selectMonthChartViewCpa.do")
    public String selectMonthChartViewCpa(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/fad/fcas_chart_month_003";
    }


    /**
	 * Month Chart를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/MonthChart/selectMonthChartCpa.do")
    public ModelAndView selectMonthChartCpa(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_chart_month_003", "A", model);
    	//Chart는 Model의 Key를 검색 조건으로 사용되므로 사용된 내역은 삭제.
    	model.remove("SC_MAP");
    	model.remove("SC_MENU_DIV");
    	model.remove("SC_MENU_CD");
    	/*조회 로그 생성 End*/
    	return monthchartService.selectMonthChartCpa(model);
    }
}
