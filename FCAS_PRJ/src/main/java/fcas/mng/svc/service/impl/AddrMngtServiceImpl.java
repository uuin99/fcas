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
import fcas.mng.svc.service.AddrMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @logicalName   AddrMngtServiceImpl
 * @version       $Rev: 1.0 $
 */
@Service("addrMngtService")
public class AddrMngtServiceImpl extends AbstractServiceImpl implements AddrMngtService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListPageAddrMngt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("addrmngt.getAddrList", model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateListAddr(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		//LoginModel loginModel = SessionUtil.getInstance().getLoginModel();

		List insert_dataList = CommonUtil.getListFromJson(model.get("insertData").toString());
    	if (insert_dataList != null && !insert_dataList.isEmpty()) {

            for (int i=0; i<insert_dataList.size(); i++) {

            	HashMap map = (HashMap) insert_dataList.get(i);

            	//map.put("USER_ID", loginModel.getUserId());

            	//PK 중복 벨리데이션 로직 추가
            	int cnt = (Integer)commonDAO.selectData("addrmngt.selectAddrChk", map);

            	if(cnt == 0) {
            		extCnt += commonDAO.insertData("addrmngt.insertAddr", map);
            	} else {
            		throw new ServiceException( SystemMsg.getMsg("COM_ERR_0011") ); //"다건 저장시 중복된 KEY가 존재합니다."
            	}

            }
		}

    	List update_dataList = CommonUtil.getListFromJson(model.get("updateData").toString());
		if (update_dataList != null && !update_dataList.isEmpty()) {
            for (int i=0; i<update_dataList.size(); i++) {
            	HashMap map = (HashMap) update_dataList.get(i);

            	//map.put("USER_ID", loginModel.getUserId());

            	extCnt += commonDAO.updateData("addrmngt.updateAddr", map);
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
    public ModelAndView deleteListAddr(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		List delete_dataList = CommonUtil.getListFromJson(model.get("deleteData").toString());
    	if (delete_dataList != null && !delete_dataList.isEmpty()) {
            for (int i=0; i<delete_dataList.size(); i++) {
            	HashMap map = (HashMap) delete_dataList.get(i);
            	extCnt += commonDAO.deleteData("addrmngt.deleteAddr", map);
            }
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003")); //삭제를 완료하였습니다.

    	return view;
	}

    /**
	 * 주소조회 Popup에서 페이지가 있는 List를 요청한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListPageAddrConvPopup(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("addrmngt.getAddrConvPopupList", model);
    }
    
    /**
	 * Kwth 주소조회 Popup에서 페이지가 있는 List를 요청한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListPageKwthAddrPopup(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("addrmngt.getKwthAddrPopupList", model);
    }
}
