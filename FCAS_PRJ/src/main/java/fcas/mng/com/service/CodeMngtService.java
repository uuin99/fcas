package fcas.mng.com.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Code Management Service.
 * @description   
 * @version       $Rev: 1.0 $
 */
public interface CodeMngtService {
	
	ModelAndView selectListPageCodeMngt(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateListCodeMngt(Map<String, Object> model) throws Exception;
	ModelAndView deleteListCodeMngt(Map<String, Object> model) throws Exception;
}
