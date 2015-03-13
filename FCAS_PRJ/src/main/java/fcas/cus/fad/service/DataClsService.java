package fcas.cus.fad.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   DataCntService
 * @description
 * @version       $Rev: 1.0 $
 */
public interface DataClsService {

	ModelAndView selectListDailyCls(Map<String, Object> model) throws Exception;
	ModelAndView selectListTimeCls(Map<String, Object> model) throws Exception;
}
