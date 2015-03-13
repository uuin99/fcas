package fcas.mng.svc.service.impl;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.mng.svc.service.OlnClsMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   ShopMngtServiceImpl
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("olnclsMngtService")
public class OlnClsMngtServiceImpl extends AbstractServiceImpl implements OlnClsMngtService {

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
    public ModelAndView selectOlnClsList(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("olnclsmngt.selectOlnClsList", model);
    }

    /**
	 * 단일Data를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectOlnCls(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("olnclsmngt.selectOlnCls", model);
    }

    /**
	 * 온라인 문의의 저장과 수정을 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateOlnCls(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();

		String strClsSeq = CommonUtil.getObjToString(model.get("CLS_SEQ"));
		//신규
		if("".equals(strClsSeq)){
			int inClsSeq = (Integer)commonDAO.selectData("olnclsmngt.getOlnClsSeqMaxPlus", model);
			
			model.put("CLS_SEQ", inClsSeq);
			model.put("REGI_ID", loginModel.getUserId());

			extCnt += commonDAO.insertData("olnclsmngt.insertOlnCls", model);
		//수정
		}else {
			
			String strOlnClsInqValid = String.valueOf(commonDAO.selectData("olnclsmngt.getOlnClsInqValid", model));
			if(!"Y".equals(strOlnClsInqValid)){
				view.addObject("data", null);
		    	view.addObject("total", extCnt);
		    	view.addObject("success", false);
		    	view.addObject("message", SystemMsg.getMsg(strOlnClsInqValid));

		    	return view;
			}
			
			model.put("UPDT_ID", loginModel.getUserId());

			extCnt += commonDAO.updateData("olnclsmngt.updateOlnClsInq", model);
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0001")); //저장을 완료하였습니다.

    	return view;
	}


    /**
	 * 온라인 문의 삭제를 실행한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView deleteOlnClsInq(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();		
		model.put("UPDT_ID", loginModel.getUserId());
		
		extCnt += commonDAO.updateData("olnclsmngt.deleteOlnClsInq", model);

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003")); //삭제를 완료하였습니다.

    	return view;
	}
    
    /**
	 * 답변을 저장한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView updateOlnClsRep(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;
		
		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();		
		model.put("UPDT_ID", loginModel.getUserId());
		
		extCnt += commonDAO.updateData("olnclsmngt.updateOlnClsRep", model);

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0001")); //삭제를 완료하였습니다.

    	return view;
	}    
}
