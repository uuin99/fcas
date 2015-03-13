package fcas.mng.svc.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   EqipMngtService
 * @description
 * @version       $Rev: 1.0 $
 */
public interface EqipMngtService {

	ModelAndView selectListPageEqipMngt(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateListEqip(Map<String, Object> model) throws Exception;
	ModelAndView deleteListEqip(Map<String, Object> model) throws Exception;
}
