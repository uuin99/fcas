package fcas.mng.svc.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   EqipGrpMngtService
 * @description
 * @version       $Rev: 1.0 $
 */
public interface EqipGrpMngtService {

	ModelAndView selectListPageEqipGrpMngt(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateListEqipGrp(Map<String, Object> model) throws Exception;
	ModelAndView deleteListEqipGrp(Map<String, Object> model) throws Exception;
}
