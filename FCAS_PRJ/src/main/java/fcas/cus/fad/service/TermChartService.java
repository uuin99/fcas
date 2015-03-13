package fcas.cus.fad.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Term Chart Service.
 * @description
 * @version       $Rev: 1.0 $
 */
public interface TermChartService {

	ModelAndView selectTermChart(Map<String, Object> model) throws Exception;
	ModelAndView selectTermChartNew(Map<String, Object> model) throws Exception;
	ModelAndView selectTermChartCpa(Map<String, Object> model) throws Exception;
}
