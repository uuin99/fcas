package fcas.cus.fad.service;

import java.util.Map;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

/**
 * @logicalName   DataCntService
 * @description
 * @version       $Rev: 1.0 $
 */
public interface ShopStrdReportCpaService {

	String checkWorkYn(Map<String, Object> model) throws Exception;
	List selectChart_0_1(Map<String, Object> model) throws Exception;
	List selectChart_0_2(Map<String, Object> model) throws Exception;
	Map selectChart_1_1(Map<String, Object> model) throws Exception;
	List selectChart_1_2(Map<String, Object> model) throws Exception;
	Map selectTableData_1_2(Map<String, Object> model) throws Exception;
	List selectChart_2_1(Map<String, Object> model) throws Exception;
	List selectChart_2_2(Map<String, Object> model) throws Exception;
	List selectChart_3_1_1(Map<String, Object> model) throws Exception;
	List selectChart_3_1_2(Map<String, Object> model) throws Exception;
	List selectChart_4_1(Map<String, Object> model) throws Exception;
	List selectChart_5_1(Map<String, Object> model) throws Exception;

	int selectDaySumCnt(Map<String, Object> model) throws Exception;

}
