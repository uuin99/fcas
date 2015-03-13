package fcas.mng.com.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Message Management Service.
 * @description   
 * @version       $Rev: 1.0 $
 */
public interface MsgMngtService {
	
	ModelAndView selectListPageMsgMngt(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateListMsgMngt(Map<String, Object> model) throws Exception;
	ModelAndView deleteListMngMngt(Map<String, Object> model) throws Exception;
}
