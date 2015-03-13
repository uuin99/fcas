package fcas.mng.com.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Auth Management Service.
 * @description
 * @version       $Rev: 1.0 $
 */
public interface AuthMngtService {

	ModelAndView selectListPageAuthMngt(Map<String, Object> model) throws Exception;
	ModelAndView selectAuthList(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateListAuthMngt(Map<String, Object> model) throws Exception;
	ModelAndView deleteListAuthMngt(Map<String, Object> model) throws Exception;
}
