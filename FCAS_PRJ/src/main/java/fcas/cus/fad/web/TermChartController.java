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

import fcas.cus.fad.service.TermChartService;
import fcas.sys.com.service.CommonService;

/**
 * @logicalName   Term Chart Controller.
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class TermChartController {
    @Resource(name = "termchartService")
    private TermChartService termchartService;

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
    @RequestMapping(value="/cus/fad/TermChart/selectTermChartView.do")
    public String selectTermChartView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/fad/fcas_chart_term_001";
    }

    /**
	 * Term Chart를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/TermChart/selectTermChart.do")
    public ModelAndView selectTermChart(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_chart_term_001", "A", model);
    	//Chart는 Model의 Key를 검색 조건으로 사용되므로 사용된 내역은 삭제.
    	model.remove("SC_MAP");
    	model.remove("SC_MENU_DIV");
    	model.remove("SC_MENU_CD");
    	/*조회 로그 생성 End*/
    	return termchartService.selectTermChart(model);
    }


    /**
	 * 현황조회 - 월별을 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/TermChart/selectTermChartViewNew.do")
    public String selectTermChartViewNew(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/fad/fcas_chart_term_002";
    }


    /**
	 * Term Chart를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/TermChart/selectTermChartNew.do")
    public ModelAndView selectTermChartNew(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_chart_term_002", "A", model);
    	//Chart는 Model의 Key를 검색 조건으로 사용되므로 사용된 내역은 삭제.
    	model.remove("SC_MAP");
    	model.remove("SC_MENU_DIV");
    	model.remove("SC_MENU_CD");
    	/*조회 로그 생성 End*/
    	return termchartService.selectTermChartNew(model);
    }

    /**
	 * 현황조회 - 월별(CPA)을 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/TermChart/selectTermChartViewCpa.do")
    public String selectTermChartViewCpa(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/fad/fcas_chart_term_003";
    }

    /**
	 * Term Chart(CPA)를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/TermChart/selectTermChartCpa.do")
    public ModelAndView selectTermChartCpa(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_chart_term_003", "A", model);
    	//Chart는 Model의 Key를 검색 조건으로 사용되므로 사용된 내역은 삭제.
    	model.remove("SC_MAP");
    	model.remove("SC_MENU_DIV");
    	model.remove("SC_MENU_CD");
    	/*조회 로그 생성 End*/
    	return termchartService.selectTermChartCpa(model);
    }

}
