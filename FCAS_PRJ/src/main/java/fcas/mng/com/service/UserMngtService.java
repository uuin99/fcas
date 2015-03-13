package fcas.mng.com.service;

import java.util.Map;
import java.util.List;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   User Management Service.
 * @description
 * @version       $Rev: 1.0 $
 */
public interface UserMngtService {

	ModelAndView selectListPageUserMngt(Map<String, Object> model) throws Exception;
	ModelAndView selectUser(Map<String, Object> model) throws Exception;
	ModelAndView insertOrUpdateUser(Map<String, Object> model) throws Exception;
	ModelAndView updateUserMyinfo(Map<String, Object> model) throws Exception;
	ModelAndView deleteUser(Map<String, Object> model) throws Exception;
	public ModelAndView selectCheckLoginId(Map<String, Object> model) throws Exception;

    /***********Combo 정의 영역 Start*******************/
	public ModelAndView selectSalesMnge(Map<String, Object> model) throws Exception;
    /***********Combo 정의 영역 End*******************/

	//test
	public List selectUserList(Map<String, Object> model) throws Exception;
	public List selectUserList2(Map<String, Object> model) throws Exception;
}
