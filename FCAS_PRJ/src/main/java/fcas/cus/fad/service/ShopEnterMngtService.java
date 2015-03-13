package fcas.cus.fad.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Shop Enter Management Service.
 * @description
 * @version       $Rev: 1.0 $
 */
public interface ShopEnterMngtService {

	ModelAndView selectListTimeCd(Map<String, Object> model) throws Exception;
	ModelAndView selectListShopEnter(Map<String, Object> model) throws Exception;
}
