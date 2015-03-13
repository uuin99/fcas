package fcas.mng.svc.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.mng.svc.service.NecConMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   DataCntServiceImpl
 * @version       $Rev: 1.0 $
 */
@Service("necconmngtService")
public class NecConMngtServiceImpl extends AbstractServiceImpl implements NecConMngtService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectNecPrgsList(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("necconmngt.selectNecPrgsList", model);
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectNecApmtMngtList(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("necconmngt.selectNecApmtMngtList", model);
    }

    /**
	 * 예약 스케쥴 등록을 실행한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertNecApmtAddBatch(Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");
    	Integer extCnt = 0;
		String strValid = "";
    	List<Map<String, Object>> update_dataList = CommonUtil.getListFromJson(model.get("updateData").toString());
		if (update_dataList != null && !update_dataList.isEmpty()) {
            for (Map<String, Object> map : update_dataList) {
            	if (("true").equals(map.get("CHK").toString())) {
                	strValid = (String)commonDAO.selectData("necconmngt.selectNecApmtValid", map);
                	if (strValid.startsWith("COM_ERR")) {
                		throw new ServiceException(SystemMsg.getMsg(strValid));
                	}else {
                		extCnt += commonDAO.insertData("necconmngt.insertNecApmt", map);
                	}
            	}
            }
		}

		if(extCnt == 0){
			throw new ServiceException(SystemMsg.getMsg("COM_ERR_0065"));
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0001")); //저장을 완료하였습니다.

    	return view;
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectNecApmtMngt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("necconmngt.selectNecApmtMngt", model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateNecApmt(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		String strValid = (String)commonDAO.selectData("necconmngt.selectNecApmtRegiValid", model);
    	if (strValid.startsWith("COM_ERR")) {
    		throw new ServiceException(SystemMsg.getMsg(strValid));
    	}else if("NO_DATA".equals(strValid)){
    		extCnt += commonDAO.insertData("necconmngt.insertNecApmt", model);
    	}else if("IN_DATA".equals(strValid)){
    		extCnt += commonDAO.updateData("necconmngt.updateNecApmt", model);
    	}else {
    		throw new ServiceException(SystemMsg.getMsg("COM_ERR_0065"));
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
    public ModelAndView deleteNecApmt(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		String strValid = (String)commonDAO.selectData("necconmngt.selectNecApmtDelValid", model);
    	if (strValid.startsWith("COM_ERR")) {
    		throw new ServiceException(SystemMsg.getMsg(strValid));
    	}else {
    		extCnt += commonDAO.insertData("necconmngt.deleteNecApmt", model);
    	}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003")); //삭제를 완료하였습니다.
    	return view;
	}

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectNecLogMngtPrgsList(Map<String, Object> model) throws Exception {


        return commonDAO.selectListPageJsonView("necconmngt.selectNecLogMngtPrgsList", model);
    }

}
