package fcas.cus.fad.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.cus.fad.service.DataClsService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.servlet.SystemMsg;

/**
 * @logicalName   DataCntServiceImpl
 * @version       $Rev: 1.0 $
 */
@Service("dataClsService")
public class DataClsServiceImpl extends AbstractServiceImpl implements DataClsService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListDailyCls(Map<String, Object> model) throws Exception {
    	// 20130902 대용량 데이터 조회 제한 로직 추가 S
    	ModelAndView view = new ModelAndView("jsonView");
    	List cntList = commonDAO.selectList("datacls.selectListDailyClsCount", model);
    	if (Integer.parseInt(cntList.get(0).toString()) > 20000){
    		view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg("COM_ERR_0086"));
            return view;
    	} else {// 20130902 대용량 데이터 조회 제한 로직 추가 E
    		return commonDAO.selectListPageJsonView("datacls.selectListDailyCls", model);
    	}
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListTimeCls(Map<String, Object> model) throws Exception {
    	// 20130902 대용량 데이터 조회 제한 로직 추가 S
    	ModelAndView view = new ModelAndView("jsonView");
    	List cntList = commonDAO.selectList("datacls.selectListTimeClsCount", model);
    	if (Integer.parseInt(cntList.get(0).toString()) > 20000){
    		view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg("COM_ERR_0086"));
            return view;
    	} else {// 20130902 대용량 데이터 조회 제한 로직 추가 E
    		return commonDAO.selectListPageJsonView("datacls.selectListTimeCls", model);
    	}
    }
}
