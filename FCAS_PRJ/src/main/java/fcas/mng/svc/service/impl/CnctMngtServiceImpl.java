package fcas.mng.svc.service.impl;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.mng.svc.service.CnctMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   Contract Management Service Impl.
 * @version       $Rev: 1.0 $
 */
@Service("cnctMngtService")
public class CnctMngtServiceImpl extends AbstractServiceImpl implements CnctMngtService {

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
    public ModelAndView selectCnctMngtList(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("cnctmngt.getCnctList", model);
    }

    /**
	 * 단일 Data를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectCnctMngt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("cnctmngt.selectCnct", model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateCnct(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
		String cnctNo = CommonUtil.getObjToString(model.get("CNCT_NO"));
		
		//숫자 값 검증.
		String cnctTotAmt = CommonUtil.getObjToString(model.get("CNCT_TOT_AMT"));
		String shopCnt = CommonUtil.getObjToString(model.get("SHOP_CNT"));
		String srvcAmt = CommonUtil.getObjToString(model.get("SRVC_AMT"));
		String cmraCnt = CommonUtil.getObjToString(model.get("CMRA_CNT"));
		String bnftAmt = CommonUtil.getObjToString(model.get("BNFT_AMT"));
		if("".equals(cnctTotAmt)){model.put("CNCT_TOT_AMT", 0);}
		if("".equals(shopCnt)){model.put("SHOP_CNT", 0);}
		if("".equals(srvcAmt)){model.put("SRVC_AMT", 0);}
		if("".equals(cmraCnt)){model.put("CMRA_CNT", 0);}
		if("".equals(bnftAmt)){model.put("BNFT_AMT", 0);}
		
		//신규
		if("".equals(cnctNo)){
			cnctNo = commonService.getSequenceValue("CNCT_NO", 11, "PE-XY4M2", "CN");
			model.put("CNCT_NO", cnctNo);
			model.put("REGI_ID", loginModel.getUserId());
			model.put("UPDT_ID", loginModel.getUserId());

			extCnt += commonDAO.insertData("cnctmngt.insertCnct", model);
		//수정
		}else {
			model.put("UPDT_ID", loginModel.getUserId());

			extCnt += commonDAO.updateData("cnctmngt.updateCnct", model);
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
    public ModelAndView deleteCnct(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		extCnt += commonDAO.deleteData("cnctmngt.deleteCnct", model);

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003")); //삭제를 완료하였습니다.
    	
    	return view;
	}    
    
}
