package fcas.mng.com.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Program Management Service.
 * @description   
 * @version       $Rev: 1.0 $
 */
public interface ProgMngtService {
	
	ModelAndView selectListPageProgMngt(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateListProgMngt(Map<String, Object> model) throws Exception;
	ModelAndView deleteListProgMngt(Map<String, Object> model) throws Exception;
}
