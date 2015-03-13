package fcas.cus.fad.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Present Condition Chart Service.
 * @description   
 * @version       $Rev: 1.0 $
 */
public interface CondChartService {
	
	ModelAndView selectCondChart(Map<String, Object> model) throws Exception;
}
