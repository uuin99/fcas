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
import fcas.cus.fad.service.SalesInfoService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @logicalName   SaleInfoServiceImpl
 * @version       $Rev: 1.0 $
 */
@Service("salesInfoService")
public class SalesInfoServiceImpl extends AbstractServiceImpl implements SalesInfoService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;
    
    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return List
	 * @exception
	 */
    public List selectTimeChart(Map<String, Object> model) throws Exception {
    	return commonDAO.selectList("salesinforeport.selectTimeChart", model);
    }
    
    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return List
	 * @exception
	 */
    public List selectDayChart(Map<String, Object> model) throws Exception {
    	return commonDAO.selectList("salesinforeport.selectDayChart", model);
    }
    
    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return List
	 * @exception
	 */
    public List selectDovChart(Map<String, Object> model) throws Exception {
    	return commonDAO.selectList("salesinforeport.selectDovChart", model);
    }
    
    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return List
	 * @exception
	 */
    public List selectMonthChart(Map<String, Object> model) throws Exception {
    	return commonDAO.selectList("salesinforeport.selectMonthChart", model);
    }
    
    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return List
	 * @exception
	 */
    public List selectTermChart(Map<String, Object> model) throws Exception {
    	return commonDAO.selectList("salesinforeport.selectTermChart", model);
    }
    
    /**
	 * 실적 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return List
	 * @exception
	 */
    public List selectMonthResult(Map<String, Object> model) throws Exception {
    	return commonDAO.selectList("salesinforeport.selectMonthResult", model);
    }
    
    /**
	 * 실적 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return List
	 * @exception
	 */
    public List selectEvntResult(Map<String, Object> model) throws Exception {
    	return commonDAO.selectList("salesinforeport.selectEvntResult", model);
    }
}
