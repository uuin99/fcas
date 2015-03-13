package fcas.cus.set.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Sales Info Management Service.
 * @description
 * @version       $Rev: 1.0 $
 */
public interface SalesInfoMngtService {

	ModelAndView selectListSalesInfoMngt(Map<String, Object> model) throws Exception;
	ModelAndView selectListSalesInfoDetlMngt(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateListSalesInfoMngt(Map<String, Object> model) throws Exception;
	ModelAndView deleteSalesInfoDetlAll(Map<String, Object> model) throws Exception;
}
