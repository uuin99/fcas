package fcas.cus.fad.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Year Chart Service.
 * @description
 * @version       $Rev: 1.0 $
 */
public interface YearChartService {

	ModelAndView selectYearChart(Map<String, Object> model) throws Exception;
	ModelAndView selectYearChartNew(Map<String, Object> model) throws Exception;
	ModelAndView selectYearChartCpa(Map<String, Object> model) throws Exception;
}
