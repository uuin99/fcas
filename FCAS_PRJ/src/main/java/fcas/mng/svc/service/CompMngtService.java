package fcas.mng.svc.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   CompMngtService
 * @description
 * @version       $Rev: 1.0 $
 */
public interface CompMngtService {

	ModelAndView selectListPageCompMngt(Map<String, Object> model) throws Exception;
	ModelAndView selectComp(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateListComp(Map<String, Object> model) throws Exception;
	ModelAndView deleteListComp(Map<String, Object> model) throws Exception;
	ModelAndView selectDistinctValue(Map<String, Object> model) throws Exception;
	
	/**업체명 Combo 정의 Start**/
	ModelAndView selectCompCombo(Map<String, Object> model) throws Exception;
	/**업체명 Combo 정의 End**/
}
