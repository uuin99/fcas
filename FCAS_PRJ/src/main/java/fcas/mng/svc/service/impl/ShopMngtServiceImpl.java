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
import fcas.mng.svc.service.ShopMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @logicalName   ShopMngtServiceImpl
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("shopMngtService")
public class ShopMngtServiceImpl extends AbstractServiceImpl implements ShopMngtService {

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
    public ModelAndView selectListPageShopMngt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("shopmngt.getShopList", model);
    }

    /**
	 * 단일Data를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectShop(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("shopmngt.getShop", model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateListShop(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();

		String compId = CommonUtil.getObjToString(model.get("COMP_ID"));
		String shopId = CommonUtil.getObjToString(model.get("SHOP_ID"));
		String cmraCnt = CommonUtil.getObjToString(model.get("CMRA_CNT"));
		//카메라 댓수가 공백일 경우에는 반드시 0이 입력되도록 함.
		if("".equals(cmraCnt)){
			model.put("CMRA_CNT", "0");
		}
		//신규
		if("".equals(shopId)){
			shopId = commonService.getSequenceValue(compId, 5, "PE-ETC", "SH");
			model.put("SHOP_ID", shopId);
			model.put("REGI_ID", loginModel.getUserId());
			model.put("UPDT_ID", loginModel.getUserId());

			extCnt += commonDAO.insertData("shopmngt.insertShop", model);
		//수정
		}else {
			model.put("UPDT_ID", loginModel.getUserId());

			extCnt += commonDAO.updateData("shopmngt.updateShop", model);
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
    public ModelAndView deleteListShop(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;
		
		//삭제 전 매장에 연결되어 있는 카메라,사용자 존재여부 Check!
		String strValid = String.valueOf(commonDAO.selectData("shopmngt.getShopDelValid", model));
		if (!"Y".equals(strValid)) {
			throw new ServiceException(strValid);
		}else {
			extCnt += commonDAO.deleteData("shopmngt.deleteShop", model);

			view.addObject("data", null);
	    	view.addObject("total", extCnt);
	    	view.addObject("success", true);
	    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003")); //삭제를 완료하였습니다.
		}

    	return view;
	}
}
