package fcas.tst.cht.service;

import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   Test Chart Service.
 * @description   
 * @version       $Rev: 1.0 $
 */
public interface TestChartService {
	
	ModelAndView selectDailyStatsCnt(Map<String, Object> model) throws Exception;
	ModelAndView selectTimesStatsCnt(Map<String, Object> model) throws Exception;
	ModelAndView selectDailyStatsCntDov(Map<String, Object> model) throws Exception;
	ModelAndView selectDailyStatsClassA1(Map<String, Object> model) throws Exception;
	ModelAndView selectDailyStatsClassA2(Map<String, Object> model) throws Exception;
	ModelAndView selectTimesStatsClassA1(Map<String, Object> model) throws Exception;
	ModelAndView selectTimesStatsClassA2(Map<String, Object> model) throws Exception;
	ModelAndView selectDailyStatsClassA3(Map<String, Object> model) throws Exception;
}
