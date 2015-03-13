package fcas.mng.svc.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   ShopMngtService
 * @description
 * @version       $Rev: 1.0 $
 */
public interface ShopMngtService {

	ModelAndView selectListPageShopMngt(Map<String, Object> model) throws Exception;
	ModelAndView selectShop(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateListShop(Map<String, Object> model) throws Exception;
	ModelAndView deleteListShop(Map<String, Object> model) throws Exception;
}
