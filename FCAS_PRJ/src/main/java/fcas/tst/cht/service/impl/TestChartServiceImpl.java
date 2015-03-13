package fcas.tst.cht.service.impl;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.sys.com.dao.CommonDAO;
import fcas.tst.cht.service.TestChartService;

/**
 * @logicalName   Test Chart Service Impl.
 * @description   
 * @version       $Rev: 1.0 $
 */
@Service("testchartService")
public class TestChartServiceImpl extends AbstractServiceImpl implements TestChartService {
	
    @Resource(name="commonDAO")
    private CommonDAO commonDAO;
    
    /**
	 * Chart를 조회한다.
	 * @param queryId
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */	
    public ModelAndView selectDailyStatsCnt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("testchart.getDailyStatsCnt", model);
    }
    
    /**
	 * Chart를 조회한다.
	 * @param queryId
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */	
    public ModelAndView selectTimesStatsCnt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("testchart.getTimesStatsCnt", model);
    }
    
    /**
	 * Chart를 조회한다.
	 * @param queryId
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */	
    public ModelAndView selectDailyStatsCntDov(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("testchart.getDailyStatsCntDov", model);
    }
    
    /**
	 * Chart를 조회한다.
	 * @param queryId
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */	
    public ModelAndView selectDailyStatsClassA1(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("testchart.getDailyStatsClassA1", model);
    }
    
    /**
	 * Chart를 조회한다.
	 * @param queryId
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */	
    public ModelAndView selectDailyStatsClassA2(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("testchart.getDailyStatsClassA2", model);
    }
    
    /**
	 * Chart를 조회한다.
	 * @param queryId
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */	
    public ModelAndView selectTimesStatsClassA1(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("testchart.getTimesStatsClassA1", model);
    }
    
    /**
	 * Chart를 조회한다.
	 * @param queryId
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */	
    public ModelAndView selectTimesStatsClassA2(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("testchart.getTimesStatsClassA2", model);
    }
    
    /**
	 * Chart를 조회한다.
	 * @param queryId
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */	
    public ModelAndView selectDailyStatsClassA3(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("testchart.getDailyStatsClassA3", model);
    }
}
