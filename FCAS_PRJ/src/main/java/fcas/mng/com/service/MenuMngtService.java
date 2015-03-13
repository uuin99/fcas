package fcas.mng.com.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Menu Management Service.
 * @description   
 * @version       $Rev: 1.0 $
 */
public interface MenuMngtService {
	
	ModelAndView selectListMenuMngt(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateOrDeleteListMenuMngt(Map<String, Object> model) throws Exception;
	ModelAndView selectListDeleteMenuValidMngt(Map<String, Object> model) throws Exception;
}
