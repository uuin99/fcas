package fcas.mng.com.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import egovframework.rte.fdl.idgnr.EgovIdGnrService;
import fcas.sys.com.model.LoginModel;
import fcas.mng.com.service.MsgMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   Message Management Service Impl.
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("msgmngtService")
public class MsgMngtServiceImpl extends AbstractServiceImpl implements MsgMngtService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /**
	 * 메시지코드를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListPageMsgMngt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("msgmngt.getMsg", model);
    }

    /**
	 * 메시지 코드 저장과 수정을 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateListMsgMngt(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;
		int inCnt = 0;
		int upCnt = 0;
		List<Map<String, Object>> editList = new ArrayList<Map<String, Object>>();

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();

		//DB Insert
		List<Map<String, Object>> insert_dataList = CommonUtil.getListFromJson(model.get("insertData").toString());
    	if (insert_dataList != null && !insert_dataList.isEmpty()) {
            for (Map<String, Object> map : insert_dataList) {
            	//Message Code는 반드시 대문자만 가능하다.
            	String oriCd = map.get("CD").toString();
            	map.put("CD", oriCd.toUpperCase());
            	map.put("USER_ID", loginModel.getUserId());
            	extCnt += commonDAO.insertData("msgmngt.insertMsg", map);
            	inCnt ++;
            	editList.add(map);
            }
		}

		//DB Update
    	List<Map<String, Object>> update_dataList = CommonUtil.getListFromJson(model.get("updateData").toString());
		if (update_dataList != null && !update_dataList.isEmpty()) {
            for (Map<String, Object> map : update_dataList) {
            	map.put("USER_ID", loginModel.getUserId());
            	extCnt += commonDAO.updateData("msgmngt.updateMsg", map);
            	upCnt ++;
            	editList.add(map);
            }
		}

		//Memory Insert Or Update
		for(Map<String, Object> editMap : editList){
			SystemMsg.setMsg(editMap.get("CD").toString(), editMap.get("CD_DESC").toString());
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("inCnt", inCnt);
    	view.addObject("upCnt", upCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0001"));

    	return view;
	}

    /**
	 * 메시지 코드 삭제를 실행한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView deleteListMngMngt(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;
		List<Map<String, Object>> editList = new ArrayList<Map<String, Object>>();

		//DB Delete
		List delete_dataList = CommonUtil.getListFromJson(model.get("deleteData").toString());
    	if (delete_dataList != null && !delete_dataList.isEmpty()) {
            for (int i=0; i<delete_dataList.size(); i++) {
            	HashMap map = (HashMap) delete_dataList.get(i);
            	extCnt += commonDAO.insertData("msgmngt.deleteMsg", map);
            	editList.add(map);
            }
		}

    	//Momory Remove
		for(Map<String, Object> editMap : editList){
			SystemMsg.removeMsg(editMap.get("CD").toString());
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003"));
    	return view;
	}

}
