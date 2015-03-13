package fcas.cus.fad.web;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fcas.cus.fad.service.DataCntService;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.servlet.SystemMsg;

/**
 * @logicalName   DataCntController
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class DataCntController {
    @Resource(name = "dataCntService")
    private DataCntService dataCntService;

    @Resource(name = "commonService")
    private CommonService commonService;

    /**
	 * 일자별 통계 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/DataCnt/selectDailyCntView.do")
    public String selectDailyCntView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "cus/fad/fcas_daily_cnt_001";
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/DataCnt/selectDailyCntList.do")
    public ModelAndView selectDailyCntList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_daily_cnt_001", "A", model);
    	/*조회 로그 생성 End*/
    	return dataCntService.selectDailyCntList(model);
    }

    /**
	 * 시간대별 통계 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/DataCnt/selectTimeCntView.do")
    public String selectTimeCntView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "cus/fad/fcas_time_cnt_001";
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/DataCnt/selectTimeCntList.do")
    public ModelAndView selectTimeCntList (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_time_cnt_001", "A", model);
    	/*조회 로그 생성 End*/
    	return dataCntService.selectTimeCntList(model);
    }


}
