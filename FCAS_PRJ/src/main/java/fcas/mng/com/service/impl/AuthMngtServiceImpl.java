package fcas.mng.com.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import egovframework.rte.fdl.idgnr.EgovIdGnrService;
import fcas.sys.com.model.LoginModel;
import fcas.mng.com.service.AuthMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   Auth Management Service Impl.
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("authmngtService")
public class AuthMngtServiceImpl extends AbstractServiceImpl implements AuthMngtService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListPageAuthMngt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("authmngt.getAuth", model);
    }

    /**
	 * 페이지가 없는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectAuthList(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("authmngt.getAuthList", model);
    }


    /**
	 * 저장과 수정을 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateListAuthMngt(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();

		List insert_dataList = CommonUtil.getListFromJson(model.get("insertData").toString());
    	if (insert_dataList != null && !insert_dataList.isEmpty()) {
            for (int i=0; i<insert_dataList.size(); i++) {
            	HashMap map = (HashMap) insert_dataList.get(i);
            	map.put("USER_ID", loginModel.getUserId());
            	extCnt += commonDAO.insertData("authmngt.insertAuth", map);
            }
		}

    	List update_dataList = CommonUtil.getListFromJson(model.get("updateData").toString());
		if (update_dataList != null && !update_dataList.isEmpty()) {
            for (int i=0; i<update_dataList.size(); i++) {
            	HashMap map = (HashMap) update_dataList.get(i);
            	map.put("USER_ID", loginModel.getUserId());
            	extCnt += commonDAO.updateData("authmngt.updateAuth", map);
            }
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0001")); //저장을 완료하였습니다.

    	return view;
	}

    /**
	 * 삭제를 실행한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView deleteListAuthMngt(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		List<Map<String, Object>> delete_dataList = CommonUtil.getListFromJson(model.get("deleteData").toString());
    	if (delete_dataList != null && !delete_dataList.isEmpty()) {
            for (Map<String, Object> map : delete_dataList) {
        		String strValid = String.valueOf(commonDAO.selectData("authmngt.getAuthDelValid", map));
        		if (!"Y".equals(strValid)) {
        			throw new ServiceException(strValid);
        		}else {            	
        			extCnt += commonDAO.insertData("authmngt.deleteAuth", map);
        		}
            }
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003")); //삭제를 완료하였습니다.

    	return view;
	}
}
