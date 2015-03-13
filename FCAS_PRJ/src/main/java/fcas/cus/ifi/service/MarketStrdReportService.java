package fcas.cus.ifi.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   MarketStrdReportService
 * @description
 * @version       $Rev: 1.0 $
 */
public interface MarketStrdReportService {

	ModelAndView selectDailyCntList(Map<String, Object> model) throws Exception;
	public ModelAndView selectShopInfo(Map<String, Object> model) throws Exception;
}
