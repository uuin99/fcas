package fcas.mng.svc.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   AddrMngtService
 * @description
 * @version       $Rev: 1.0 $
 */
public interface AddrMngtService {

	ModelAndView selectListPageAddrMngt(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateListAddr(Map<String, Object> model) throws Exception;
	ModelAndView deleteListAddr(Map<String, Object> model) throws Exception;
	ModelAndView selectListPageAddrConvPopup(Map<String, Object> model) throws Exception;
	ModelAndView selectListPageKwthAddrPopup(Map<String, Object> model) throws Exception;	
	
}
