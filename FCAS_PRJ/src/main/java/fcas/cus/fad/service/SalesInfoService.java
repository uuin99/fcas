package fcas.cus.fad.service;

import java.util.Map;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   SaleInfoService
 * @description
 * @version       $Rev: 1.0 $
 */
public interface SalesInfoService {

	List selectTimeChart(Map<String, Object> model) throws Exception;
	List selectDayChart(Map<String, Object> model) throws Exception;
	List selectDovChart(Map<String, Object> model) throws Exception;
	List selectMonthChart(Map<String, Object> model) throws Exception;
	List selectTermChart(Map<String, Object> model) throws Exception;
	List selectMonthResult(Map<String, Object> model) throws Exception;
	List selectEvntResult(Map<String, Object> model) throws Exception;
}
