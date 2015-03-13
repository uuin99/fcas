package fcas.mng.svc.service.impl;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.sys.com.model.LoginModel;
import fcas.mng.svc.service.FailMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   FailMngtServiceImpl
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("failmngtService")
public class FailMngtServiceImpl extends AbstractServiceImpl implements FailMngtService {

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
    public ModelAndView selectListPageFailMngt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("failmngt.selectFailList", model);
    }

    /**
	 * 단일 Data를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectFail(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("failmngt.selectFail", model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateFail(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
		String acptSeq = CommonUtil.getObjToString(model.get("ACPT_SEQ"));

		//신규
		if("".equals(acptSeq)){


			model.put("USER_ID", loginModel.getUserId());
			model.put("FAIL_TM", CommonUtil.getObjToString(model.get("SHOW_FAIL_SI")) + "" + CommonUtil.getObjToString(model.get("SHOW_FAIL_BN")) );


			extCnt += commonDAO.insertData("failmngt.insertFail", model);
		//수정
		}else {

			model.put("USER_ID", loginModel.getUserId());
			model.put("FAIL_TM", CommonUtil.getObjToString(model.get("SHOW_FAIL_SI")) + "" + CommonUtil.getObjToString(model.get("SHOW_FAIL_BN")) );


			extCnt += commonDAO.updateData("failmngt.updateFail", model);
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
    public ModelAndView deleteFail(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		extCnt += commonDAO.deleteData("failmngt.deleteFail", model);

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003")); //삭제를 완료하였습니다.

    	return view;
	}


    /**
	 * 수정을 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView updateFailFins(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();


		model.put("USER_ID", loginModel.getUserId());
		model.put("FINS_TM", CommonUtil.getObjToString(model.get("SHOW_FINS_SI")) + "" + CommonUtil.getObjToString(model.get("SHOW_FINS_BN")) );


		extCnt += commonDAO.updateData("failmngt.updateFailFins", model);

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0001")); //저장을 완료하였습니다.

    	return view;
	}

}
