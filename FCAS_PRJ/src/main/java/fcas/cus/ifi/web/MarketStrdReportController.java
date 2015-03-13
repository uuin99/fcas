package fcas.cus.ifi.web;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fcas.cus.ifi.service.MarketStrdReportService;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.ifi.NICEInterface;
import fcas.sys.com.servlet.SystemMsg;

/**
 * @logicalName   MarketStrdReportController
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class MarketStrdReportController {
    @Resource(name = "marketStrdReportService")
    private MarketStrdReportService marketStrdReportService;

    protected Log log = LogFactory.getLog("egovframework");

    /**
	 * 일자별 통계 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/ifi/MarketStrdReport/selectMarketStrdReportView.do")
    public String selectMarketStrdReportView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "cus/ifi/fcas_market_strd_report_001";
    }

    /**
	 * 매장에 해당하는 주소 정보 및 업종 정보를 가져온다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/ifi/MarketStrdReport/selectShopInfo.do")
    public ModelAndView selectShopInfo (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return marketStrdReportService.selectShopInfo(model);
    }

    /**
	 * NICE에 화면을 요청하여 결과를 받는다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/ifi/MarketStrdReport/selectMarketStrdReport.do")
    public ModelAndView selectMarketStrdReport (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	log.debug("-->"+model);

        NICEInterface niceIF = new NICEInterface();
        niceIF.requestOTPFromNICE();
        if(niceIF.isSuccessResponse()){
        	log.debug("-----------------------------");
        	log.debug(niceIF.getResponseCode());
        	log.debug(niceIF.getTockenKey());
            log.debug("-----------------------------");


            if( model.get("SHOP_ADDR1_CODE") != null || model.get("S_BIZ_ITEM_3") != null) {

	            // 토큰 발급 성공시에... nice에서 준 url에.... 보냄...
	            view.addObject("niceAddrCd", model.get("SHOP_ADDR1_CODE"));
	            view.addObject("niceBizCode", model.get("S_BIZ_ITEM_3"));
	    		view.addObject("niceTockenKey", niceIF.getTockenKey());
	        	view.addObject("success", true);
            } else {

            	// 업종코드나 주소코드 둘중 1개라도 널일경우... error 발생
        		view.addObject("success", false);
            	view.addObject("message", SystemMsg.getMsg( "COM_ERR_0050" ) + " : CODE[none]");

            }

        }else {

        	// 토큰 발급 실패시에... 메세지를 띄워준다.

    		view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg( "COM_ERR_0050" ) + " : CODE["+ niceIF.getResponseCode() +"]");
        	view.addObject("messageCode", niceIF.getResponseCode());
        }


    	return view;
    }




}
