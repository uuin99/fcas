package fcas.mng.com.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Message Management Service.
 * @description   
 * @version       $Rev: 1.0 $
 */
public interface SysUseHistService {
	
	ModelAndView selectListPageHist(Map<String, Object> model) throws Exception;
	
}
