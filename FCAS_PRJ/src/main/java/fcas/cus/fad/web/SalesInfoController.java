package fcas.cus.fad.web;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import fcas.cus.fad.service.SalesInfoService;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.RexpertXmlUtil;

/**
 * @logicalName   SalesInfoController
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class SalesInfoController {
    @Resource(name = "salesInfoService")
    private SalesInfoService salesInfoService;
    
    @Resource(name = "commonService")
    private CommonService commonService;
    
    /**
	 * 구매율 현황 - 시간대별
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/SalesInfo/selectTimeStatView.do")
    public String selectTimeStatView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	return "cus/fad/fcas_time_stat_001";
    }

    /* 렉스포트 화면을 iframe 에 요청한다. */
    @RequestMapping(value="/cus/fad/SalesInfo/selectTimeStatPrint.do")
    public String selectTimeStatPrint(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	
    	return "cus/fad/fcas_time_stat_rx_print_001";
    }

    /* xml 데이터를 생성한다 */
    @RequestMapping(value="/cus/fad/SalesInfo/selectTimeStatPrintXml.do")
    public void selectTimeStatPrintXml(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	
    	//rxParam 을 맵형태로 치환한다.
    	Map param = CommonUtil.getStringToHashMap(request.getParameter("rxParam") ,"|" ,":");

    	/*조회 로그 생성 Start*/
    	java.util.HashMap<String, Object> scMap = new java.util.HashMap<String, Object>();
    	scMap.putAll(param);
    	scMap.remove("SC_MAP");
    	scMap.put("SC_MAP", param.get("SC_MAP").toString().replaceAll("&quot;", "\""));
    	commonService.insertFcaHistSearch("fcas_time_stat_001", "A", scMap);
    	/*조회 로그 생성 End*/    	
    	
    	List chart_list = salesInfoService.selectTimeChart(param);
    	
		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
		sb.append( "<gubun>\n");
		sb.append( "	<rpt1>\n");
		sb.append( RexpertXmlUtil.toXML(chart_list, "rexdataset", "rexrow")+"\n");
		sb.append( "	</rpt1>\n");
		sb.append( "</gubun>\n");
		//System.out.println(sb.toString());
		
    	response.setContentType("text/xml; charset=UTF-8");
    	response.getWriter().print( sb.toString() );
    }

    /**
	 * 구매율 현황 - 일자별
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/SalesInfo/selectDayStatView.do")
    public String selectDayStatView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	return "cus/fad/fcas_day_stat_001";
    }
    
    /* 렉스포트 화면을 iframe 에 요청한다. */
    @RequestMapping(value="/cus/fad/SalesInfo/selectDayStatPrint.do")
    public String selectDayStatPrint (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	
    	return "cus/fad/fcas_day_stat_rx_print_001";
    }
    
    /* xml 데이터를 생성한다 */
    @RequestMapping(value="/cus/fad/SalesInfo/selectDayStatPrintXml.do")
    public void selectDayStatPrintXml(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	//rxParam 을 맵형태로 치환한다.
    	Map param = CommonUtil.getStringToHashMap(request.getParameter("rxParam") ,"|" ,":");

    	/*조회 로그 생성 Start*/
    	java.util.HashMap<String, Object> scMap = new java.util.HashMap<String, Object>();
    	scMap.putAll(param);
    	scMap.remove("SC_MAP");
    	scMap.put("SC_MAP", param.get("SC_MAP").toString().replaceAll("&quot;", "\""));
    	commonService.insertFcaHistSearch("fcas_day_stat_001", "A", scMap);
    	/*조회 로그 생성 End*/    	
    	
    	List chart_list = salesInfoService.selectDayChart(param);
    	
		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
		sb.append( "<gubun>\n");
		sb.append( "	<rpt1>\n");
		sb.append( RexpertXmlUtil.toXML(chart_list, "rexdataset", "rexrow")+"\n");
		sb.append( "	</rpt1>\n");
		sb.append( "</gubun>\n");
		//System.out.println(sb.toString());
		
    	response.setContentType("text/xml; charset=UTF-8");
    	response.getWriter().print( sb.toString() );
    }
    
    /**
	 * 구매율 현황 - 요일별
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/SalesInfo/selectDovStatView.do")
    public String selectDovStatView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "cus/fad/fcas_dov_stat_001";
    }
    
    /* 렉스포트 화면을 iframe 에 요청한다. */
    @RequestMapping(value="/cus/fad/SalesInfo/selectDovStatPrint.do")
    public String selectDovStatPrint (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	
    	return "cus/fad/fcas_dov_stat_rx_print_001";
    }
    
    /* xml 데이터를 생성한다 */
    @RequestMapping(value="/cus/fad/SalesInfo/selectDovStatPrintXml.do")
    public void selectDovStatPrintXml(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	//rxParam 을 맵형태로 치환한다.
    	Map param = CommonUtil.getStringToHashMap(request.getParameter("rxParam") ,"|" ,":");
    	
    	/*조회 로그 생성 Start*/
    	java.util.HashMap<String, Object> scMap = new java.util.HashMap<String, Object>();
    	scMap.putAll(param);
    	scMap.remove("SC_MAP");
    	scMap.put("SC_MAP", param.get("SC_MAP").toString().replaceAll("&quot;", "\""));
    	commonService.insertFcaHistSearch("fcas_dov_stat_001", "A", scMap);
    	/*조회 로그 생성 End*/    	
    	
    	List chart_list = salesInfoService.selectDovChart(param);
    	
		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
		sb.append( "<gubun>\n");
		sb.append( "	<rpt1>\n");
		sb.append( RexpertXmlUtil.toXML(chart_list, "rexdataset", "rexrow")+"\n");
		sb.append( "	</rpt1>\n");
		sb.append( "</gubun>\n");
		//System.out.println(sb.toString());
		
    	response.setContentType("text/xml; charset=UTF-8");
    	response.getWriter().print( sb.toString() );
    }
    
    /**
	 * 구매율 현황 - 월별
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/SalesInfo/selectMonthStatView.do")
    public String selectMonthStatView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "cus/fad/fcas_month_stat_001";
    }
    
    /* 렉스포트 화면을 iframe 에 요청한다. */
    @RequestMapping(value="/cus/fad/SalesInfo/selectMonthStatPrint.do")
    public String selectMonthStatPrint (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	    	
    	return "cus/fad/fcas_month_stat_rx_print_001";
    }
    
    /* xml 데이터를 생성한다 */
    @RequestMapping(value="/cus/fad/SalesInfo/selectMonthStatPrintXml.do")
    public void selectMonthStatPrintXml(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	//rxParam 을 맵형태로 치환한다.
    	Map param = CommonUtil.getStringToHashMap(request.getParameter("rxParam") ,"|" ,":");
    	
    	/*조회 로그 생성 Start*/
    	java.util.HashMap<String, Object> scMap = new java.util.HashMap<String, Object>();
    	scMap.putAll(param);
    	scMap.remove("SC_MAP");
    	scMap.put("SC_MAP", param.get("SC_MAP").toString().replaceAll("&quot;", "\""));
    	commonService.insertFcaHistSearch("fcas_month_stat_001", "A", scMap);
    	/*조회 로그 생성 End*/    	
    	
    	List chart_list = salesInfoService.selectMonthChart(param);
    	
		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
		sb.append( "<gubun>\n");
		sb.append( "	<rpt1>\n");
		sb.append( RexpertXmlUtil.toXML(chart_list, "rexdataset", "rexrow")+"\n");
		sb.append( "	</rpt1>\n");
		sb.append( "</gubun>\n");
		//System.out.println(sb.toString());
		
    	response.setContentType("text/xml; charset=UTF-8");
    	response.getWriter().print( sb.toString() );
    }
    
    /**
	 * 기간 대비 구매율 그래프
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/SalesInfo/selectTermStatView.do")
    public String selectTermStatView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "cus/fad/fcas_term_stat_001";
    }
    
    /* 렉스포트 화면을 iframe 에 요청한다. */
    @RequestMapping(value="/cus/fad/SalesInfo/selectTermStatPrint.do")
    public String selectTermStatPrint (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	
    	return "cus/fad/fcas_term_stat_rx_print_001";
    }
    
    /* xml 데이터를 생성한다 */
    @RequestMapping(value="/cus/fad/SalesInfo/selectTermStatPrintXml.do")
    public void selectTermStatPrintXml(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	//rxParam 을 맵형태로 치환한다.
    	Map param = CommonUtil.getStringToHashMap(request.getParameter("rxParam") ,"|" ,":");
    	
    	/*조회 로그 생성 Start*/
    	java.util.HashMap<String, Object> scMap = new java.util.HashMap<String, Object>();
    	scMap.putAll(param);
    	scMap.remove("SC_MAP");
    	scMap.put("SC_MAP", param.get("SC_MAP").toString().replaceAll("&quot;", "\""));
    	commonService.insertFcaHistSearch("fcas_term_stat_001", "A", scMap);
    	/*조회 로그 생성 End*/    	
    	
    	List chart_list = salesInfoService.selectTermChart(param);
    	
		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
		sb.append( "<gubun>\n");
		sb.append( "	<rpt1>\n");
		sb.append( RexpertXmlUtil.toXML(chart_list, "rexdataset", "rexrow")+"\n");
		sb.append( "	</rpt1>\n");
		sb.append( "</gubun>\n");
		//System.out.println(sb.toString());
		
    	response.setContentType("text/xml; charset=UTF-8");
    	response.getWriter().print( sb.toString() );
    }
    
    /**
	 * 월간 고객수 대비 실적
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/SalesInfo/selectMonthResultView.do")
    public String selectMonthResultView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "cus/fad/fcas_month_result_001";
    }
    
    /* 렉스포트 화면을 iframe 에 요청한다. */
    @RequestMapping(value="/cus/fad/SalesInfo/selectMonthResultPrint.do")
    public String selectMonthResultPrint (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	
    	return "cus/fad/fcas_month_result_rx_print_001";
    }
    
    /*  xml 데이터를 생성한다 */
    @RequestMapping(value="/cus/fad/SalesInfo/selectMonthResultPrintXml.do")
    public void selectMonthResultPrintXml(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	//rxParam 을 맵형태로 치환한다.
    	Map param = CommonUtil.getStringToHashMap(request.getParameter("rxParam") ,"|" ,":");
    	
    	/*조회 로그 생성 Start*/
    	java.util.HashMap<String, Object> scMap = new java.util.HashMap<String, Object>();
    	scMap.putAll(param);
    	scMap.remove("SC_MAP");
    	scMap.put("SC_MAP", param.get("SC_MAP").toString().replaceAll("&quot;", "\""));
    	commonService.insertFcaHistSearch("fcas_month_result_001", "A", scMap);
    	/*조회 로그 생성 End*/    	
    	
    	List chart_list = salesInfoService.selectMonthResult(param);
    	
		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
		sb.append( "<gubun>\n");
		sb.append( "	<rpt1>\n");
		sb.append( RexpertXmlUtil.toXML(chart_list, "rexdataset", "rexrow")+"\n");
		sb.append( "	</rpt1>\n");
		sb.append( "</gubun>\n");
		//System.out.println(sb.toString());
		
    	response.setContentType("text/xml; charset=UTF-8");
    	response.getWriter().print( sb.toString() );
    }
    
    /**
	 * 이벤트별 고객수 대비 실적
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/SalesInfo/selectEvntResultView.do")
    public String selectEvntResultView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "cus/fad/fcas_evnt_result_001";
    }
    
    /* 렉스포트 화면을 iframe 에 요청한다. */
    @RequestMapping(value="/cus/fad/SalesInfo/selectEvntResultPrint.do")
    public String selectEvntResultPrint (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	
    	return "cus/fad/fcas_evnt_result_rx_print_001";
    }
    
    /*  xml 데이터를 생성한다 */
    @RequestMapping(value="/cus/fad/SalesInfo/selectEvntResultPrintXml.do")
    public void selectEvntResultPrintXml(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	//rxParam 을 맵형태로 치환한다.
    	Map param = CommonUtil.getStringToHashMap(request.getParameter("rxParam") ,"|" ,":");
    	
    	/*조회 로그 생성 Start*/
    	java.util.HashMap<String, Object> scMap = new java.util.HashMap<String, Object>();
    	scMap.putAll(param);
    	scMap.remove("SC_MAP");
    	scMap.put("SC_MAP", param.get("SC_MAP").toString().replaceAll("&quot;", "\""));
    	commonService.insertFcaHistSearch("fcas_evnt_result_001", "A", scMap);
    	/*조회 로그 생성 End*/    	
    	
    	List chart_list = salesInfoService.selectEvntResult(param);
    	
		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
		sb.append( "<gubun>\n");
		sb.append( "	<rpt1>\n");
		sb.append( RexpertXmlUtil.toXML(chart_list, "rexdataset", "rexrow")+"\n");
		sb.append( "	</rpt1>\n");
		sb.append( "</gubun>\n");
		//System.out.println(sb.toString());
		
    	response.setContentType("text/xml; charset=UTF-8");
    	response.getWriter().print( sb.toString() );
    }
}
