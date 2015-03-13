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
import fcas.cus.fad.service.ShopStrdReportService;
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
@Service("shopStrdReportService")
public class ShopStrdReportServiceImpl extends AbstractServiceImpl implements ShopStrdReportService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public List selectChart_0_1(Map<String, Object> model) throws Exception {
    	List result = commonDAO.selectList("shopstrdreport.selectChart_0_1", model);
        return result;
    }
    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public List selectChart_0_2(Map<String, Object> model) throws Exception {
    	List result = commonDAO.selectList("shopstrdreport.selectChart_0_2", model);
        return result;
    }
    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public Map selectChart_1_1(Map<String, Object> model) throws Exception {
    	Map result = (Map)commonDAO.selectData("shopstrdreport.selectChart_1_1", model);
        return result;
    }
    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public List selectChart_1_2(Map<String, Object> model) throws Exception {
    	List result = commonDAO.selectList("shopstrdreport.selectChart_1_2", model);
        return result;
    }
    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public Map selectTableData_1_2(Map<String, Object> model) throws Exception {
    	Map result = (Map)commonDAO.selectData("shopstrdreport.selectTableData_1_2", model);
        return result;
    }
    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public List selectChart_2_1(Map<String, Object> model) throws Exception {
    	List result = commonDAO.selectList("shopstrdreport.selectChart_2_1", model);
        return result;
    }
    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public List selectChart_2_2(Map<String, Object> model) throws Exception {
    	List result = commonDAO.selectList("shopstrdreport.selectChart_2_2", model);
        return result;
    }

    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public List selectChart_3_1_1(Map<String, Object> model) throws Exception {
    	List result = commonDAO.selectList("shopstrdreport.selectChart_3_1_1", model);
        return result;
    }

    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public List selectChart_3_1_2(Map<String, Object> model) throws Exception {
    	List result = commonDAO.selectList("shopstrdreport.selectChart_3_1_2", model);
        return result;
    }

    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public List selectChart_4_1(Map<String, Object> model) throws Exception {
    	List result = commonDAO.selectList("shopstrdreport.selectChart_4_1", model);
        return result;
    }

    /**
	 * 차트 정보를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public List selectChart_5_1(Map<String, Object> model) throws Exception {
    	List result = commonDAO.selectList("shopstrdreport.selectChart_5_1", model);
        return result;
    }

    /**
	 * 휴일인지 판별한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public String checkWorkYn(Map<String, Object> model) throws Exception {
    	String result = (String)commonDAO.selectData("shopstrdreport.checkWorkYn", model);
        return result;
    }

    /**
	 * 집계 데이터가 존재하는지 비교한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public int selectDaySumCnt(Map<String, Object> model) throws Exception {
    	int cnt = (Integer)commonDAO.selectData("shopstrdreport.selectDaySumCnt", model);
        return cnt;
    }


}
