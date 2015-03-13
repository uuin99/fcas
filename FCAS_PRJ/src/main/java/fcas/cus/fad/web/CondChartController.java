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

import fcas.cus.fad.service.CondChartService;

/**
 * @logicalName   Present Condition Chart Controller.
 * @description   
 * @version       $Rev: 1.0 $
 */
@Controller
public class CondChartController {
    @Resource(name = "condchartService")
    private CondChartService condchartService;
    
    /**
	 * 현황비교를 호출한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/CondChart/selectCondChartView.do")
    public String selectCondChartView(HttpServletRequest request,
    		HttpServletResponse response, 
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/fad/fcas_chart_cond_001";
    }
    
    /**
	 * Present Condition Chart를 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/cus/fad/CondChart/selectCondChart.do")
    public ModelAndView selectCondChart(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	return condchartService.selectCondChart(model);
    }
}
