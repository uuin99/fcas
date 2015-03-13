package fcas.mng.svc.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Contract Management Service.
 * @description
 * @version       $Rev: 1.0 $
 */
public interface CnctMngtService {
	ModelAndView selectCnctMngtList(Map<String, Object> model) throws Exception;
	ModelAndView selectCnctMngt(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateCnct(Map<String, Object> model) throws Exception;
	ModelAndView deleteCnct(Map<String, Object> model) throws Exception;
}
