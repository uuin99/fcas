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

import fcas.cus.fad.service.CompChartService;
import fcas.sys.com.service.CommonService;

/**
 * @logicalName   Compare Chart Controller.
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class CompChartController {
    @Resource(name = "compchartService")
    private CompChartService compchartService;

    @Resource(name = "commonService")
    private CommonService commonService;

    /**
	 * 현황비교를 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/CompChart/selectCompChartView.do")
    public String selectCompChartView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/fad/fcas_chart_comp_001";
    }

    /**
	 * Present Compition Chart를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/CompChart/selectCompChart.do")
    public ModelAndView selectCompChart(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_chart_comp_001", "A", model);
    	//Chart는 Model의 Key를 검색 조건으로 사용되므로 사용된 내역은 삭제.
    	model.remove("SC_MAP");
    	model.remove("SC_MENU_DIV");
    	model.remove("SC_MENU_CD");
    	/*조회 로그 생성 End*/
    	return compchartService.selectCompChart(model);
    }

    /**
	 * 현황비교를 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/CompChart/selectCompChartViewNew.do")
    public String selectCompChartViewNew(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/fad/fcas_chart_comp_002";
    }


    /**
	 * Present Compition Chart를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/CompChart/selectCompChartNew.do")
    public ModelAndView selectCompChartNew(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_chart_comp_002", "A", model);
    	//Chart는 Model의 Key를 검색 조건으로 사용되므로 사용된 내역은 삭제.
    	model.remove("SC_MAP");
    	model.remove("SC_MENU_DIV");
    	model.remove("SC_MENU_CD");
    	/*조회 로그 생성 End*/
    	return compchartService.selectCompChartNew(model);
    }
}
