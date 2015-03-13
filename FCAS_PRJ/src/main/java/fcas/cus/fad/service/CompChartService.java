package fcas.cus.fad.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Compare Chart Service.
 * @description
 * @version       $Rev: 1.0 $
 */
public interface CompChartService {

	ModelAndView selectCompChart(Map<String, Object> model) throws Exception;
	ModelAndView selectCompChartNew(Map<String, Object> model) throws Exception;
}
