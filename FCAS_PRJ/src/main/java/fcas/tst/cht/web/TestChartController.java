package fcas.tst.cht.web;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fcas.sys.com.servlet.SystemMsg;
import fcas.tst.cht.service.TestChartService;

/**
 * @logicalName   Test Chart Controller.
 * @description   
 * @version       $Rev: 1.0 $
 */
@Controller
public class TestChartController {
    @Resource(name = "testchartService")
    private TestChartService testchartService;
    
    /**
	 * Test Chart 001 화면을 호출한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return String
	 * @exception 
	 */
    @RequestMapping(value="/tst/cht/TestChart/selectTestChart001View.do")
    public String selectTestChart001View(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "tst/cht/test_chart_001";
    }
    
    /**
	 * DailyStatsCnt 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/tst/cht/TestChart/selectDailyStatsCnt.do")
    public ModelAndView selectDailyStatsCnt(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	return testchartService.selectDailyStatsCnt(model);
    }
    
    /**
	 * TimesStatsCnt 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/tst/cht/TestChart/selectTimesStatsCnt.do")
    public ModelAndView selectTimesStatsCnt(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	return testchartService.selectTimesStatsCnt(model);
    }
    
    /**
	 * TimesStatsCntDov 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/tst/cht/TestChart/selectDailyStatsCntDov.do")
    public ModelAndView selectDailyStatsCntDov(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	return testchartService.selectDailyStatsCntDov(model);
    }
    
    /**
	 * DailyStatsClassA1 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/tst/cht/TestChart/selectDailyStatsClassA1.do")
    public ModelAndView selectDailyStatsClassA1(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	return testchartService.selectDailyStatsClassA1(model);
    }
    
    /**
	 * DailyStatsClassA2 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/tst/cht/TestChart/selectDailyStatsClassA2.do")
    public ModelAndView selectDailyStatsClassA2(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	return testchartService.selectDailyStatsClassA2(model);
    }
    
    /**
	 * TimesStatsClassA1 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/tst/cht/TestChart/selectTimesStatsClassA1.do")
    public ModelAndView selectTimesStatsClassA1(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	return testchartService.selectTimesStatsClassA1(model);
    }
    
    /**
	 * TimesStatsClassA2 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/tst/cht/TestChart/selectTimesStatsClassA2.do")
    public ModelAndView selectTimesStatsClassA2(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	return testchartService.selectTimesStatsClassA2(model);
    }
    
    /**
	 * Test Chart 002 화면을 호출한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return String
	 * @exception 
	 */
    @RequestMapping(value="/tst/cht/TestChart/selectTestChart002View.do")
    public String selectTestChart002View(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "tst/cht/test_chart_002";
    }
    
    /**
	 * DailyStatsClassA3 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/tst/cht/TestChart/selectDailyStatsClassA3.do")
    public ModelAndView selectDailyStatsClassA3(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	return testchartService.selectDailyStatsClassA3(model);
    }
}
