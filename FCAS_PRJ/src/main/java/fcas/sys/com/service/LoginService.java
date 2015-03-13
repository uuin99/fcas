package fcas.sys.com.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   LoginService Service.
 * @description
 * @version       $Rev: 1.0 $
 */
public interface LoginService {

	public Map selectUserCheck(Map<String, Object> model) throws Exception;
	public Map selectSessionDb(Map<String, Object> model) throws Exception;
	public int selectSessionDbCount(Map<String, Object> model) throws Exception;
	public Map selectSessionDbInfo(Map<String, Object> model) throws Exception;
	public void insertSessionDb(Map<String, Object> model) throws Exception;
	public void deleteSessionDb(Map<String, Object> model) throws Exception;
	ModelAndView selectMainMenu(Map<String, Object> model) throws Exception;
	ModelAndView selectNoticeData(Map<String, Object> model) throws Exception;
}
