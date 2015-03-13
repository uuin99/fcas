package fcas.mng.com.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Auth Menu Management Service.
 * @description   
 * @version       $Rev: 1.0 $
 */
public interface AuthMenuMngtService {
	
	ModelAndView selectListAuthMenuMngt(Map<String, Object> model) throws Exception;
	ModelAndView deleteOrInsertListAuthMenuMngt(Map<String, Object> model) throws Exception;
}
