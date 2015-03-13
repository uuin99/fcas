package fcas.cus.fad.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Day Chart Service.
 * @description
 * @version       $Rev: 1.0 $
 */
public interface DayChartService {

	ModelAndView selectDayChart(Map<String, Object> model) throws Exception;
	ModelAndView selectDayChartNew(Map<String, Object> model) throws Exception;
	ModelAndView selectDayChartCpa(Map<String, Object> model) throws Exception;
}
