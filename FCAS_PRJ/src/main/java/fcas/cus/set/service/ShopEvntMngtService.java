package fcas.cus.set.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;


/**
 * @logicalName   Shop Event Management Service.
 * @description   
 * @version       $Rev: 1.0 $
 */
public interface ShopEvntMngtService {
	
	ModelAndView selectListPageShopEvntMngt(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateListShopEvntMngt(Map<String, Object> model) throws Exception;
	ModelAndView deleteListShopEvntMngt(Map<String, Object> model) throws Exception;
}
