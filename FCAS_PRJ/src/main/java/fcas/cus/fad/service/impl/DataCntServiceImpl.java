package fcas.cus.fad.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.sys.com.model.LoginModel;
import fcas.cus.fad.service.DataCntService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @logicalName   DataCntServiceImpl
 * @version       $Rev: 1.0 $
 */
@Service("dataCntService")
public class DataCntServiceImpl extends AbstractServiceImpl implements DataCntService {

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
    	// 20130902 대용량 데이터 조회 제한 로직 추가 S
    	ModelAndView view = new ModelAndView("jsonView");
    	List cntList = commonDAO.selectList("datacnt.selectDailyCntListCount", model);
    	if (Integer.parseInt(cntList.get(0).toString()) > 20000){
    		view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg("COM_ERR_0086"));
            return view;
    	} else {// 20130902 대용량 데이터 조회 제한 로직 추가 E
    		return commonDAO.selectListPageJsonView("datacnt.selectDailyCntList", model);
    	}
    }


    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectTimeCntList(Map<String, Object> model) throws Exception {
		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
		model.put("COMP_ID", loginModel.getCompId());
    	// 20130902 대용량 데이터 조회 제한 로직 추가 S
    	ModelAndView view = new ModelAndView("jsonView");
    	List cntList = commonDAO.selectList("datacnt.selectTimeCntListCount", model);
    	if (Integer.parseInt(cntList.get(0).toString()) > 20000){
    		view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg("COM_ERR_0086"));
            return view;
    	} else {// 20130902 대용량 데이터 조회 제한 로직 추가 E
    		return commonDAO.selectListPageJsonView("datacnt.selectTimeCntList", model);
    	}
    }

}
