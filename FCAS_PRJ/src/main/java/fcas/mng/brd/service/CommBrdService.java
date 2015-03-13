package fcas.mng.brd.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Message Management Service.
 * @description   
 * @version       $Rev: 1.0 $
 */
public interface CommBrdService {
	
	ModelAndView selectListPageCommBrd(Map<String, Object> model) throws Exception;
	ModelAndView selectCommBrd(Map<String, Object> model, HttpServletRequest request) throws Exception;
	
	ModelAndView insertOrUpdateCommBrd(Map<String, Object> model, HttpServletRequest request) throws Exception;
	ModelAndView deleteCommBrd(Map<String, Object> model) throws Exception;
	ModelAndView deleteCommBrdList(Map<String, Object> model) throws Exception;	
	ModelAndView updateUpReadCnt(Map<String, Object> model) throws Exception;
	String getValidPublicBrdFileDownload(Map<String, Object> model) throws Exception;
	ModelAndView publicBrdSearchCountUp(Map<String, Object> model) throws Exception;
}
