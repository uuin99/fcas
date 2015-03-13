package fcas.mng.svc.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.sys.com.model.LoginModel;
import fcas.mng.svc.service.EqipMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @logicalName   CEqipMngtServiceImpl
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("eqipMngtService")
public class EqipMngtServiceImpl extends AbstractServiceImpl implements EqipMngtService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    @Resource(name = "commonService")
    private CommonService commonService;

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListPageEqipMngt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("eqipmngt.getEqipList", model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateListEqip(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();

		List insert_dataList = CommonUtil.getListFromJson(model.get("insertData").toString());
    	if (insert_dataList != null && !insert_dataList.isEmpty()) {

            for (int i=0; i<insert_dataList.size(); i++) {

            	HashMap map = (HashMap) insert_dataList.get(i);

            	if(map.get("COMP_ID") == null || map.get("COMP_ID").toString().equals("") ) {
            		throw new ServiceException( SystemMsg.getMsg("COM_ERR_0014").replace("param1", "고객사") );
            	}else if(map.get("SHOP_ID") == null || map.get("SHOP_ID").toString().equals("") ) {
            		throw new ServiceException( SystemMsg.getMsg("COM_ERR_0014").replace("param1", "매장") );
            	}else if(map.get("CMRA_GRP_ID") == null || map.get("CMRA_GRP_ID").toString().equals("") ) {
            		throw new ServiceException( SystemMsg.getMsg("COM_ERR_0014").replace("param1", "카메라그룹") );
            	}

            	map.put("CMRA_NO", commonService.getSequenceValue("CMRA_NO", 7 , "PE-ETC" , "CR") );

            	map.put("USER_ID", loginModel.getUserId());

        		extCnt += commonDAO.insertData("eqipmngt.insertEqip", map);

            }
		}

    	List update_dataList = CommonUtil.getListFromJson(model.get("updateData").toString());
		if (update_dataList != null && !update_dataList.isEmpty()) {
            for (int i=0; i<update_dataList.size(); i++) {
            	HashMap map = (HashMap) update_dataList.get(i);

            	if(map.get("COMP_ID") == null || map.get("COMP_ID").toString().equals("") ) {
            		throw new ServiceException( SystemMsg.getMsg("COM_ERR_0014").replace("param1", "고객사") );
            	}else if(map.get("SHOP_ID") == null || map.get("SHOP_ID").toString().equals("") ) {
            		throw new ServiceException( SystemMsg.getMsg("COM_ERR_0014").replace("param1", "매장") );
            	}else if(map.get("CMRA_GRP_ID") == null || map.get("CMRA_GRP_ID").toString().equals("") ) {
            		throw new ServiceException( SystemMsg.getMsg("COM_ERR_0014").replace("param1", "카메라그룹") );
            	}

            	map.put("USER_ID", loginModel.getUserId());

            	extCnt += commonDAO.updateData("eqipmngt.updateEqip", map);
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
    public ModelAndView deleteListEqip(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		List delete_dataList = CommonUtil.getListFromJson(model.get("deleteData").toString());
    	if (delete_dataList != null && !delete_dataList.isEmpty()) {
            for (int i=0; i<delete_dataList.size(); i++) {
            	HashMap map = (HashMap) delete_dataList.get(i);
            	extCnt += commonDAO.deleteData("eqipmngt.deleteEqip", map);
            }
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003")); //삭제를 완료하였습니다.

    	return view;
	}
}
