package fcas.cus.fad.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   DataCntService
 * @description
 * @version       $Rev: 1.0 $
 */
public interface DataCntService {

	ModelAndView selectDailyCntList(Map<String, Object> model) throws Exception;
	ModelAndView selectTimeCntList(Map<String, Object> model) throws Exception;
}
