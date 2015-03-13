package fcas.cus.set.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.cus.set.service.ShopEvntMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   Shop Event Management Service Impl.
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("shopevntmngtService")
public class ShopEvntMngtServiceImpl extends AbstractServiceImpl implements ShopEvntMngtService {

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
    public ModelAndView selectListPageShopEvntMngt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("shopevntmngt.getShopEvnt", model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateListShopEvntMngt(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
		
		/* 이벤트 기간 중복 체크를 위한 변수 */
		HashMap<String, Object> selectMap = new HashMap<String, Object>();
		selectMap.put("COMP_ID", loginModel.getCompId());
		selectMap.put("SHOP_ID", loginModel.getShopId());
		
		List insert_dataList = CommonUtil.getListFromJson(model.get("insertData").toString());
    	if (insert_dataList != null && !insert_dataList.isEmpty()) {
    		for (int i=0; i<insert_dataList.size(); i++) {
            	HashMap map = (HashMap) insert_dataList.get(i);
            	String s_date = map.get("EVNT_STRT_DATE").toString().replaceAll("-", "").substring(0,8);
            	String e_date = map.get("EVNT_END_DATE").toString().replaceAll("-", "").substring(0,8);
            	if (chkDupEvntDate(selectMap, "", s_date, e_date)) {
            		String evntNo = commonService.getSequenceValue("EVNT_NO", 10, "PE-YYYYMM");
                	map.put("EVNT_NO", evntNo);
                	map.put("USER_ID", loginModel.getUserId());
                	extCnt += commonDAO.insertData("shopevntmngt.insertShopEvnt", map);
            	} else {
            		throw new ServiceException(SystemMsg.getMsg("COM_ERR_0060")); //이벤트 기간이 중복되었습니다.
            	}
            }
		}
    	
    	List update_dataList = CommonUtil.getListFromJson(model.get("updateData").toString());
		if (update_dataList != null && !update_dataList.isEmpty()) {
			for (int i=0; i<update_dataList.size(); i++) {
            	HashMap map = (HashMap) update_dataList.get(i);
            	String s_date = map.get("EVNT_STRT_DATE").toString().replaceAll("-", "").substring(0,8);
            	String e_date = map.get("EVNT_END_DATE").toString().replaceAll("-", "").substring(0,8);
            	if (chkDupEvntDate(selectMap, map.get("EVNT_NO").toString(), s_date, e_date)) {
            		map.put("USER_ID", loginModel.getUserId());
                	extCnt += commonDAO.updateData("shopevntmngt.updateShopEvnt", map);
            	} else {
            		throw new ServiceException(SystemMsg.getMsg("COM_ERR_0060")); //이벤트 기간이 중복되었습니다.
            	}
            }
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0001")); //저장을 완료하였습니다.

    	return view;
	}
    
    /**
	 * 이벤트 시작일자와 종료일자 중복을 체크한다.
	 * @param selectMap, s_date, e_date
	 * @return boolean
	 * @exception
	 */
    private boolean chkDupEvntDate(HashMap<String, Object> selectMap, String evnt_no, String s_date, String e_date){
    	try {
    		Integer chkCount = 0;
    		selectMap.put("CHK_EVNT_NO", evnt_no);
    		selectMap.put("CHK_DATE_START", s_date);
    		selectMap.put("CHK_DATE_END", e_date);
    		chkCount = (Integer) commonDAO.selectData("shopevntmngt.getShopEvntCount", selectMap);
    		if (chkCount > 0) {
    			return false;
    		}
    	} catch(Exception e) {
    		return false;
    	}
    	
    	return true;
    }

    /**
	 * 삭제를 실행한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView deleteListShopEvntMngt(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		List delete_dataList = CommonUtil.getListFromJson(model.get("deleteData").toString());
    	if (delete_dataList != null && !delete_dataList.isEmpty()) {
            for (int i=0; i<delete_dataList.size(); i++) {
            	HashMap map = (HashMap) delete_dataList.get(i);
            	extCnt += commonDAO.insertData("shopevntmngt.deleteShopEvnt", map);
            }
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003")); //삭제를 완료하였습니다.

    	return view;
	}
}
