package fcas.mng.svc.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   DataCntService
 * @description
 * @version       $Rev: 1.0 $
 */
public interface NecConMngtService {

	ModelAndView selectNecPrgsList(Map<String, Object> model) throws Exception;
	ModelAndView insertNecApmtAddBatch(Map<String, Object> model) throws Exception;

	ModelAndView selectNecApmtMngtList(Map<String, Object> model) throws Exception;
	ModelAndView selectNecApmtMngt(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateNecApmt(Map<String, Object> model) throws Exception;
	ModelAndView deleteNecApmt(Map<String, Object> model) throws Exception;
	
	ModelAndView selectNecLogMngtPrgsList(Map<String, Object> model) throws Exception;
}
