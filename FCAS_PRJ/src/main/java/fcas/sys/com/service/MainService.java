package fcas.sys.com.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   LoginService Service.
 * @description
 * @version       $Rev: 1.0 $
 */
public interface MainService {
	List selectCnctDate(Map<String, Object> model) throws Exception;
	List selectHistInfo(Map<String, Object> model) throws Exception;
	ModelAndView selectReportInfo(Map<String, Object> model) throws Exception;
	
	Map<String, java.util.List<java.util.Map<String, Object>>> selectMyPageInfo(Map<String, Object> model) throws Exception;
	
}
