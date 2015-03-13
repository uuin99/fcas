package fcas.cus.ifi.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.sys.com.model.LoginModel;
import fcas.cus.ifi.service.MarketStrdReportService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @logicalName   MarketStrdReportServiceImpl
 * @version       $Rev: 1.0 $
 */
@Service("marketStrdReportService")
public class MarketStrdReportServiceImpl extends AbstractServiceImpl implements MarketStrdReportService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectDailyCntList(Map<String, Object> model) throws Exception {
		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
		model.put("COMP_ID", loginModel.getCompId());

        return commonDAO.selectListPageJsonView("marketstrdreport.selectDailyCntList", model);
    }

    /**
	 *  매장에 해당하는 주소 정보 및 업종 정보를 가져온다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectShopInfo(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
		model.put("COMP_ID", loginModel.getCompId());
		Map map = (Map)commonDAO.selectData("marketstrdreport.selectShopInfo", model);



		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("resultMap", map);
    	//view.addObject("message", SystemMsg.getMsg(retCode));
    	//view.addObject("messageCode", retCode);

    	return view;
	}

}
