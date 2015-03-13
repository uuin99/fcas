package fcas.mng.svc.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.SystemUtils;
import org.apache.poi.util.StringUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.sys.com.model.LoginModel;
import fcas.mng.svc.service.CompMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @logicalName   CompMngtServiceImpl
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("compMngtService")
public class CompMngtServiceImpl extends AbstractServiceImpl implements CompMngtService {

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
    public ModelAndView selectListPageCompMngt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("compmngt.getCompList", model);
    }

    /**
	 * 단일 Data를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectComp(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("compmngt.getComp", model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateListComp(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
		String compId = CommonUtil.getObjToString(model.get("COMP_ID"));
		model.put("TAX_NO", CommonUtil.getObjToString(model.get("F_TAX_NO")) + CommonUtil.getObjToString(model.get("M_TAX_NO")) + CommonUtil.getObjToString(model.get("L_TAX_NO")));
		model.put("COMP_REGI_NO", CommonUtil.getObjToString(model.get("F_COMP_REGI_NO")) + CommonUtil.getObjToString(model.get("L_COMP_REGI_NO")));
		//신규
		if("".equals(compId)){
			compId = commonService.getSequenceValue("COMP_ID", 7, "PE-ETC", "CM");
			model.put("COMP_ID", compId);
			model.put("REGI_ID", loginModel.getUserId());
			model.put("UPDT_ID", loginModel.getUserId());

			extCnt += commonDAO.insertData("compmngt.insertComp", model);
		//수정
		}else {
			model.put("UPDT_ID", loginModel.getUserId());

			extCnt += commonDAO.updateData("compmngt.updateComp", model);
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
    public ModelAndView deleteListComp(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		//삭제 전 고객사에 연결되어 있는 매장,계약 존재여부 Check!
		String strValid = String.valueOf(commonDAO.selectData("compmngt.getCompDelValid", model));
		if (!"Y".equals(strValid)) {
			throw new ServiceException(strValid);
		}else {
			extCnt += commonDAO.deleteData("compmngt.deleteComp", model);
		}
		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003")); //삭제를 완료하였습니다.		
    	return view;
	}

    /**
	 * 정의된 값의 중복여부를 Checking 함.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectDistinctValue(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;
		String retCode = "COM_ERR_0012";//{param1}은(는) 현재 존재하는 값으로 사용이 불가능합니다.
		extCnt = (Integer)commonDAO.selectData("compmngt.selectDistinctValue", model);

		if(extCnt == 0){
			retCode = "COM_RST_0005";//{param1}은(는) 사용이 가능합니다.
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg(retCode));
    	view.addObject("messageCode", retCode);

    	return view;
	}

    /**업체명 Combo 정의 Start**/

    /**
	 * 일반적인 업체명 Combo.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectCompCombo(Map<String, Object> model) throws Exception {
		return commonDAO.selectListJsonView("compmngt.selectCompCombo", model);
	}

    /**업체명 Combo 정의 End**/
}
