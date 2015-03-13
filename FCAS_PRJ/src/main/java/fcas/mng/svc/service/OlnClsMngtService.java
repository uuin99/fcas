package fcas.mng.svc.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   ShopMngtService
 * @description
 * @version       $Rev: 1.0 $
 */
public interface OlnClsMngtService {

	ModelAndView selectOlnClsList(Map<String, Object> model) throws Exception;
	ModelAndView selectOlnCls(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateOlnCls(Map<String, Object> model) throws Exception;
	ModelAndView deleteOlnClsInq(Map<String, Object> model) throws Exception;
	
	ModelAndView updateOlnClsRep(Map<String, Object> model) throws Exception;
}
