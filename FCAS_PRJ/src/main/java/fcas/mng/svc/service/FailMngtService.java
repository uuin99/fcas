package fcas.mng.svc.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   FailMngtService Service.
 * @description
 * @version       $Rev: 1.0 $
 */
public interface FailMngtService {

	ModelAndView selectListPageFailMngt(Map<String, Object> model) throws Exception;
	ModelAndView selectFail(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateFail(Map<String, Object> model) throws Exception;
	ModelAndView updateFailFins(Map<String, Object> model) throws Exception;
	ModelAndView deleteFail(Map<String, Object> model) throws Exception;

}
