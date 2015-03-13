package fcas.mng.svc.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   ShopMngtService
 * @description
 * @version       $Rev: 1.0 $
 */
public interface SmsInfoMngtService {

	ModelAndView insertSendSms(Map<String, Object> model) throws Exception;
	ModelAndView selectSmsMngtList(Map<String, Object> model) throws Exception;
	ModelAndView selectUserInfoList(Map<String, Object> model) throws Exception;
	HashMap<String, Object> selectSmsLoginInfo(Map<String, Object> model) throws Exception;
}
