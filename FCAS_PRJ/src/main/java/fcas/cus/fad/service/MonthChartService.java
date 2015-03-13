package fcas.cus.fad.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Month Chart Service.
 * @description
 * @version       $Rev: 1.0 $
 */
public interface MonthChartService {

	ModelAndView selectMonthChart(Map<String, Object> model) throws Exception;
	ModelAndView selectMonthChartNew(Map<String, Object> model) throws Exception;
	ModelAndView selectMonthChartCpa(Map<String, Object> model) throws Exception;
}
