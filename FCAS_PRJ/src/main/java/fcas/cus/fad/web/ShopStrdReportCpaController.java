package fcas.cus.fad.web;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import fcas.cus.fad.service.ShopStrdReportCpaService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.RexpertXmlUtil;
//import fcas.sys.com.utl.RexpertXmlUtil2;
import fcas.sys.com.utl.SessionUtil;

import egovframework.rte.psl.dataaccess.util.EgovMap;

import org.apache.commons.lang.time.StopWatch;

/**
 * @logicalName   ShopStrdReportController
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class ShopStrdReportCpaController {

	//@Resource(name = "shopStrdReportService")
    //private ShopStrdReportService shopStrdReportService;

    @Resource(name = "commonService")
    private CommonService commonService;

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;


    /**
	 * 매장분석 기본 레포트 화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/ShopStrdReport/selectShopStrdReportCpaView.do")
    public String selectDailyCntView (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {


        try{

//StopWatch sw = new StopWatch();
//sw.start();

	    	commonDAO.getSqlMapClient().startTransaction();


	    	// 검색 조건 셋팅
	    	Map<String, Object> paramMap = new HashMap<String, Object>();

	    	// 현재 날짜를 가져온다 DB에서..
	    	Map dbYmd = commonService.getDbYmd();
	    	//Map dbYmd = commonService.getDbYmdCustom("2014-02-27");


	    	LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
	    	paramMap.put("searchCompId", loginModel.getCompId()); // 로긴한 고객사ID
	    	paramMap.put("searchShopId", loginModel.getShopId()); // 로긴한 매장ID



	    	// 기준일이 휴일인지를 판별한다. 휴일이면... -1일을 해서.. 휴일이 아닐때 까지 찾아온다.
	    	boolean flag = true;
	    	SimpleDateFormat sdf = null;
	    	Date toDay = null;
	    	Date strdD = null;
	    	String strdDay = null;
	    	int exday = 1;
	    	while( flag ) {
	            sdf = new SimpleDateFormat("yyyyMMdd");
	    		toDay = sdf.parse(dbYmd.get("YYYYMMDD").toString());

	    		strdD = CommonUtil.getBeforeDay(toDay, exday );
	    		strdDay = sdf.format(strdD); // exDay 만큼의 전일을 구함..

	    		paramMap.put("targetDay", strdDay);
	    		String chk = (String)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.checkWorkYn", paramMap);

	        	if( chk == null) {
	        		flag = false;
	        		paramMap.put("strdDay", strdDay);
	        	} else {
	        		exday++;
	        	}
	    	}

	    	// strdDay 로.. 기준일에 대한 정보를 다시 쿼리로 가져온다
	    	dbYmd = commonService.getDbYmdCustom(paramMap.get("strdDay").toString());


	    	paramMap.put("nowDate", dbYmd.get("YYYYMMDD").toString()); // 오늘날짜
	    	paramMap.put("nowDate2", "D_"+dbYmd.get("YYYYMMDD").toString()); // 오늘날짜


	    	//paramMap.put("targetDay", dbYmd.get("YYYYMMDD").toString()); // 기준일이 휴일인지 판별
	    	////String chk2 = (String)commonDAO.selectData("shopstrdreportcpa.checkWorkYn", paramMap); // shopStrdReportService.checkWorkYn( paramMap ); //
	    	//String chk2 = (String)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.checkWorkYn", paramMap); // shopStrdReportService.checkWorkYn( paramMap ); //
            //
	    	//if( chk2 != null) {
	    	//	// 기준일자 param1은 휴일이므로\n집계정보가 없습니다.
	    	//	model.addAttribute("msg", SystemMsg.getMsg("COM_IFO_0012").replaceFirst("param1", dbYmd.get("YYYY")+"년 "+dbYmd.get("MM")+"월 "+dbYmd.get("DD")+"일 "+dbYmd.get("DATE_NAME")+"요일" ));
	    	//	return "error/error";
	    	//}





	    	// 기준일의 날씨 정보를 가져온다..!!
	    	Map<String, Object> searchMap = new HashMap<String, Object>();
	    	searchMap.put("STND_DATE", dbYmd.get("YYYYMMDD").toString());
	    	searchMap.put("TIME_GRP", "02");
	    	searchMap.put("SHOP_ID", loginModel.getShopId());
	    	searchMap.put("COMP_ID", loginModel.getCompId());
	    	Map wthInfo = commonService.getKwthInfo(searchMap);
	    	model.addAttribute("wthInfo", wthInfo );




	    	// 전일 기준일 을 구한다.. ( 오늘날짜의 -1 한 날짜가 휴일인지를 가져온다.. 휴일이 아닐때가 전일 기준일이다.  휴일이라면 -1 일이 전일 기준일이다. )
	    	flag = true;
	    	sdf = null;
	    	toDay = null;
	    	Date preD = null;
	    	String preDay = null; // 전일 기준일..
	    	exday = 1;
	    	while( flag ) {
	            sdf = new SimpleDateFormat("yyyyMMdd");
	    		toDay = sdf.parse(dbYmd.get("YYYYMMDD").toString());

	    		preD = CommonUtil.getBeforeDay(toDay, exday );
	    		preDay = sdf.format(preD); // exDay 만큼의 전일을 구함..

	    		paramMap.put("targetDay", preDay); // 전일 기준일 (기준일 -1 일이 휴일인지 판별)
	    		String chk = (String)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.checkWorkYn", paramMap); //shopStrdReportService.checkWorkYn( paramMap ); // 휴일인지를 판별

	        	if( chk == null) {
	        		flag = false; // 휴일이 아니면.. preDay 과 전일 기준일이 된다.
	        		paramMap.put("preDay", preDay); // 전일 기준일 (기준일 -1 일이 휴일인지 판별)
	        	} else {
	        		exday++;
	        	}
	    	}
	    	//System.out.println("============================================");
	    	//System.out.println("test-->전일기준일은?=="+paramMap.get("preDay"));
	    	//System.out.println("============================================");






	    	//0 입장객수 현황
	    	//0-1 전일 대비 현황
	    	List chart_0_1 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_0_1", paramMap); //shopStrdReportService.selectChart_0_1(paramMap);



	    	if(chart_0_1 == null || chart_0_1.size() == 0) {
	    		// "현재 매장은 아직 카메라가 설치 되지 않았거나\n집계정보 생성 전입니다."
	    		model.addAttribute("msg", SystemMsg.getMsg("COM_IFO_0013") );
	    		return "error/error";
	    	}

	    	//0-2 시간대별 추이
	    	List chart_0_2 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_0_2", paramMap); //shopStrdReportService.selectChart_0_2(paramMap);



	    	// 시사점 정보 String Make
	    	// 기준일자의 총 입장객수는 전일대비 xx%증가 감소 하였고<br />시간대 별로는  18시~21시 사이에 가장 많이 방문하셨습니다.
	    	String sisa_0 = "기준일자의 총 입장객수는 전일대비 pStr1 했고<br />시간대 별로는  <span class='text_em'>pStr2</span> 사이에 가장 많이 방문했습니다.";

	    	Map exResultInfo = null;
	    	String pStr1 = "";
	    	String pStr2 = "";
	    	String pStr3 = "";
	    	String pStr4 = "";
	    	String pStr5 = "";
	    	String pStr6 = "";
	    	String pStr7 = "";
	    	String pStr8 = "";
	    	String pStr9 = "";
	    	String pStr10 = "";

	    	if(chart_0_1.size() == 1) {
	    		sisa_0 = "전일 집계 데이터가 없습니다.";
	    	} else {



		    	exResultInfo = getMaxValueInfo0_1( chart_0_1 ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
		    	pStr1 = exResultInfo.get("maxStr1").toString();
		    	exResultInfo = getMaxValueInfo0_2( chart_0_2 ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
		    	pStr2 = exResultInfo.get("maxTimeNm").toString();

		    	if(pStr1.equals("2147483547%증가")) {
		    		pStr1 = "100%증가";

		    		pStr1 = getTagAddStr(pStr1);
		    		sisa_0 = sisa_0.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2);
		    	} else {

		    		pStr1 = getTagAddStr(pStr1);
		    		sisa_0 = sisa_0.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2);
		    	}
	    	}


//sw.stop();
//System.out.println("0_1->"+sw.getTime());
//sw = new StopWatch();
//sw.start();



	    	// 1-1 성별현황 차트 쿼리
	    	List chart_1_1_new = (List)commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_1_1_new", paramMap); //shopStrdReportService.selectChart_1_1(paramMap);

	    	Map<String, Object> chart_1_1 = (Map)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.selectChart_1_1", paramMap); //shopStrdReportService.selectChart_1_1(paramMap);

	    	if(chart_1_1 == null) {
	    		// "현재 매장은 아직 카메라가 설치 되지 않았거나\n집계정보 생성 전입니다."
	    		model.addAttribute("msg", SystemMsg.getMsg("COM_IFO_0013") );
	    		return "error/error";
	    	}


	    	// 1-1 테이블 데이터
	    	Map<String, Object> tableData_1_1 = new HashMap<String, Object>();
	    	tableData_1_1.put("fCnt", chart_1_1.get("fCnt"));
	    	tableData_1_1.put("mCnt", chart_1_1.get("mCnt"));
	    	tableData_1_1.put("totCnt", Integer.parseInt( chart_1_1.get("fCnt").toString() ) + Integer.parseInt( chart_1_1.get("mCnt").toString() ) + "");

	    	// 1-2 연령대별 현황 쿼리
	    	List chart_1_2 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_1_2", paramMap); //shopStrdReportService.selectChart_1_2(paramMap);


	    	// 1-2 테이블 데이터
	    	Map tableData_1_2 = (Map)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.selectTableData_1_2", paramMap); //shopStrdReportService.selectTableData_1_2(paramMap);

	    	//tableData_1_2.put("per00", Double.parseDouble(String.format("%.2f", Double.parseDouble( tableData_1_2.get("par00").toString() ) ) )+"");
	    	//tableData_1_2.put("per60", Double.parseDouble(String.format("%.2f", Double.parseDouble( tableData_1_2.get("par60").toString() ) ) )+"");

	    	// 시사점 정보 String Make
	    	// 방문고객 중 성별로는 남성(68%)이, 연령대별로는 10대(15%)의 비율이 높았으며,<br /> 성별/연령대별로는 <span class='text_em'>10대 여성</span>의 비중이 가장 높습니다.
	    	String sisa_1_2 = "성별로는 <span class='text_em'>pStr1(pStr2%)</span>이, 연령대별로는 <span class='text_em'>pStr3(pStr4%)</span>의 비율이 높았으며,<br /> 성별/연령대별로는 <span class='text_em'>pStr5 pStr6</span>의 비중이 가장 높았습니다.";

	    	int f_cnt = Integer.parseInt( chart_1_1.get("fCnt").toString() );
	    	int m_cnt = Integer.parseInt( chart_1_1.get("mCnt").toString() );
	    	int tot_cnt = f_cnt + m_cnt ;
	    	pStr1 = "";
	    	pStr2 = "";

	    	if( f_cnt >= m_cnt ) pStr1 = "여성";
	    	else pStr1 = "남성";

	    	if(pStr1.equals("여성")) pStr2 = (int)(((double)f_cnt / (double)tot_cnt) * 100) + "";
	    	else                    pStr2 = (int)(((double)m_cnt / (double)tot_cnt) * 100) + "";

	    	exResultInfo = getMaxValueInfo1( chart_1_2 ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
	    	pStr3 = exResultInfo.get("maxStr").toString();
	    	pStr4 = exResultInfo.get("maxPer").toString().trim();

	    	exResultInfo = getMaxValueInfo2( chart_1_2 ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
	    	pStr5 = exResultInfo.get("maxStr").toString();
	    	pStr6 = exResultInfo.get("maxStr2").toString();
	    	pStr7 = "";
	    	pStr8 = "";
	    	pStr9 = "";
	    	pStr10 = "";

	    	sisa_1_2 = sisa_1_2.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2).replaceFirst("pStr3", pStr3).replaceFirst("pStr4", pStr4).replaceFirst("pStr5", pStr5).replaceFirst("pStr6", pStr6);





//sw.stop();
//System.out.println("1_2->"+sw.getTime());
//sw = new StopWatch();
//sw.start();



	    	// 2-1 성별 / 시간대별 방문 추이
			//List chart_2_1 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_2_1", paramMap); //shopStrdReportService.selectChart_2_1(paramMap);

			//shopstrdreportcpa.selectChart_2_1 쿼리가 느려서 변경함..

			List chart_2_1_time = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_2_1_TimeData", paramMap);

			//List 에서 꺼내면서 shopstrdreportcpa.selectChart_2_1 쿼리의 결과 형태로 묶어준다.
			List chart_2_1 = getChangeData(chart_2_1_time);


//sw.stop();
//System.out.println("2_1쿼리->"+sw.getTime());
//sw = new StopWatch();
//sw.start();


	    	// 시사점 정보 String Make
	    	// 전체 방문고객층은 12시~15시, 여성은 15시~18시,<br />남성은 15시~18시 사이에 가장 많이 방문하셨습니다.
	    	String sisa_2_1 = "전체 객층수는 <span class='text_em'>pStr1</span>, 여성은 <span class='text_em'>pStr2</span>,<br />남성은 <span class='text_em'>pStr3</span> 사이에 가장 많이 방문했습니다.";

	    	exResultInfo = getMaxValueInfo3( chart_2_1 ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
	    	pStr1 = exResultInfo.get("maxStr1").toString();
	    	pStr2 = exResultInfo.get("maxStr2").toString();
	    	pStr3 = exResultInfo.get("maxStr3").toString();
	    	sisa_2_1 = sisa_2_1.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2).replaceFirst("pStr3", pStr3);

//sw.stop();
//System.out.println("2_1시사점->"+sw.getTime());
//sw = new StopWatch();
//sw.start();


	    	// 2-2 연령대별/시간대별 방문 추이
	    	//List chart_2_2 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_2_2", paramMap); //shopStrdReportService.selectChart_2_2(paramMap);


			//shopstrdreportcpa.selectChart_2_2 쿼리가 느려서 변경함..

			List chart_2_2_time = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_2_2_TimeData", paramMap);

			//List 에서 꺼내면서 shopstrdreportcpa.selectChart_2_1 쿼리의 결과 형태로 묶어준다.
			List chart_2_2 = getChangeData2(chart_2_2_time);



//sw.stop();
//System.out.println("2_2쿼리->"+sw.getTime());
//sw = new StopWatch();
//sw.start();



	    	// 시사점 정보 String Make
	    	// 전체 방문고객층은 15시~18시, <span class="text_em">20대</span>가 15시~18시<br />사이에 가장 많이 방문하셨습니다.
	    	String sisa_2_2 = "전체 객층수는 <span class='text_em'>pStr1, pStr2 pStr3</span><br />사이에 가장 많이 방문했습니다.";

	    	exResultInfo = getMaxValueInfo4( chart_2_2 ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
	    	pStr1 = exResultInfo.get("maxStr1").toString();
	    	pStr2 = exResultInfo.get("maxStr2").toString();
	    	pStr3 = exResultInfo.get("maxStr3").toString();
	    	sisa_2_2 = sisa_2_2.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2).replaceFirst("pStr3", pStr3);


//sw.stop();
//System.out.println("2_2시사->"+sw.getTime());
//sw = new StopWatch();
//sw.start();

	    	// 3-1 기준일 대비 전일비교 ( 성별기준 )
	    	paramMap.put("targetDay", paramMap.get("preDay") ); // 전일 기준일
	    	paramMap.put("targetDay2", "D_"+paramMap.get("preDay") ); // 전일 기준일 ( - 붙인거 )

	    	List chart_3_1_1 =  commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_3_1_1", paramMap); // shopStrdReportService.selectChart_3_1_1(paramMap);

	    	// 3-1 기준일 대비 전일비교 ( 연령대기준 )
	    	paramMap.put("targetDay", paramMap.get("preDay") ); // 전일 기준일
	    	paramMap.put("targetDay2", "D_"+paramMap.get("preDay") ); // 전일 기준일 ( - 붙인거 )
	    	List chart_3_1_2 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_3_1_2", paramMap); // shopStrdReportService.selectChart_3_1_2(paramMap);

	    	// 시사점 정보 String Make
	    	// 전일 대비 방문자수는 전체적으로 3%증가하였고,<br />
	    	// 성별로는 남성 비율이  10% 증가, 여성 비율이 5% 감소했습니다.<br />
	    	// 연령대 별로는 10대이하 -5%, 10대 5%, 20대 2%, 30대 12%,<br />
	    	// 40대 2%, 50대 2%, 60대이상 -112%의 증감률을 보였습니다.

	    	/* 시사점 변경전 백업
	    	String sisa_3_1 = ""
	    	 +"총객층수는 전일 대비 pStr1하였고,<br />"
	    	 +"성별로는 여성 비율이 pStr2, 남성 비율이 pStr3했습니다.<br />"
	    	 +"연령대 별로는 10대이하 pStr4, 10대 pStr5, 20대 pStr6, 30대 pStr7,<br />"
	    	 +"40대 pStr8, 50대 pStr9, 60대이상 pStr10의 증감률을 보였습니다.";
	    	exResultInfo = getMaxValueInfo5( chart_3_1_1 , chart_3_1_2  , paramMap.get("nowDate").toString() , paramMap.get("preDay").toString() ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
	    	pStr1 = exResultInfo.get("maxStr1").toString();
	    	pStr2 = exResultInfo.get("maxStr2").toString();
	    	pStr3 = exResultInfo.get("maxStr3").toString();
	    	pStr4 = exResultInfo.get("maxStr4").toString();
	    	pStr5 = exResultInfo.get("maxStr5").toString();
	    	pStr6 = exResultInfo.get("maxStr6").toString();
	    	pStr7 = exResultInfo.get("maxStr7").toString();
	    	pStr8 = exResultInfo.get("maxStr8").toString();
	    	pStr9 = exResultInfo.get("maxStr9").toString();
	    	pStr10 = exResultInfo.get("maxStr10").toString();

	    	sisa_3_1 = sisa_3_1.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2).replaceFirst("pStr3", pStr3).replaceFirst("pStr4", pStr4).replaceFirst("pStr5", pStr5).replaceFirst("pStr6", pStr6).replaceFirst("pStr7", pStr7).replaceFirst("pStr8", pStr8).replaceFirst("pStr9", pStr9).replaceFirst("pStr10", pStr10);
			*/

	    	String sisa_3_1 = ""
	         	 +"총객층수는 전일 대비 pStr1했고,<br />"
	         	 +"성별로는 여성 비율이 pStr2, 남성 비율이 pStr3했습니다.<br />"
	         	 +"가장 변동폭이 큰 연령대는 <span class='text_em'>pStr4</span>(으)로  pStr5했습니다.";


	    	int pre_cnt = 0;
	    	try {
	    		pre_cnt = (Integer)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.selectDaySumCnt", paramMap); //shopStrdReportService.selectDaySumCnt(paramMap);
	    	}catch (Exception e) {
	    		pre_cnt = 0;
	    	}


	    	// 12-10-08 로직 추가..


	    	if(pre_cnt == 0) {
	    		sisa_3_1 = "전일 집계 데이터가 없습니다.";
	    	} else {

	          	exResultInfo = getMaxValueInfo5New( chart_3_1_1 , chart_3_1_2  , paramMap.get("nowDate").toString() , paramMap.get("preDay").toString() ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다

	          	pStr1 = getTagAddStr( exResultInfo.get("maxStr1").toString() );
	          	pStr2 = getTagAddStr( exResultInfo.get("maxStr2").toString() );
	          	pStr3 = getTagAddStr( exResultInfo.get("maxStr3").toString() );
	          	pStr4 = exResultInfo.get("maxStr4").toString();
	          	pStr5 = getTagAddStr(  exResultInfo.get("maxStr5").toString() );

	          	if(pStr1.equals("2147483547%증가")) { // 집계 데이터가 0인경우...

	          		sisa_3_1 = "전일 집계 데이터가 없습니다.";

	          	} else {

	          		if(pStr2.equals("<span class='text_em'>2147483547%증가</span>")) pStr2 = "<span class='text_em'>100%증가</span>";
	          		if(pStr3.equals("<span class='text_em'>2147483547%증가</span>")) pStr3 = "<span class='text_em'>100%증가</span>";
	          		//if(pStr5.equals("<span class='text_em'>2147483547%증가</span>")) pStr5 = "<span class='text_em'>100%증가</span>"; // pStr5의 경우 2147483547 값은 getMaxValueInfo5New 함수 내에서 처리 하므로 주석함..

	          		sisa_3_1 = sisa_3_1.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2).replaceFirst("pStr3", pStr3).replaceFirst("pStr4", pStr4).replaceFirst("pStr5", pStr5);

	          	}

	    	}



//sw.stop();
//System.out.println("3_1->"+sw.getTime());
//sw = new StopWatch();
//sw.start();


	    	// 기준일 대비 전주 동요일을 구한다........
	    	flag = true;
	    	sdf = null;
	    	toDay = null;
	    	preD = null;
	       	String beforeWeekDay = null; // 전주 동요일 기준일.. ( 오늘날짜의 -7 한 날짜가 유일인지를 가져와서 휴일이 아니면 전주 동요일.. 휴일이라면 -1 일이 전주 동요일이다. )
	       	exday = 7;
	    	while( flag ) {
	            sdf = new SimpleDateFormat("yyyyMMdd");
	    		toDay = sdf.parse(dbYmd.get("YYYYMMDD").toString());

	    		preD = CommonUtil.getBeforeDay(toDay, exday );
	    		beforeWeekDay = sdf.format(preD); // exDay 만큼의 전일을 구함..

	    		paramMap.put("targetDay", beforeWeekDay); //
	    		String chk = (String)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.checkWorkYn", paramMap); //shopStrdReportService.checkWorkYn( paramMap ); // 휴일인지를 판별

	        	if( chk == null) {
	        		flag = false; //
	        		paramMap.put("beforeWeekDay", beforeWeekDay); //
	        		paramMap.put("targetDay2", "D_"+paramMap.get("beforeWeekDay") ); //
	        	} else {
	        		exday++;
	        	}
	    	}
	    	//System.out.println("============================================");
	    	//System.out.println("test-->전주동요일은?=="+paramMap.get("beforeWeekDay"));
	    	//System.out.println("============================================");

	    	// 3-2 기준일 대비 전주 동요일 비교 ( 성별기준 )
	    	List chart_3_2_1 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_3_1_1", paramMap); //shopStrdReportService.selectChart_3_1_1(paramMap);

	    	// 3-2 기준일 대비 전주 동요일 비교 ( 연령대기준 )
	    	List chart_3_2_2 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_3_1_2", paramMap); //shopStrdReportService.selectChart_3_1_2(paramMap);


	    	String sisa_3_2 = ""
        	     +"총객층수는 전주 동요일 대비 pStr1했고,<br />"
         	     +"성별로는 여성 비율이 pStr2, 남성 비율이 pStr3했습니다.<br />"
         	     +"가장 변동폭이 큰 연령대는 <span class='text_em'>pStr4</span>(으)로 pStr5했습니다.";

	    	//Object before_cnt_obj = commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.selectDaySumCnt", paramMap);
            //
	    	//int before_cnt = 0;
            //
	    	//if(before_cnt_obj != null) {
	    	//	before_cnt = (Integer)before_cnt_obj;
	    	//}
	    	int before_cnt = 0;
	    	try {
	    		before_cnt = (Integer)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.selectDaySumCnt", paramMap); //shopStrdReportService.selectDaySumCnt(paramMap);
	    	}catch (Exception e) {
	    		before_cnt = 0;
	    	}

	    	if(before_cnt == 0) {
	    		sisa_3_2 = "전주 동요일 집계 데이터가 없습니다.";
	    	} else {
		      	exResultInfo = getMaxValueInfo5New( chart_3_2_1 , chart_3_2_2  , paramMap.get("nowDate").toString() , paramMap.get("beforeWeekDay").toString() ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
	          	pStr1 = getTagAddStr( exResultInfo.get("maxStr1").toString() );
	          	pStr2 = getTagAddStr( exResultInfo.get("maxStr2").toString() );
	          	pStr3 = getTagAddStr( exResultInfo.get("maxStr3").toString() );
	          	pStr4 = exResultInfo.get("maxStr4").toString();
	          	pStr5 = getTagAddStr(  exResultInfo.get("maxStr5").toString() );

	          	if(pStr1.equals("2147483547%증가")) { // 집계 데이터가 0인경우...

	          		sisa_3_2 = "전주 동요일 집계 데이터가 없습니다.";

	          	} else {

	          		if(pStr2.equals("<span class='text_em'>2147483547%증가</span>")) pStr2 = "<span class='text_em'>100%증가</span>";
	          		if(pStr3.equals("<span class='text_em'>2147483547%증가</span>")) pStr3 = "<span class='text_em'>100%증가</span>";
	          		//if(pStr5.equals("<span class='text_em'>2147483547%증가</span>")) pStr5 = "<span class='text_em'>100%증가</span>"; // pStr5의 경우 2147483547 값은 getMaxValueInfo5New 함수 내에서 처리 하므로 주석함..


	          		sisa_3_2 = sisa_3_2.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2).replaceFirst("pStr3", pStr3).replaceFirst("pStr4", pStr4).replaceFirst("pStr5", pStr5);

	          	}

	    	}



//sw.stop();
//System.out.println("3_2->"+sw.getTime());
//sw = new StopWatch();
//sw.start();



	    	// 4-1 설치 위치 별 방문자 현황
	    	List chart_4_1 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_4_1", paramMap); //shopStrdReportService.selectChart_4_1(paramMap);

	    	// 시사점 정보 String Make
	    	// 카메라 위치 별 방문자수는 서문 출입구가 가장 높았으며,<br />여성은 서문, 남성은 서문 출입구의 이용이 높았습니다.
	    	String sisa_4_1 = "매장 별 입장객수는 <span class='text_em'>pStr1</span>(이)가 가장 높았으며, 성별로는<br />여성은 <span class='text_em'>pStr2</span>, 남성은 <span class='text_em'>pStr3</span>의 이용이 높았습니다.";

	    	exResultInfo = getMaxValueInfo6( chart_4_1 ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
	    	pStr1 = exResultInfo.get("maxStr1").toString();
	    	pStr2 = exResultInfo.get("maxStr2").toString();
	    	pStr3 = exResultInfo.get("maxStr3").toString();

	    	sisa_4_1 = sisa_4_1.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2).replaceFirst("pStr3", pStr3);


//sw.stop();
//System.out.println("4_1->"+sw.getTime());
//sw = new StopWatch();
//sw.start();

	    	// 5-1  일자별 추이 (이전 30일)

	    	// 기준일 대비 -30일 을 구한다.. 하지만 중간에 휴일이 끼어있으면 안되고.. 휴일 제외 30일..을 구함.
	    	flag = true;
	    	sdf = null;
	    	toDay = null;
	    	preD = null;
	       	String before30Day = null;
	       	exday = 1;
	       	int DAY_COUNT = 0; //
	    	while( flag ) {
	            sdf = new SimpleDateFormat("yyyyMMdd");
	    		toDay = sdf.parse(dbYmd.get("YYYYMMDD").toString()); // 기준일 구함..

	    		preD = CommonUtil.getBeforeDay(toDay, exday );
	    		before30Day = sdf.format(preD); // 기준일 -1 일을 구함..

	    		paramMap.put("targetDay", before30Day); //
	    		String chk = (String)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.checkWorkYn", paramMap); //shopStrdReportService.checkWorkYn( paramMap ); // 휴일인지를 판별


	        	if( chk == null) {
	        		DAY_COUNT++;
	        	}
	        	exday++;

	        	if(DAY_COUNT == 31) {
	        		flag = false; // 휴일이 아니면.. preDay과 전일 기준일이 된다.
	        		paramMap.put("before30Day", before30Day); //
	        	}
	    	}

	    	List chart_5_1 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_5_1", paramMap); //shopStrdReportService.selectChart_5_1(paramMap);

	    	System.out.println("============================================");
	    	System.out.println("test-->기준일 대비 휴일 제외 - 30일인 날짜는 ?=="+paramMap.get("before30Day"));
	    	System.out.println("============================================");


//sw.stop();
//System.out.println("5_1->"+sw.getTime());
//sw = new StopWatch();
//sw.start();


	    	// 각각의 차트를 JSON 형태로 변환
	    	String data_chart_0_1 = CommonUtil.getJsonFromListEgovMap(chart_0_1);
	    	String data_chart_0_2 = CommonUtil.getJsonFromListEgovMap(chart_0_2);
	    	String data_chart_1_1 = "["+CommonUtil.getJsonFromMap(chart_1_1)+"]";
	    	String data_chart_1_1_new = CommonUtil.getJsonFromListEgovMap(chart_1_1_new);

	    	String data_chart_1_2 = CommonUtil.getJsonFromListEgovMap(chart_1_2);
	    	String data_chart_2_1 = CommonUtil.getJsonFromListEgovMap(chart_2_1);
	    	String data_chart_2_2 = CommonUtil.getJsonFromListEgovMap(chart_2_2);
	    	String data_chart_3_1_1 = CommonUtil.getJsonFromListEgovMap(chart_3_1_1);
	    	String data_chart_3_1_2 = CommonUtil.getJsonFromListEgovMap(chart_3_1_2);
	    	String data_chart_3_2_1 = CommonUtil.getJsonFromListEgovMap(chart_3_2_1);
	    	String data_chart_3_2_2 = CommonUtil.getJsonFromListEgovMap(chart_3_2_2);
	    	String data_chart_4_1 = CommonUtil.getJsonFromListEgovMap(chart_4_1);
	    	String data_chart_5_1 = CommonUtil.getJsonFromListEgovMap(chart_5_1);

	    	//System.out.println("-----test--------------------------");
	    	//System.out.println("data_chart_1_1->"+data_chart_1_1);
	    	//System.out.println("data_chart_1_2->"+data_chart_1_2);
	    	//System.out.println("data_chart_2_1->"+data_chart_2_1);


	    	model.addAttribute("data_chart_0_1", data_chart_0_1);
	    	model.addAttribute("data_chart_0_2", data_chart_0_2);
	    	model.addAttribute("data_chart_1_1", data_chart_1_1);
	    	model.addAttribute("data_chart_1_1_new", data_chart_1_1_new);
	    	model.addAttribute("tableData_1_1", tableData_1_1);
	    	model.addAttribute("data_chart_1_2", data_chart_1_2);
	    	model.addAttribute("tableData_1_2", tableData_1_2);
	    	model.addAttribute("data_chart_2_1", data_chart_2_1);
	    	model.addAttribute("data_chart_2_2", data_chart_2_2);
	    	model.addAttribute("data_chart_3_1_1", data_chart_3_1_1);
	    	model.addAttribute("data_chart_3_1_2", data_chart_3_1_2);
	    	model.addAttribute("data_chart_3_2_1", data_chart_3_2_1);
	    	model.addAttribute("data_chart_3_2_2", data_chart_3_2_2);
	    	model.addAttribute("data_chart_4_1", data_chart_4_1);
	    	model.addAttribute("data_chart_5_1", data_chart_5_1);


	    	model.addAttribute("sisa_0", sisa_0);
	    	model.addAttribute("sisa_1_2", sisa_1_2);
	    	model.addAttribute("sisa_2_1", sisa_2_1);
	    	model.addAttribute("sisa_2_2", sisa_2_2);
	    	model.addAttribute("sisa_3_1", sisa_3_1);
	    	model.addAttribute("sisa_3_2", sisa_3_2);
	    	model.addAttribute("sisa_4_1", sisa_4_1);


	    	model.addAttribute("nowDateInfo", dbYmd ); // 오늘 날짜 정보 (요일포함)
	    	Map preYmd = commonService.getDbYmdCustom(preDay);
	    	model.addAttribute("preDateInfo" , preYmd); // 전일 기준일 정보 (요일포함)
	    	Map beforeWeekYmd = commonService.getDbYmdCustom(beforeWeekDay);
	    	model.addAttribute("beforeWeekDateInfo" , beforeWeekYmd); // 전주 동요일 정보 (요일포함)


//sw.stop();
//System.out.println("::::::::->"+sw.getTime());



        }catch(Exception e){
            e.printStackTrace();
            //view.addObject("success", false);
            //view.addObject("message", PtmsUtils.getExceptionMsg(e));
        }finally {
            try{
            	commonDAO.getSqlMapClient().endTransaction();
            }catch(Exception err){
                err.printStackTrace();
            }
        }



    	return "cus/fad/fcas_shop_strd_report_002";
    }

    public Map getMaxValueInfo0_1(List listData) {
    	Map resultMap = new HashMap();



    	Map preMap = null;
    	preMap = (EgovMap)listData.get(0);
    	Map toDayMap = null;
    	toDayMap = (EgovMap)listData.get(1);

    	int preDayValue = Integer.parseInt( preMap.get("sumCnt").toString() );
    	int toDayValue  = Integer.parseInt( toDayMap.get("sumCnt").toString() );

    	String maxStr1 = "";
    	// 비율을 계산한다.
		if(preDayValue <= toDayValue ) {
			maxStr1 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100 +"%증가";
		} else {
			maxStr1 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
		}

    	resultMap.put("maxStr1", maxStr1);

    	return resultMap;
    }


    public Map getMaxValueInfo0_2(List listData) {
    	Map resultMap = new HashMap();

    	int cnt = 0;
    	int copy_cnt = 0;

    	String timeNm = "";

    	Map map = null;

    	for(int i = 0; i < listData.size() ; i ++) {

    		map = (EgovMap)listData.get(i);

    		cnt = Integer.parseInt( map.get("cnt").toString() );

    		if(copy_cnt <= cnt) {
    			copy_cnt = cnt;
        		timeNm = map.get("time").toString();
    		}

    	}

    	resultMap.put("maxTimeNm", timeNm);


    	return resultMap;
    }

    public Map getMaxValueInfo1(List listData) {
    	Map resultMap = new HashMap();

    	String maxStr = "";
    	int maxValue = 0;
    	int copyValue = 0;

    	int all_tot_Cnt = 0;

    	String age_Str = "";

    	Map map = null;
    	for(int i = 0; i < listData.size() ; i ++) {

    		map = (EgovMap)listData.get(i);

    		copyValue = Integer.parseInt( map.get("fMTot").toString() );
    		all_tot_Cnt += copyValue;
    		age_Str = map.get("ageNm").toString();


    		if(maxValue <= copyValue) {
    			maxValue = copyValue;
    			maxStr = age_Str;
    		}
    	}

    	resultMap.put("maxPer", (int)((  (double)maxValue / (double)all_tot_Cnt ) * 100 ) + " " );
    	resultMap.put("maxValue", maxValue);
    	resultMap.put("maxStr", maxStr);

    	return resultMap;
    }



    public Map getMaxValueInfo2(List listData) {
    	Map resultMap = new HashMap();

    	String maxStr2 = "";
    	String maxStr = "";
    	String fm_max_str = "";
    	int maxValue = 0;
    	int copyValue = 0;

    	int f_Cnt = 0;
    	int m_Cnt = 0;
    	String age_Str = "";

    	Map map = null;
    	for(int i = 0; i < listData.size() ; i ++) {

    		map = (EgovMap)listData.get(i);

    		f_Cnt = Integer.parseInt( map.get("fCnt").toString() );
    		m_Cnt = Integer.parseInt( map.get("mCnt").toString() );
    		age_Str = map.get("ageNm").toString();

    		// 두수중 큰수를 copyValue 에 넣는다.
    		if( f_Cnt >= m_Cnt ) {
    			copyValue = f_Cnt;
    			fm_max_str = "여성";
    		} else {
    			copyValue = m_Cnt;
    			fm_max_str = "남성";
    		}

    		if(maxValue <= copyValue) {
    			maxValue = copyValue;
    			maxStr = age_Str;
    			maxStr2 = fm_max_str;
    		}
    	}

    	resultMap.put("maxValue", maxValue);
    	resultMap.put("maxStr", maxStr);
    	resultMap.put("maxStr2", maxStr2);

    	return resultMap;
    }


    public Map getMaxValueInfo3(List listData) {
    	Map resultMap = new HashMap();

    	String maxStr1 = "";
    	String maxStr2 = "";
    	String maxStr3 = "";

    	int maxValue1 = 0; // 토탈 최대 값
    	int maxValue2 = 0; // 남성 최대 값
    	int maxValue3 = 0; // 여성 최대 값

    	int f_Cnt = 0;
    	int m_Cnt = 0;
    	int plus_fm_Cnt = 0;
    	String timeStr = "";

    	Map map = null;
    	for(int i = 0; i < listData.size() ; i ++) {

    		map = (EgovMap)listData.get(i);

    		f_Cnt = Integer.parseInt( map.get("fCnt").toString() );
    		m_Cnt = Integer.parseInt( map.get("mCnt").toString() );
    		plus_fm_Cnt = f_Cnt + m_Cnt;
    		timeStr = map.get("time").toString();

    		if(maxValue1 <= plus_fm_Cnt) {
    			maxValue1 = plus_fm_Cnt;
    			maxStr1 = timeStr;
    		}
    		if(maxValue2 <= f_Cnt) {
    			maxValue2 = f_Cnt;
    			maxStr2 = timeStr;
    		}
    		if(maxValue3 <= m_Cnt) {
    			maxValue3 = m_Cnt;
    			maxStr3 = timeStr;
    		}
    	}

    	resultMap.put("maxValue1", maxValue1);
    	resultMap.put("maxStr1", maxStr1);
    	resultMap.put("maxValue2", maxValue2);
    	resultMap.put("maxStr2", maxStr2);
    	resultMap.put("maxValue3", maxValue3);
    	resultMap.put("maxStr3", maxStr3);


    	return resultMap;
    }


    public Map getMaxValueInfo4(List listData) {
    	Map resultMap = new HashMap();

    	String maxStr1 = "";
    	String maxStr2 = "";
    	String maxStr3 = "";

    	int maxValue1 = 0;
    	int maxValue2 = 0;

    	int c_00_Cnt = 0;
    	int c_10_Cnt = 0;
    	int c_20_Cnt = 0;
    	int c_30_Cnt = 0;
    	int c_40_Cnt = 0;
    	int c_50_Cnt = 0;
    	int c_60_Cnt = 0;

    	int plus_all_Cnt = 0;
    	String timeStr = "";

    	Map map = null;
    	int[] valueArr = new int[7];
    	int grpMax = 0;
    	int ageChkVal = 0;

    	for(int i = 0; i < listData.size() ; i ++) {

    		map = (EgovMap)listData.get(i);

    		c_00_Cnt = Integer.parseInt( map.get("c00Cnt").toString() );
    		c_10_Cnt = Integer.parseInt( map.get("c10Cnt").toString() );
    		c_20_Cnt = Integer.parseInt( map.get("c20Cnt").toString() );
    		c_30_Cnt = Integer.parseInt( map.get("c30Cnt").toString() );
    		c_40_Cnt = Integer.parseInt( map.get("c40Cnt").toString() );
    		c_50_Cnt = Integer.parseInt( map.get("c50Cnt").toString() );
    		c_60_Cnt = Integer.parseInt( map.get("c60Cnt").toString() );

    		plus_all_Cnt = c_00_Cnt + c_10_Cnt + c_20_Cnt+ c_30_Cnt + c_40_Cnt + c_50_Cnt + c_60_Cnt;

    		timeStr = map.get("time").toString();

    		// int 변수들중 가장 큰수를 copyValue 에 넣는다.
    		valueArr[0] = c_00_Cnt;
    		valueArr[1] = c_10_Cnt;
    		valueArr[2] = c_20_Cnt;
    		valueArr[3] = c_30_Cnt;
    		valueArr[4] = c_40_Cnt;
    		valueArr[5] = c_50_Cnt;
    		valueArr[6] = c_60_Cnt;
    		int k = 0;
    		for(k = 0; k < valueArr.length ; k++){
    			if(grpMax <= valueArr[k] ) {
    			  grpMax = valueArr[k];
    			  ageChkVal = k;
    			  maxStr3 = timeStr;
    			}
    		}

    		// 시간대별 방문객 수 최대값을 구함.
    		if( maxValue2 <= grpMax ) {
    			maxValue2 = grpMax;
    			if(ageChkVal == 0) maxStr2 = "10대 이하가";
    			else if(ageChkVal == 1) maxStr2 = "10대가";
    			else if(ageChkVal == 2) maxStr2 = "20대가";
    			else if(ageChkVal == 3) maxStr2 = "30대가";
    			else if(ageChkVal == 4) maxStr2 = "40대가";
    			else if(ageChkVal == 5) maxStr2 = "50대가";
    			else if(ageChkVal == 6) maxStr2 = "60대 이상이";
    		}

    		// 전체 방문객 중 최대값과 시간대str을 구함
    		if(maxValue1 <= plus_all_Cnt) {
    			maxValue1 = plus_all_Cnt;
    			maxStr1 = timeStr;
    		}

    	}

    	resultMap.put("maxStr1", maxStr1); // 전체 방문고객 "~시"
    	resultMap.put("maxStr2", maxStr2); // xx대가..
    	resultMap.put("maxStr3", maxStr3); // 연령대별 방문고객 "~시"


    	return resultMap;
    }


    public Map getMaxValueInfo5(List sexlistData , List agelistData , String toDay , String preDay ) {
    	Map resultMap = new HashMap();

    	String maxStr1 = ""; // 전일 대비 방문자 증감치
    	String maxStr2 = ""; // 전일 대비 여성 방문자 증감치
    	String maxStr3 = ""; // 전일 대비 남성 방문자 증감치

    	String grpStr = "";

    	int toDayValue  = 0;
    	int preDayValue = 0;

    	Map map = null;

    	for(int i = 0; i < sexlistData.size() ; i ++) {

    		map = (EgovMap)sexlistData.get(i);

    		grpStr = map.get( "cNm" ).toString();
    		preDayValue = Integer.parseInt( map.get( preDay ).toString() );
    		toDayValue = Integer.parseInt( map.get( toDay ).toString() );

    		// 값을 계산한다.
    		if(grpStr.equals("전체")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr1 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100 +"%증가";
    			} else {
    				maxStr1 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}else if(grpStr.equals("여자")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr2 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"%증가";
    			} else {
    				maxStr2 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}else if(grpStr.equals("남자")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr3 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"%증가";
    			} else {
    				maxStr3 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}

    	}

    	String maxStr4 = ""; // 10대 이하
    	String maxStr5 = ""; // 10대
    	String maxStr6 = ""; // 20대
    	String maxStr7 = ""; // 30대
    	String maxStr8 = ""; // 40대
    	String maxStr9 = ""; // 50대
    	String maxStr10 = ""; // 60대 이상

    	for(int i = 0; i < agelistData.size() ; i ++) {

    		map = (EgovMap)agelistData.get(i);

    		grpStr = map.get( "cNm" ).toString();
    		preDayValue = Integer.parseInt( map.get( preDay ).toString() );
    		toDayValue = Integer.parseInt( map.get( toDay ).toString() );

    		// 값을 계산한다.
    		if(grpStr.equals("10대이하")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr4 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100 +"%증가";
    			} else {
    				maxStr4 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}else if(grpStr.equals("10대")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr5 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"%증가";
    			} else {
    				maxStr5 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}else if(grpStr.equals("20대")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr6 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"%증가";
    			} else {
    				maxStr6 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}else if(grpStr.equals("30대")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr7 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"%증가";
    			} else {
    				maxStr7 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}else if(grpStr.equals("40대")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr8 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"%증가";
    			} else {
    				maxStr8 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}else if(grpStr.equals("50대")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr9 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"%증가";
    			} else {
    				maxStr9 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}else if(grpStr.equals("60대이상")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr10 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"%증가";
    			} else {
    				maxStr10 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}

    	}

    	resultMap.put("maxStr1", maxStr1);
    	resultMap.put("maxStr2", maxStr2);
    	resultMap.put("maxStr3", maxStr3);
    	resultMap.put("maxStr4", maxStr4);
    	resultMap.put("maxStr5", maxStr5);
    	resultMap.put("maxStr6", maxStr6);
    	resultMap.put("maxStr7", maxStr7);
    	resultMap.put("maxStr8", maxStr8);
    	resultMap.put("maxStr9", maxStr9);
    	resultMap.put("maxStr10", maxStr10);



    	return resultMap;
    }


    public Map getMaxValueInfo5New(List sexlistData , List agelistData , String toDay , String preDay ) {
    	Map resultMap = new HashMap();

    	String maxStr1 = ""; // 전일 대비 방문자 증감치
    	String maxStr2 = ""; // 전일 대비 여성 방문자 증감치
    	String maxStr3 = ""; // 전일 대비 남성 방문자 증감치

    	String grpStr = "";

    	int toDayValue  = 0;
    	int preDayValue = 0;

    	Map map = null;

    	for(int i = 0; i < sexlistData.size() ; i ++) {

    		map = (EgovMap)sexlistData.get(i);

    		grpStr = map.get( "cNm" ).toString();


    		preDayValue = Integer.parseInt( map.get( "d"+preDay ).toString() );
    		toDayValue = Integer.parseInt( map.get( "d"+toDay ).toString() );


    		// 값을 계산한다.
    		if(grpStr.equals("전체")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr1 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100 +"%증가";
    			} else {
    				maxStr1 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}else if(grpStr.equals("여자")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr2 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"%증가";
    			} else {
    				maxStr2 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}else if(grpStr.equals("남자")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr3 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"%증가";
    			} else {
    				maxStr3 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}

    	}

    	String maxStr4 = ""; // 10대 이하
    	String maxStr5 = ""; // 10대
    	String maxStr6 = ""; // 20대
    	String maxStr7 = ""; // 30대
    	String maxStr8 = ""; // 40대
    	String maxStr9 = ""; // 50대
    	String maxStr10 = ""; // 60대 이상

    	List ll = new ArrayList();
    	Map ll_map = null;
    	for(int i = 0; i < agelistData.size() ; i ++) {

    		map = (EgovMap)agelistData.get(i);

    		grpStr = map.get( "cNm" ).toString();
    		preDayValue = Integer.parseInt( map.get( "d"+preDay ).toString() );
    		toDayValue = Integer.parseInt( map.get( "d"+toDay ).toString() );


    		// 값을 계산한다.
    		ll_map = new HashMap();
    		if(grpStr.equals("10대이하")) {
    			maxStr4 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"";
    			ll_map.put("cnt", maxStr4 );
    			ll_map.put("str", grpStr );
    			ll.add(ll_map);
    		}else if(grpStr.equals("10대")) {
    			maxStr5 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"";
    			ll_map.put("cnt", maxStr5 );
    			ll_map.put("str", grpStr );
    			ll.add(ll_map);
    		}else if(grpStr.equals("20대")) {
    			maxStr6 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"";
    			ll_map.put("cnt", maxStr6 );
    			ll_map.put("str", grpStr );
    			ll.add(ll_map);
    		}else if(grpStr.equals("30대")) {
    			maxStr7 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"";
    			ll_map.put("cnt", maxStr7 );
    			ll_map.put("str", grpStr );
    			ll.add(ll_map);
    		}else if(grpStr.equals("40대")) {
    			maxStr8 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"";
    			ll_map.put("cnt", maxStr8 );
    			ll_map.put("str", grpStr );
    			ll.add(ll_map);
    		}else if(grpStr.equals("50대")) {
    			maxStr9 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"";
    			ll_map.put("cnt", maxStr9 );
    			ll_map.put("str", grpStr );
    			ll.add(ll_map);
    		}else if(grpStr.equals("60대이상")) {
    			maxStr10 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"";
    			ll_map.put("cnt", maxStr10 );
    			ll_map.put("str", grpStr );
    			ll.add(ll_map);
    		}
    	}


    	String max_string = "";
    	String max_string2 = "";
    	int max_cnt  = 0;
    	int abs_max_cnt  = 0;
    	int copy_cnt = 0;
    	int abs_cnt = 0;

    	for(int i = 0; i < ll.size() ; i ++) {
    		map = (HashMap)ll.get(i);

    		copy_cnt = Integer.parseInt( map.get("cnt").toString() );
    		abs_cnt  = Math.abs( Integer.parseInt( map.get("cnt").toString() ) );
    		// 절대값으로 증감치가 가장 큰폭을 찾음.
    		// 단 2147483547%증가 일 경우에는 최대값에서 제외한다...
    		if(abs_cnt != 2147483547 && max_cnt <= abs_cnt) {
    			abs_max_cnt = abs_cnt;
    			max_cnt = copy_cnt;
    			max_string = map.get("str").toString();
    		}

    	}





    	resultMap.put("maxStr1", maxStr1);
    	resultMap.put("maxStr2", maxStr2);
    	resultMap.put("maxStr3", maxStr3);

    	if(max_cnt >= 0) {
    		max_string2 = abs_max_cnt+"%증가";
    	}else {
    		max_string2 = abs_max_cnt+"%감소";
    	}

    	resultMap.put("maxStr4", max_string);
    	resultMap.put("maxStr5", max_string2);


    	//resultMap.put("maxStr4", maxStr4);
    	//resultMap.put("maxStr5", maxStr5);
    	//resultMap.put("maxStr6", maxStr6);
    	//resultMap.put("maxStr7", maxStr7);
    	//resultMap.put("maxStr8", maxStr8);
    	//resultMap.put("maxStr9", maxStr9);
    	//resultMap.put("maxStr10", maxStr10);



    	return resultMap;
    }

    public Map getMaxValueInfo5NewRex(List sexlistData , List agelistData , String toDay , String preDay ) {
    	Map resultMap = new HashMap();

    	String maxStr1 = ""; // 전일 대비 방문자 증감치
    	String maxStr2 = ""; // 전일 대비 여성 방문자 증감치
    	String maxStr3 = ""; // 전일 대비 남성 방문자 증감치

    	String grpStr = "";

    	int toDayValue  = 0;
    	int preDayValue = 0;

    	Map map = null;

    	for(int i = 0; i < sexlistData.size() ; i ++) {

    		map = (EgovMap)sexlistData.get(i);

    		grpStr = map.get( "cNm" ).toString();


    		preDayValue = Integer.parseInt( map.get( "bDay" ).toString() );
    		toDayValue = Integer.parseInt( map.get( "sDay" ).toString() );


    		// 값을 계산한다.
    		if(grpStr.equals("전체")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr1 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100 +"%증가";
    			} else {
    				maxStr1 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}else if(grpStr.equals("여자")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr2 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"%증가";
    			} else {
    				maxStr2 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}else if(grpStr.equals("남자")) {
    			if(preDayValue <= toDayValue ) {
    				maxStr3 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"%증가";
    			} else {
    				maxStr3 = 100 - ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) )+"%감소";
    			}
    		}

    	}

    	String maxStr4 = ""; // 10대 이하
    	String maxStr5 = ""; // 10대
    	String maxStr6 = ""; // 20대
    	String maxStr7 = ""; // 30대
    	String maxStr8 = ""; // 40대
    	String maxStr9 = ""; // 50대
    	String maxStr10 = ""; // 60대 이상

    	List ll = new ArrayList();
    	Map ll_map = null;
    	for(int i = 0; i < agelistData.size() ; i ++) {

    		map = (EgovMap)agelistData.get(i);

    		grpStr = map.get( "cNm" ).toString();
    		preDayValue = Integer.parseInt( map.get( "bDay" ).toString() );
    		toDayValue = Integer.parseInt( map.get( "sDay" ).toString() );


    		// 값을 계산한다.
    		ll_map = new HashMap();
    		if(grpStr.equals("10대이하")) {
    			maxStr4 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"";
    			ll_map.put("cnt", maxStr4 );
    			ll_map.put("str", grpStr );
    			ll.add(ll_map);
    		}else if(grpStr.equals("10대")) {
    			maxStr5 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"";
    			ll_map.put("cnt", maxStr5 );
    			ll_map.put("str", grpStr );
    			ll.add(ll_map);
    		}else if(grpStr.equals("20대")) {
    			maxStr6 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"";
    			ll_map.put("cnt", maxStr6 );
    			ll_map.put("str", grpStr );
    			ll.add(ll_map);
    		}else if(grpStr.equals("30대")) {
    			maxStr7 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"";
    			ll_map.put("cnt", maxStr7 );
    			ll_map.put("str", grpStr );
    			ll.add(ll_map);
    		}else if(grpStr.equals("40대")) {
    			maxStr8 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"";
    			ll_map.put("cnt", maxStr8 );
    			ll_map.put("str", grpStr );
    			ll.add(ll_map);
    		}else if(grpStr.equals("50대")) {
    			maxStr9 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"";
    			ll_map.put("cnt", maxStr9 );
    			ll_map.put("str", grpStr );
    			ll.add(ll_map);
    		}else if(grpStr.equals("60대이상")) {
    			maxStr10 = ((int)( ( (double)toDayValue / (double)preDayValue ) * 100 ) ) - 100+"";
    			ll_map.put("cnt", maxStr10 );
    			ll_map.put("str", grpStr );
    			ll.add(ll_map);
    		}
    	}


    	String max_string = "";
    	String max_string2 = "";
    	int max_cnt  = 0;
    	int abs_max_cnt  = 0;
    	int copy_cnt = 0;
    	int abs_cnt = 0;

    	for(int i = 0; i < ll.size() ; i ++) {
    		map = (HashMap)ll.get(i);

    		copy_cnt = Integer.parseInt( map.get("cnt").toString() );
    		abs_cnt  = Math.abs( Integer.parseInt( map.get("cnt").toString() ) );
    		// 절대값으로 증감치가 가장 큰폭을 찾음.
    		// 단 2147483547%증가 일 경우에는 최대값에서 제외한다...
    		if(abs_cnt != 2147483547 && max_cnt <= abs_cnt) {
    			abs_max_cnt = abs_cnt;
    			max_cnt = copy_cnt;
    			max_string = map.get("str").toString();
    		}

    	}





    	resultMap.put("maxStr1", maxStr1);
    	resultMap.put("maxStr2", maxStr2);
    	resultMap.put("maxStr3", maxStr3);

    	if(max_cnt >= 0) {
    		max_string2 = abs_max_cnt+"%증가";
    	}else {
    		max_string2 = abs_max_cnt+"%감소";
    	}

    	resultMap.put("maxStr4", max_string);
    	resultMap.put("maxStr5", max_string2);


    	//resultMap.put("maxStr4", maxStr4);
    	//resultMap.put("maxStr5", maxStr5);
    	//resultMap.put("maxStr6", maxStr6);
    	//resultMap.put("maxStr7", maxStr7);
    	//resultMap.put("maxStr8", maxStr8);
    	//resultMap.put("maxStr9", maxStr9);
    	//resultMap.put("maxStr10", maxStr10);



    	return resultMap;
    }


    public Map getMaxValueInfo6(List listData) {
    	Map resultMap = new HashMap();

    	String maxStr1 = ""; // 전체 출입구
    	String maxStr2 = ""; // 여성이 이용한 출입구
    	String maxStr3 = ""; // 남성이 이용한 출입구

    	int maxValue1 = 0;
    	int maxValue2 = 0;
    	int maxValue3 = 0;

    	int f_Cnt = 0;
    	int m_Cnt = 0;
    	int plus_all_Cnt = 0;

    	String cmraGrpNm = "";

    	Map map = null;

    	for(int i = 0; i < listData.size() ; i ++) {

    		map = (EgovMap)listData.get(i);

    		f_Cnt = Integer.parseInt( map.get("fCnt").toString() );
    		m_Cnt = Integer.parseInt( map.get("mCnt").toString() );

    		plus_all_Cnt = Integer.parseInt( map.get("allEnterCnt").toString() );

    		cmraGrpNm = map.get("cmraGrpNm").toString();

    		// 전체 방문객 중 가장 많이 사용한 카메라 를 구함.
    		if(maxValue1 <= plus_all_Cnt) {
    			maxValue1 = plus_all_Cnt;
    			maxStr1 = cmraGrpNm;
    		}

    		// 전체 방문객 중 가장 많이 사용한 카메라 를 구함.
    		if(maxValue2 <= f_Cnt) {
    			maxValue2 = f_Cnt;
    			maxStr2 = cmraGrpNm;
    		}

    		// 전체 방문객 중 가장 많이 사용한 카메라 를 구함.
    		if(maxValue3 <= m_Cnt) {
    			maxValue3 = m_Cnt;
    			maxStr3 = cmraGrpNm;
    		}

    	}

    	resultMap.put("maxStr1", maxStr1); // 전체 출입구
    	resultMap.put("maxStr2", maxStr2); // 여성이 이용한 출입구
    	resultMap.put("maxStr3", maxStr3); // 남성이 이용한 출입구


    	return resultMap;
    }




    public List getChangeData(List listData) {
    	List resultList = new ArrayList();

		Map map = new HashMap();

    	String row_TimeCd = "";
    	int row_fCnt = 0;
    	int row_mCnt = 0;

    	int sum_0609_fCnt = 0;
    	int sum_0609_mCnt = 0;
    	int sum_0912_fCnt = 0;
    	int sum_0912_mCnt = 0;
    	int sum_1215_fCnt = 0;
    	int sum_1215_mCnt = 0;
    	int sum_1518_fCnt = 0;
    	int sum_1518_mCnt = 0;
    	int sum_1821_fCnt = 0;
    	int sum_1821_mCnt = 0;
    	int sum_2124_fCnt = 0;
    	int sum_2124_mCnt = 0;
    	int sum_2403_fCnt = 0;
    	int sum_2403_mCnt = 0;
    	int sum_0306_fCnt = 0;
    	int sum_0306_mCnt = 0;


    	for(int i = 0; i < listData.size(); i++) {

    		map = (EgovMap)listData.get(i);

    		row_fCnt = Integer.parseInt( map.get("fCnt").toString() );
    		row_mCnt = Integer.parseInt( map.get("mCnt").toString() );

    		if( map.get("timeCd").toString().equals("07") ||  map.get("timeCd").toString().equals("08") ||  map.get("timeCd").toString().equals("09") ) {
    			sum_0609_fCnt += row_fCnt;
    			sum_0609_mCnt += row_mCnt;
    		} else if( map.get("timeCd").toString().equals("10") ||  map.get("timeCd").toString().equals("11") ||  map.get("timeCd").toString().equals("12") ) {
    			sum_0912_fCnt += row_fCnt;
    			sum_0912_mCnt += row_mCnt;
    		} else if( map.get("timeCd").toString().equals("13") ||  map.get("timeCd").toString().equals("14") ||  map.get("timeCd").toString().equals("15") ) {
    			sum_1215_fCnt += row_fCnt;
    			sum_1215_mCnt += row_mCnt;
    		} else if( map.get("timeCd").toString().equals("16") ||  map.get("timeCd").toString().equals("17") ||  map.get("timeCd").toString().equals("18") ) {
    			sum_1518_fCnt += row_fCnt;
    			sum_1518_mCnt += row_mCnt;
    		} else if( map.get("timeCd").toString().equals("19") ||  map.get("timeCd").toString().equals("20") ||  map.get("timeCd").toString().equals("21") ) {
    			sum_1821_fCnt += row_fCnt;
    			sum_1821_mCnt += row_mCnt;
    		} else if( map.get("timeCd").toString().equals("22") ||  map.get("timeCd").toString().equals("23") ||  map.get("timeCd").toString().equals("24") ) {
    			sum_2124_fCnt += row_fCnt;
    			sum_2124_mCnt += row_mCnt;
    		} else if( map.get("timeCd").toString().equals("01") ||  map.get("timeCd").toString().equals("02") ||  map.get("timeCd").toString().equals("03") ) {
    			sum_2403_fCnt += row_fCnt;
    			sum_2403_mCnt += row_mCnt;
    		} else if( map.get("timeCd").toString().equals("04") ||  map.get("timeCd").toString().equals("05") ||  map.get("timeCd").toString().equals("06") ) {
    			sum_0306_fCnt += row_fCnt;
    			sum_0306_mCnt += row_mCnt;
    		}

    	}

    	// 집계 누적 후.. 각각 Map 에 저장후 리스트에 add


    	Map inputMap = new EgovMap();

		inputMap.put("time" , "21시~24시");
		inputMap.put("fCnt" , sum_2124_fCnt);
		inputMap.put("mCnt" , sum_2124_mCnt);

		resultList.add(inputMap);

		inputMap = new EgovMap();
		inputMap.put("time" , "18시~21시");
		inputMap.put("fCnt" , sum_1821_fCnt);
		inputMap.put("mCnt" , sum_1821_mCnt);

		resultList.add(inputMap);

		inputMap = new EgovMap();
		inputMap.put("time" , "15시~18시");
		inputMap.put("fCnt" , sum_1518_fCnt);
		inputMap.put("mCnt" , sum_1518_mCnt);

		resultList.add(inputMap);

		inputMap = new EgovMap();
		inputMap.put("time" , "12시~15시");
		inputMap.put("fCnt" , sum_1215_fCnt);
		inputMap.put("mCnt" , sum_1215_mCnt);

		resultList.add(inputMap);

		inputMap = new EgovMap();
		inputMap.put("time" , "09시~12시");
		inputMap.put("fCnt" , sum_0912_fCnt);
		inputMap.put("mCnt" , sum_0912_mCnt);

		resultList.add(inputMap);

		inputMap = new EgovMap();
		inputMap.put("time" , "06시~09시");
		inputMap.put("fCnt" , sum_0609_fCnt);
		inputMap.put("mCnt" , sum_0609_mCnt);

		resultList.add(inputMap);

		inputMap = new EgovMap();
		inputMap.put("time" , "03시~06시");
		inputMap.put("fCnt" , sum_0306_fCnt);
		inputMap.put("mCnt" , sum_0306_mCnt);

		resultList.add(inputMap);

		inputMap = new EgovMap();
		inputMap.put("time" , "00시~03시"); // 24 ~ 30
		inputMap.put("fCnt" , sum_2403_fCnt);
		inputMap.put("mCnt" , sum_2403_mCnt);

		resultList.add(inputMap);


    	return resultList;
    }



    public List getChangeData2(List listData) {
    	List resultList = new ArrayList();

		Map map = new HashMap();

    	String row_TimeCd = "";
    	int row_00Cnt = 0;
    	int row_10Cnt = 0;
    	int row_20Cnt = 0;
    	int row_30Cnt = 0;
    	int row_40Cnt = 0;
    	int row_50Cnt = 0;
    	int row_60Cnt = 0;

    	int sum_0609_00Cnt = 0;
    	int sum_0609_10Cnt = 0;
    	int sum_0609_20Cnt = 0;
    	int sum_0609_30Cnt = 0;
    	int sum_0609_40Cnt = 0;
    	int sum_0609_50Cnt = 0;
    	int sum_0609_60Cnt = 0;

    	int sum_0912_00Cnt = 0;
    	int sum_0912_10Cnt = 0;
    	int sum_0912_20Cnt = 0;
    	int sum_0912_30Cnt = 0;
    	int sum_0912_40Cnt = 0;
    	int sum_0912_50Cnt = 0;
    	int sum_0912_60Cnt = 0;

    	int sum_1215_00Cnt = 0;
    	int sum_1215_10Cnt = 0;
    	int sum_1215_20Cnt = 0;
    	int sum_1215_30Cnt = 0;
    	int sum_1215_40Cnt = 0;
    	int sum_1215_50Cnt = 0;
    	int sum_1215_60Cnt = 0;


    	int sum_1518_00Cnt = 0;
    	int sum_1518_10Cnt = 0;
    	int sum_1518_20Cnt = 0;
    	int sum_1518_30Cnt = 0;
    	int sum_1518_40Cnt = 0;
    	int sum_1518_50Cnt = 0;
    	int sum_1518_60Cnt = 0;


    	int sum_1821_00Cnt = 0;
    	int sum_1821_10Cnt = 0;
    	int sum_1821_20Cnt = 0;
    	int sum_1821_30Cnt = 0;
    	int sum_1821_40Cnt = 0;
    	int sum_1821_50Cnt = 0;
    	int sum_1821_60Cnt = 0;


    	int sum_2124_00Cnt = 0;
    	int sum_2124_10Cnt = 0;
    	int sum_2124_20Cnt = 0;
    	int sum_2124_30Cnt = 0;
    	int sum_2124_40Cnt = 0;
    	int sum_2124_50Cnt = 0;
    	int sum_2124_60Cnt = 0;


    	int sum_2403_00Cnt = 0;
    	int sum_2403_10Cnt = 0;
    	int sum_2403_20Cnt = 0;
    	int sum_2403_30Cnt = 0;
    	int sum_2403_40Cnt = 0;
    	int sum_2403_50Cnt = 0;
    	int sum_2403_60Cnt = 0;

    	int sum_0306_00Cnt = 0;
    	int sum_0306_10Cnt = 0;
    	int sum_0306_20Cnt = 0;
    	int sum_0306_30Cnt = 0;
    	int sum_0306_40Cnt = 0;
    	int sum_0306_50Cnt = 0;
    	int sum_0306_60Cnt = 0;


    	for(int i = 0; i < listData.size(); i++) {

    		map = (EgovMap)listData.get(i);

        	row_00Cnt = Integer.parseInt( map.get("c00Cnt").toString() );
        	row_10Cnt = Integer.parseInt( map.get("c10Cnt").toString() );
        	row_20Cnt = Integer.parseInt( map.get("c20Cnt").toString() );
        	row_30Cnt = Integer.parseInt( map.get("c30Cnt").toString() );
        	row_40Cnt = Integer.parseInt( map.get("c40Cnt").toString() );
        	row_50Cnt = Integer.parseInt( map.get("c50Cnt").toString() );
        	row_60Cnt = Integer.parseInt( map.get("c60Cnt").toString() );

    		if( map.get("timeCd").toString().equals("07") ||  map.get("timeCd").toString().equals("08") ||  map.get("timeCd").toString().equals("09") ) {
    	    	sum_0609_00Cnt += row_00Cnt;
    	    	sum_0609_10Cnt += row_10Cnt;
    	    	sum_0609_20Cnt += row_20Cnt;
    	    	sum_0609_30Cnt += row_30Cnt;
    	    	sum_0609_40Cnt += row_40Cnt;
    	    	sum_0609_50Cnt += row_50Cnt;
    	    	sum_0609_60Cnt += row_60Cnt;
    		} else if( map.get("timeCd").toString().equals("10") ||  map.get("timeCd").toString().equals("11") ||  map.get("timeCd").toString().equals("12") ) {
    	    	sum_0912_00Cnt += row_00Cnt;
    	    	sum_0912_10Cnt += row_10Cnt;
    	    	sum_0912_20Cnt += row_20Cnt;
    	    	sum_0912_30Cnt += row_30Cnt;
    	    	sum_0912_40Cnt += row_40Cnt;
    	    	sum_0912_50Cnt += row_50Cnt;
    	    	sum_0912_60Cnt += row_60Cnt;
    		} else if( map.get("timeCd").toString().equals("13") ||  map.get("timeCd").toString().equals("14") ||  map.get("timeCd").toString().equals("15") ) {
    	    	sum_1215_00Cnt += row_00Cnt;
    	    	sum_1215_10Cnt += row_10Cnt;
    	    	sum_1215_20Cnt += row_20Cnt;
    	    	sum_1215_30Cnt += row_30Cnt;
    	    	sum_1215_40Cnt += row_40Cnt;
    	    	sum_1215_50Cnt += row_50Cnt;
    	    	sum_1215_60Cnt += row_60Cnt;
    		} else if( map.get("timeCd").toString().equals("16") ||  map.get("timeCd").toString().equals("17") ||  map.get("timeCd").toString().equals("18") ) {
    	    	sum_1518_00Cnt += row_00Cnt;
    	    	sum_1518_10Cnt += row_10Cnt;
    	    	sum_1518_20Cnt += row_20Cnt;
    	    	sum_1518_30Cnt += row_30Cnt;
    	    	sum_1518_40Cnt += row_40Cnt;
    	    	sum_1518_50Cnt += row_50Cnt;
    	    	sum_1518_60Cnt += row_60Cnt;
    		} else if( map.get("timeCd").toString().equals("19") ||  map.get("timeCd").toString().equals("20") ||  map.get("timeCd").toString().equals("21") ) {
    	    	sum_1821_00Cnt += row_00Cnt;
    	    	sum_1821_10Cnt += row_10Cnt;
    	    	sum_1821_20Cnt += row_20Cnt;
    	    	sum_1821_30Cnt += row_30Cnt;
    	    	sum_1821_40Cnt += row_40Cnt;
    	    	sum_1821_50Cnt += row_50Cnt;
    	    	sum_1821_60Cnt += row_60Cnt;
    		} else if( map.get("timeCd").toString().equals("22") ||  map.get("timeCd").toString().equals("23") ||  map.get("timeCd").toString().equals("24") ) {
    	    	sum_2124_00Cnt += row_00Cnt;
    	    	sum_2124_10Cnt += row_10Cnt;
    	    	sum_2124_20Cnt += row_20Cnt;
    	    	sum_2124_30Cnt += row_30Cnt;
    	    	sum_2124_40Cnt += row_40Cnt;
    	    	sum_2124_50Cnt += row_50Cnt;
    	    	sum_2124_60Cnt += row_60Cnt;
    		} else if( map.get("timeCd").toString().equals("01") ||  map.get("timeCd").toString().equals("02") ||  map.get("timeCd").toString().equals("03") ) {
    	    	sum_2403_00Cnt += row_00Cnt;
    	    	sum_2403_10Cnt += row_10Cnt;
    	    	sum_2403_20Cnt += row_20Cnt;
    	    	sum_2403_30Cnt += row_30Cnt;
    	    	sum_2403_40Cnt += row_40Cnt;
    	    	sum_2403_50Cnt += row_50Cnt;
    	    	sum_2403_60Cnt += row_60Cnt;
    		} else if( map.get("timeCd").toString().equals("04") ||  map.get("timeCd").toString().equals("05") ||  map.get("timeCd").toString().equals("06") ) {
    	    	sum_0306_00Cnt += row_00Cnt;
    	    	sum_0306_10Cnt += row_10Cnt;
    	    	sum_0306_20Cnt += row_20Cnt;
    	    	sum_0306_30Cnt += row_30Cnt;
    	    	sum_0306_40Cnt += row_40Cnt;
    	    	sum_0306_50Cnt += row_50Cnt;
    	    	sum_0306_60Cnt += row_60Cnt;
    		}

    	}

    	// 집계 누적 후.. 각각 Map 에 저장후 리스트에 add


    	Map inputMap = new EgovMap();

		inputMap.put("time" , "21시~24시");
		inputMap.put("C_00_CNT" , sum_2124_00Cnt);
		inputMap.put("C_10_CNT" , sum_2124_10Cnt);
		inputMap.put("C_20_CNT" , sum_2124_20Cnt);
		inputMap.put("C_30_CNT" , sum_2124_30Cnt);
		inputMap.put("C_40_CNT" , sum_2124_40Cnt);
		inputMap.put("C_50_CNT" , sum_2124_50Cnt);
		inputMap.put("C_60_CNT" , sum_2124_60Cnt);

		resultList.add(inputMap);

		inputMap = new EgovMap();
		inputMap.put("time" , "18시~21시");
		inputMap.put("C_00_CNT" , sum_1821_00Cnt);
		inputMap.put("C_10_CNT" , sum_1821_10Cnt);
		inputMap.put("C_20_CNT" , sum_1821_20Cnt);
		inputMap.put("C_30_CNT" , sum_1821_30Cnt);
		inputMap.put("C_40_CNT" , sum_1821_40Cnt);
		inputMap.put("C_50_CNT" , sum_1821_50Cnt);
		inputMap.put("C_60_CNT" , sum_1821_60Cnt);

		resultList.add(inputMap);

		inputMap = new EgovMap();
		inputMap.put("time" , "15시~18시");
		inputMap.put("C_00_CNT" , sum_1518_00Cnt);
		inputMap.put("C_10_CNT" , sum_1518_10Cnt);
		inputMap.put("C_20_CNT" , sum_1518_20Cnt);
		inputMap.put("C_30_CNT" , sum_1518_30Cnt);
		inputMap.put("C_40_CNT" , sum_1518_40Cnt);
		inputMap.put("C_50_CNT" , sum_1518_50Cnt);
		inputMap.put("C_60_CNT" , sum_1518_60Cnt);

		resultList.add(inputMap);

		inputMap = new EgovMap();
		inputMap.put("time" , "12시~15시");
		inputMap.put("C_00_CNT" , sum_1215_00Cnt);
		inputMap.put("C_10_CNT" , sum_1215_10Cnt);
		inputMap.put("C_20_CNT" , sum_1215_20Cnt);
		inputMap.put("C_30_CNT" , sum_1215_30Cnt);
		inputMap.put("C_40_CNT" , sum_1215_40Cnt);
		inputMap.put("C_50_CNT" , sum_1215_50Cnt);
		inputMap.put("C_60_CNT" , sum_1215_60Cnt);

		resultList.add(inputMap);

		inputMap = new EgovMap();
		inputMap.put("time" , "09시~12시");
		inputMap.put("C_00_CNT" , sum_0912_00Cnt);
		inputMap.put("C_10_CNT" , sum_0912_10Cnt);
		inputMap.put("C_20_CNT" , sum_0912_20Cnt);
		inputMap.put("C_30_CNT" , sum_0912_30Cnt);
		inputMap.put("C_40_CNT" , sum_0912_40Cnt);
		inputMap.put("C_50_CNT" , sum_0912_50Cnt);
		inputMap.put("C_60_CNT" , sum_0912_60Cnt);

		resultList.add(inputMap);

		inputMap = new EgovMap();
		inputMap.put("time" , "06시~09시");
		inputMap.put("C_00_CNT" , sum_0609_00Cnt);
		inputMap.put("C_10_CNT" , sum_0609_10Cnt);
		inputMap.put("C_20_CNT" , sum_0609_20Cnt);
		inputMap.put("C_30_CNT" , sum_0609_30Cnt);
		inputMap.put("C_40_CNT" , sum_0609_40Cnt);
		inputMap.put("C_50_CNT" , sum_0609_50Cnt);
		inputMap.put("C_60_CNT" , sum_0609_60Cnt);

		resultList.add(inputMap);

		inputMap = new EgovMap();
		inputMap.put("time" , "03시~06시");
		inputMap.put("C_00_CNT" , sum_0306_00Cnt);
		inputMap.put("C_10_CNT" , sum_0306_10Cnt);
		inputMap.put("C_20_CNT" , sum_0306_20Cnt);
		inputMap.put("C_30_CNT" , sum_0306_30Cnt);
		inputMap.put("C_40_CNT" , sum_0306_40Cnt);
		inputMap.put("C_50_CNT" , sum_0306_50Cnt);
		inputMap.put("C_60_CNT" , sum_0306_60Cnt);

		resultList.add(inputMap);

		inputMap = new EgovMap();
		inputMap.put("time" , "00시~03시"); // 24~03
		inputMap.put("C_00_CNT" , sum_2403_00Cnt);
		inputMap.put("C_10_CNT" , sum_2403_10Cnt);
		inputMap.put("C_20_CNT" , sum_2403_20Cnt);
		inputMap.put("C_30_CNT" , sum_2403_30Cnt);
		inputMap.put("C_40_CNT" , sum_2403_40Cnt);
		inputMap.put("C_50_CNT" , sum_2403_50Cnt);
		inputMap.put("C_60_CNT" , sum_2403_60Cnt);

		resultList.add(inputMap);


    	return resultList;
    }



    public String getTagAddStr(String value) {

    	if(value.contains("증가")) {
    		value = "<span class='text_em'>" + value + "</span>";
    	} else {
    		value = "<span class='text_em2'>" + value + "</span>";
    	}


    	return value;
    }


    @RequestMapping(value="/cus/fad/ShopStrdReport/selectShopStrdReportCpaPrint.do")
    public String selectShopStrdReportPrint (HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {


    	return "cus/fad/fcas_shop_strd_rx_print_002";
    }



    @RequestMapping(value="/cus/fad/ShopStrdReport/selectShopStrdReportCpaPrintXml2.do")
    public void selectRxTestView2(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

		StringBuffer sb = new StringBuffer();



    	response.setContentType("text/xml; charset=UTF-8");
    	response.getWriter().print(  sb.toString() );


    }


    @RequestMapping(value="/cus/fad/ShopStrdReport/selectShopStrdReportCpaPrintXml.do")
    public ModelAndView selectRxTestView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

		StringBuffer sb = new StringBuffer();



        try{


	    	commonDAO.getSqlMapClient().startTransaction();


	    	// 검색 조건 셋팅
	    	Map<String, Object> paramMap = new HashMap<String, Object>();

	    	// 현재 날짜를 가져온다 DB에서..
	    	// 2012.09.14 변경 dbYmd <== 가 오늘날짜가 아니라 오늘날짜 -1 일자로 변경 됨.. 즉 쿼리 수정함..
	    	Map dbYmd = commonService.getDbYmd();
	    	//Map dbYmd = commonService.getDbYmdStandard();


	    	LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
	    	paramMap.put("searchCompId", loginModel.getCompId()); // 로긴한 고객사ID
	    	paramMap.put("searchShopId", loginModel.getShopId()); // 로긴한 매장ID




	    	// 기준일이 휴일인지를 판별한다. 휴일이면... -1일을 해서.. 휴일이 아닐때 까지 찾아온다.
	    	boolean flag = true;
	    	SimpleDateFormat sdf = null;
	    	Date toDay = null;
	    	Date strdD = null;
	    	String strdDay = null;
	    	int exday = 1;
	    	while( flag ) {
	            sdf = new SimpleDateFormat("yyyyMMdd");
	    		toDay = sdf.parse(dbYmd.get("YYYYMMDD").toString());

	    		strdD = CommonUtil.getBeforeDay(toDay, exday );
	    		strdDay = sdf.format(strdD); // exDay 만큼의 전일을 구함..

	    		paramMap.put("targetDay", strdDay);
	    		String chk = (String)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.checkWorkYn", paramMap);

	        	if( chk == null) {
	        		flag = false;
	        		paramMap.put("strdDay", strdDay);
	        	} else {
	        		exday++;
	        	}
	    	}

	    	// strdDay 로.. 기준일에 대한 정보를 다시 쿼리로 가져온다
	    	dbYmd = commonService.getDbYmdCustom(paramMap.get("strdDay").toString());


	    	paramMap.put("nowDate", dbYmd.get("YYYYMMDD").toString()); // 오늘날짜
	    	paramMap.put("nowDate2", "D_"+dbYmd.get("YYYYMMDD").toString()); // 오늘날짜





	    	// 기준일의 날씨 정보를 가져온다..!!
	    	Map<String, Object> searchMap = new HashMap<String, Object>();
	    	searchMap.put("STND_DATE", dbYmd.get("YYYYMMDD").toString());
	    	searchMap.put("TIME_GRP", "02");
	    	searchMap.put("SHOP_ID", loginModel.getShopId());
	    	searchMap.put("COMP_ID", loginModel.getCompId());
	    	Map wthInfo = commonService.getKwthInfo(searchMap);
	    	model.addAttribute("wthInfo", wthInfo );




	    	// 전일 기준일 을 구한다.. ( 오늘날짜의 -1 한 날짜가 휴일인지를 가져온다.. 휴일이 아닐때가 전일 기준일이다.  휴일이라면 -1 일이 전일 기준일이다. )
	    	flag = true;
	    	sdf = null;
	    	toDay = null;
	    	Date preD = null;
	    	String preDay = null; // 전일 기준일..
	    	exday = 1;
	    	while( flag ) {
	            sdf = new SimpleDateFormat("yyyyMMdd");
	    		toDay = sdf.parse(dbYmd.get("YYYYMMDD").toString());

	    		preD = CommonUtil.getBeforeDay(toDay, exday );
	    		preDay = sdf.format(preD); // exDay 만큼의 전일을 구함..

	    		paramMap.put("targetDay", preDay); // 전일 기준일 (기준일 -1 일이 휴일인지 판별)
	    		String chk = (String)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.checkWorkYn", paramMap); //shopStrdReportService.checkWorkYn( paramMap ); // 휴일인지를 판별

	        	if( chk == null) {
	        		flag = false; // 휴일이 아니면.. preDay 과 전일 기준일이 된다.
	        		paramMap.put("preDay", preDay); // 전일 기준일 (기준일 -1 일이 휴일인지 판별)
	        	} else {
	        		exday++;
	        	}
	    	}
	    	//System.out.println("============================================");
	    	//System.out.println("test-->전일기준일은?=="+paramMap.get("preDay"));
	    	//System.out.println("============================================");






	    	//0 입장객수 현황
	    	//0-1 전일 대비 현황
	    	List chart_0_1 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_0_1", paramMap); //shopStrdReportService.selectChart_0_1(paramMap);

	    	//if(chart_0_1 == null) {
	    	//	// "현재 매장은 아직 카메라가 설치 되지 않았거나\n집계정보 생성 전입니다."
	    	//	model.addAttribute("msg", SystemMsg.getMsg("COM_IFO_0013") );
	    	//	return "error/error";
	    	//}

	    	//0-2 시간대별 추이
	    	List chart_0_2 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_0_2", paramMap); //shopStrdReportService.selectChart_0_2(paramMap);



	    	// 시사점 정보 String Make
	    	// 기준일자의 총 입장객수는 전일대비 xx%증가 감소 하였고<br />시간대 별로는  18시~21시 사이에 가장 많이 방문하셨습니다.
	    	String sisa_0 = "기준일자의 총 입장객수는 전일대비 pStr1 했고\n 시간대 별로는 pStr2 사이에 가장 많이 방문했습니다.";

	    	Map exResultInfo = null;
	    	String pStr1 = "";
	    	String pStr2 = "";
	    	String pStr3 = "";
	    	String pStr4 = "";
	    	String pStr5 = "";
	    	String pStr6 = "";
	    	String pStr7 = "";
	    	String pStr8 = "";
	    	String pStr9 = "";
	    	String pStr10 = "";

	    	if(chart_0_1.size() == 1) {
	    		sisa_0 = "전일 집계 데이터가 없습니다.";
	    	} else {

		    	exResultInfo = getMaxValueInfo0_1( chart_0_1 ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
		    	pStr1 = exResultInfo.get("maxStr1").toString();
		    	exResultInfo = getMaxValueInfo0_2( chart_0_2 ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
		    	pStr2 = exResultInfo.get("maxTimeNm").toString();

		    	if(pStr1.equals("2147483547%증가")) {
		    		pStr1 = "100%증가";
		    		sisa_0 = sisa_0.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2);
		    	} else {
		    		sisa_0 = sisa_0.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2);
		    	}
	    	}




	    	// 1-1 성별현황 차트 쿼리
	    	Map<String, Object> chart_1_1 = (Map)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.selectChart_1_1", paramMap); //shopStrdReportService.selectChart_1_1(paramMap);

	    	//if(chart_1_1 == null) {
	    	//	// "현재 매장은 아직 카메라가 설치 되지 않았거나\n집계정보 생성 전입니다."
	    	//	model.addAttribute("msg", SystemMsg.getMsg("COM_IFO_0013") );
	    	//	return "error/error";
	    	//}


	    	// 1-1 테이블 데이터
	    	Map<String, Object> tableData_1_1 = new HashMap<String, Object>();
	    	tableData_1_1.put("fCnt", chart_1_1.get("fCnt"));
	    	tableData_1_1.put("mCnt", chart_1_1.get("mCnt"));
	    	tableData_1_1.put("totCnt", Integer.parseInt( chart_1_1.get("fCnt").toString() ) + Integer.parseInt( chart_1_1.get("mCnt").toString() ) + "");

	    	// 1-2 연령대별 현황 쿼리
	    	List chart_1_2 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_1_2", paramMap); //shopStrdReportService.selectChart_1_2(paramMap);

	    	// 1-2 테이블 데이터
	    	Map tableData_1_2 = (Map)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.selectTableData_1_2", paramMap); //shopStrdReportService.selectTableData_1_2(paramMap);

	    	tableData_1_2.put("per00", Double.parseDouble(String.format("%.2f", Double.parseDouble( tableData_1_2.get("par00").toString() ) ) )+"");
	    	tableData_1_2.put("per60", Double.parseDouble(String.format("%.2f", Double.parseDouble( tableData_1_2.get("par60").toString() ) ) )+"");


	    	// 시사점 정보 String Make
	    	// 방문고객 중 성별로는 남성(68%)이, 연령대별로는 10대(15%)의 비율이 높았으며,<br /> 성별/연령대별로는 <span class='text_em'>10대 여성</span>의 비중이 가장 높습니다.
	    	String sisa_1_2 = "성별로는 pStr1(pStr2%)이, 연령대별로는 pStr3(pStr4%)의 비율이 높았으며,\n성별/연령대별로는 pStr5 pStr6의 비중이 가장 높았습니다.";

	    	int f_cnt = Integer.parseInt( chart_1_1.get("fCnt").toString() );
	    	int m_cnt = Integer.parseInt( chart_1_1.get("mCnt").toString() );
	    	int tot_cnt = f_cnt + m_cnt ;
	    	pStr1 = "";
	    	pStr2 = "";

	    	if( f_cnt >= m_cnt ) pStr1 = "여성";
	    	else pStr1 = "남성";

	    	if(pStr1.equals("여성")) pStr2 = (int)(((double)f_cnt / (double)tot_cnt) * 100) + "";
	    	else                    pStr2 = (int)(((double)m_cnt / (double)tot_cnt) * 100) + "";

	    	exResultInfo = getMaxValueInfo1( chart_1_2 ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
	    	pStr3 = exResultInfo.get("maxStr").toString();
	    	pStr4 = exResultInfo.get("maxPer").toString().trim();

	    	exResultInfo = getMaxValueInfo2( chart_1_2 ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
	    	pStr5 = exResultInfo.get("maxStr").toString();
	    	pStr6 = exResultInfo.get("maxStr2").toString();
	    	pStr7 = "";
	    	pStr8 = "";
	    	pStr9 = "";
	    	pStr10 = "";

	    	sisa_1_2 = sisa_1_2.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2).replaceFirst("pStr3", pStr3).replaceFirst("pStr4", pStr4).replaceFirst("pStr5", pStr5).replaceFirst("pStr6", pStr6);







	    	// 2-1 성별 / 시간대별 방문 추이
			//List chart_2_1 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_2_1", paramMap); //shopStrdReportService.selectChart_2_1(paramMap);

			//shopstrdreportcpa.selectChart_2_1 쿼리가 느려서 변경함..

			List chart_2_1_time = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_2_1_TimeData", paramMap);

			//List 에서 꺼내면서 shopstrdreportcpa.selectChart_2_1 쿼리의 결과 형태로 묶어준다.
			List chart_2_1 = getChangeData(chart_2_1_time);



	    	// 시사점 정보 String Make
	    	// 전체 방문고객층은 12시~15시, 여성은 15시~18시,<br />남성은 15시~18시 사이에 가장 많이 방문하셨습니다.
	    	String sisa_2_1 = "전체 객층수는 pStr1, 여성은 pStr2,\n남성은 pStr3 사이에 가장 많이 방문했습니다.";

	    	exResultInfo = getMaxValueInfo3( chart_2_1 ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
	    	pStr1 = exResultInfo.get("maxStr1").toString();
	    	pStr2 = exResultInfo.get("maxStr2").toString();
	    	pStr3 = exResultInfo.get("maxStr3").toString();
	    	sisa_2_1 = sisa_2_1.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2).replaceFirst("pStr3", pStr3);


	    	// 2-2 연령대별/시간대별 방문 추이
	    	//List chart_2_2 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_2_2", paramMap); //shopStrdReportService.selectChart_2_2(paramMap);


			//shopstrdreportcpa.selectChart_2_2 쿼리가 느려서 변경함..

			List chart_2_2_time = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_2_2_TimeData", paramMap);

			//List 에서 꺼내면서 shopstrdreportcpa.selectChart_2_1 쿼리의 결과 형태로 묶어준다.
			List chart_2_2 = getChangeData2(chart_2_2_time);




	    	// 시사점 정보 String Make
	    	// 전체 방문고객층은 15시~18시, <span class="text_em">20대</span>가 15시~18시<br />사이에 가장 많이 방문하셨습니다.
	    	String sisa_2_2 = "전체 객층수는 pStr1, pStr2 pStr3\n사이에 가장 많이 방문했습니다.";

	    	exResultInfo = getMaxValueInfo4( chart_2_2 ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
	    	pStr1 = exResultInfo.get("maxStr1").toString();
	    	pStr2 = exResultInfo.get("maxStr2").toString();
	    	pStr3 = exResultInfo.get("maxStr3").toString();
	    	sisa_2_2 = sisa_2_2.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2).replaceFirst("pStr3", pStr3);



	    	// 3-1 기준일 대비 전일비교 ( 성별기준 )
	    	paramMap.put("targetDay", paramMap.get("preDay") ); // 전일 기준일
	    	paramMap.put("targetDay2", "D_"+paramMap.get("preDay") ); // 전일 기준일 ( - 붙인거 )
	    	List chart_3_1_1 =  commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_3_1_1_rex", paramMap); // shopStrdReportService.selectChart_3_1_1(paramMap);

	    	// 3-1 기준일 대비 전일비교 ( 연령대기준 )
	    	paramMap.put("targetDay", paramMap.get("preDay") ); // 전일 기준일
	    	paramMap.put("targetDay2", "D_"+paramMap.get("preDay") ); // 전일 기준일 ( - 붙인거 )
	    	List chart_3_1_2 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_3_1_2_rex", paramMap); // shopStrdReportService.selectChart_3_1_2(paramMap);

	    	// 시사점 정보 String Make
	    	// 전일 대비 방문자수는 전체적으로 3%증가하였고,<br />
	    	// 성별로는 남성 비율이  10% 증가, 여성 비율이 5% 감소했습니다.<br />
	    	// 연령대 별로는 10대이하 -5%, 10대 5%, 20대 2%, 30대 12%,<br />
	    	// 40대 2%, 50대 2%, 60대이상 -112%의 증감률을 보였습니다.

	    	/* 시사점 변경전 백업
	    	String sisa_3_1 = ""
	    	 +"총객층수는 전일 대비 pStr1하였고,<br />"
	    	 +"성별로는 여성 비율이 pStr2, 남성 비율이 pStr3했습니다.<br />"
	    	 +"연령대 별로는 10대이하 pStr4, 10대 pStr5, 20대 pStr6, 30대 pStr7,<br />"
	    	 +"40대 pStr8, 50대 pStr9, 60대이상 pStr10의 증감률을 보였습니다.";
	    	exResultInfo = getMaxValueInfo5( chart_3_1_1 , chart_3_1_2  , paramMap.get("nowDate").toString() , paramMap.get("preDay").toString() ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
	    	pStr1 = exResultInfo.get("maxStr1").toString();
	    	pStr2 = exResultInfo.get("maxStr2").toString();
	    	pStr3 = exResultInfo.get("maxStr3").toString();
	    	pStr4 = exResultInfo.get("maxStr4").toString();
	    	pStr5 = exResultInfo.get("maxStr5").toString();
	    	pStr6 = exResultInfo.get("maxStr6").toString();
	    	pStr7 = exResultInfo.get("maxStr7").toString();
	    	pStr8 = exResultInfo.get("maxStr8").toString();
	    	pStr9 = exResultInfo.get("maxStr9").toString();
	    	pStr10 = exResultInfo.get("maxStr10").toString();

	    	sisa_3_1 = sisa_3_1.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2).replaceFirst("pStr3", pStr3).replaceFirst("pStr4", pStr4).replaceFirst("pStr5", pStr5).replaceFirst("pStr6", pStr6).replaceFirst("pStr7", pStr7).replaceFirst("pStr8", pStr8).replaceFirst("pStr9", pStr9).replaceFirst("pStr10", pStr10);
			*/

	    	String sisa_3_1 = ""
	         	 +"총객층수는 전일 대비 pStr1했고,\n"
	         	 +"성별로는 여성 비율이 pStr2, 남성 비율이 pStr3했습니다.\n"
	         	 +"가장 변동폭이 큰 연령대는 pStr4(으)로  pStr5했습니다.";


	    	int pre_cnt = 0;
	    	try {
	    		pre_cnt = (Integer)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.selectDaySumCnt", paramMap); //shopStrdReportService.selectDaySumCnt(paramMap);
	    	}catch (Exception e) {
	    		pre_cnt = 0;
	    	}


	    	if(pre_cnt == 0) {
	    		sisa_3_1 = "전일 집계 데이터가 없습니다.";
	    	} else {

	          	exResultInfo = getMaxValueInfo5NewRex( chart_3_1_1 , chart_3_1_2  , paramMap.get("nowDate").toString() , paramMap.get("preDay").toString() ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
	          	pStr1 = exResultInfo.get("maxStr1").toString();
	          	pStr2 = exResultInfo.get("maxStr2").toString();
	          	pStr3 = exResultInfo.get("maxStr3").toString();
	          	pStr4 = exResultInfo.get("maxStr4").toString();
	          	pStr5 = exResultInfo.get("maxStr5").toString();

	          	if(pStr1.equals("2147483547%증가")) { // 집계 데이터가 0인경우...

	          		sisa_3_1 = "전일 집계 데이터가 없습니다.";

	          	} else {

	          		if(pStr2.equals("2147483547%증가")) pStr2 = "100%증가";
	          		if(pStr3.equals("2147483547%증가")) pStr3 = "100%증가";
	          		//if(pStr5.equals("2147483547%증가")) pStr5 = "100%증가"; // pStr5의 경우 2147483547 값은 getMaxValueInfo5New 함수 내에서 처리 하므로 주석함..

	          		sisa_3_1 = sisa_3_1.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2).replaceFirst("pStr3", pStr3).replaceFirst("pStr4", pStr4).replaceFirst("pStr5", pStr5);

	          	}
	    	}




	    	// 기준일 대비 전주 동요일을 구한다........
	    	flag = true;
	    	sdf = null;
	    	toDay = null;
	    	preD = null;
	       	String beforeWeekDay = null; // 전주 동요일 기준일.. ( 오늘날짜의 -7 한 날짜가 유일인지를 가져와서 휴일이 아니면 전주 동요일.. 휴일이라면 -1 일이 전주 동요일이다. )
	       	exday = 7;
	    	while( flag ) {
	            sdf = new SimpleDateFormat("yyyyMMdd");
	    		toDay = sdf.parse(dbYmd.get("YYYYMMDD").toString());

	    		preD = CommonUtil.getBeforeDay(toDay, exday );
	    		beforeWeekDay = sdf.format(preD); // exDay 만큼의 전일을 구함..

	    		paramMap.put("targetDay", beforeWeekDay); //
	    		String chk = (String)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.checkWorkYn", paramMap); //shopStrdReportService.checkWorkYn( paramMap ); // 휴일인지를 판별

	        	if( chk == null) {
	        		flag = false; //
	        		paramMap.put("beforeWeekDay", beforeWeekDay); //
	        		paramMap.put("targetDay2", "D_"+paramMap.get("beforeWeekDay") ); //
	        	} else {
	        		exday++;
	        	}
	    	}
	    	//System.out.println("============================================");
	    	//System.out.println("test-->전주동요일은?=="+paramMap.get("beforeWeekDay"));
	    	//System.out.println("============================================");

	    	// 3-2 기준일 대비 전주 동요일 비교 ( 성별기준 )
	    	List chart_3_2_1 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_3_1_1_rex", paramMap); //shopStrdReportService.selectChart_3_1_1(paramMap);

	    	// 3-2 기준일 대비 전주 동요일 비교 ( 연령대기준 )
	    	List chart_3_2_2 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_3_1_2_rex", paramMap); //shopStrdReportService.selectChart_3_1_2(paramMap);


	    	String sisa_3_2 = ""
	          	 +"총객층수는 전주 동요일 대비 pStr1했고,\n"
	          	 +"성별로는 여성 비율이 pStr2, 남성 비율이 pStr3했습니다.\n"
	          	 +"가장 변동폭이 큰 연령대는 pStr4(으)로  pStr5했습니다.";

	    	int before_cnt = 0;
	    	try {
	    		before_cnt = (Integer)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.selectDaySumCnt", paramMap); //shopStrdReportService.selectDaySumCnt(paramMap);
	    	}catch (Exception e) {
	    		before_cnt = 0;
	    	}



	    	if(before_cnt == 0) {
	    		sisa_3_2 = "전주 동요일 집계 데이터가 없습니다.";
	    	} else {
		      	exResultInfo = getMaxValueInfo5NewRex( chart_3_2_1 , chart_3_2_2  , paramMap.get("nowDate").toString() , paramMap.get("beforeWeekDay").toString() ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
		      	pStr1 = exResultInfo.get("maxStr1").toString();
		      	pStr2 = exResultInfo.get("maxStr2").toString();
		      	pStr3 = exResultInfo.get("maxStr3").toString();
		      	pStr4 = exResultInfo.get("maxStr4").toString();
		      	pStr5 = exResultInfo.get("maxStr5").toString();


	          	if(pStr1.equals("2147483547%증가")) { // 집계 데이터가 0인경우...

	          		sisa_3_2 = "전일 집계 데이터가 없습니다.";

	          	} else {

	          		if(pStr2.equals("2147483547%증가")) pStr2 = "100%증가";
	          		if(pStr3.equals("2147483547%증가")) pStr3 = "100%증가";
	          		//if(pStr5.equals("2147483547%증가")) pStr5 = "100%증가"; // pStr5의 경우 2147483547 값은 getMaxValueInfo5New 함수 내에서 처리 하므로 주석함..

	          		sisa_3_2 = sisa_3_2.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2).replaceFirst("pStr3", pStr3).replaceFirst("pStr4", pStr4).replaceFirst("pStr5", pStr5);

	          	}
	    	}






	    	// 4-1 설치 위치 별 방문자 현황
	    	// 렉스포트 출력시 카메라가 30개면 출력양식에 문제가 있으므로 렉스포트에서는 15건을 최대로 해서 가져오도록 함..
	    	List chart_4_1 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_4_1_rex", paramMap); //shopStrdReportService.selectChart_4_1(paramMap);

	    	// 시사점 정보 String Make
	    	// 카메라 위치 별 방문자수는 서문 출입구가 가장 높았으며,<br />여성은 서문, 남성은 서문 출입구의 이용이 높았습니다.
	    	String sisa_4_1 = "설치 위치별 입장객수는 pStr1(이)가 가장 높았으며,\n성별로는 여성은 pStr2, 남성은 pStr3의 이용이 높았습니다.";

	    	exResultInfo = getMaxValueInfo6( chart_4_1 ); // 차트List 데이터로 맥스값 정보를 판별 해서 가져온다
	    	pStr1 = exResultInfo.get("maxStr1").toString();
	    	pStr2 = exResultInfo.get("maxStr2").toString();
	    	pStr3 = exResultInfo.get("maxStr3").toString();

	    	sisa_4_1 = sisa_4_1.replaceFirst("pStr1", pStr1).replaceFirst("pStr2", pStr2).replaceFirst("pStr3", pStr3);



	    	// 5-1  일자별 추이 (이전 15일)

	    	// 기준일 대비 -15일 을 구한다.. 하지만 중간에 휴일이 끼어있으면 안되고.. 휴일 제외 30일..을 구함.
	    	flag = true;
	    	sdf = null;
	    	toDay = null;
	    	preD = null;
	       	String before30Day = null;
	       	exday = 1;
	       	int DAY_COUNT = 0; //
	    	while( flag ) {
	            sdf = new SimpleDateFormat("yyyyMMdd");
	    		toDay = sdf.parse(dbYmd.get("YYYYMMDD").toString()); // 기준일 구함..

	    		preD = CommonUtil.getBeforeDay(toDay, exday );
	    		before30Day = sdf.format(preD); // 기준일 -1 일을 구함..

	    		paramMap.put("targetDay", before30Day); //
	    		String chk = (String)commonDAO.getSqlMapClient().queryForObject("shopstrdreportcpa.checkWorkYn", paramMap); //shopStrdReportService.checkWorkYn( paramMap ); // 휴일인지를 판별


	        	if( chk == null) {
	        		DAY_COUNT++;
	        	}
	        	exday++;

	        	if(DAY_COUNT == 14) {
	        		flag = false; // 휴일이 아니면.. preDay과 전일 기준일이 된다.
	        		paramMap.put("before30Day", before30Day); //
	        	}
	    	}

	    	List chart_5_1 = commonDAO.getSqlMapClient().queryForList("shopstrdreportcpa.selectChart_5_1", paramMap); //shopStrdReportService.selectChart_5_1(paramMap);

	    	//System.out.println("============================================");
	    	//System.out.println("test-->기준일 대비 휴일 제외 - 30일인 날짜는 ?=="+paramMap.get("before30Day"));
	    	//System.out.println("============================================");



	    	model.addAttribute("nowDateInfo", dbYmd ); // 오늘 날짜 정보 (요일포함)
	    	Map preYmd = commonService.getDbYmdCustom(preDay);
	    	Map beforeWeekYmd = commonService.getDbYmdCustom(beforeWeekDay);

	    	String bDay = "전일 "+preYmd.get("YYYY")+"."+preYmd.get("MM")+"."+preYmd.get("DD")+" ("+preYmd.get("DATE_NAME")+")";
	    	String b7Day = "전주동요일 "+beforeWeekYmd.get("YYYY")+"."+beforeWeekYmd.get("MM")+"."+beforeWeekYmd.get("DD")+" ("+beforeWeekYmd.get("DATE_NAME")+")";


	    	List chart_1_1_list = new ArrayList();
	    	chart_1_1_list.add( chart_1_1 );
	    	List table_1_1_list = new ArrayList();
	    	table_1_1_list.add( tableData_1_1 );
	    	List table_1_2_list = new ArrayList();
	    	table_1_2_list.add( tableData_1_2 );


	    	String temp = wthInfo != null ? wthInfo.get("TEMP").toString() : "";
	    	String wth  = wthInfo != null ? wthInfo.get("KWTH_STAT_NM").toString() : "";


			//sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
			sb.append( "<gubun>");

			sb.append( "<rpt0>");
			sb.append( "<rexdataset>");
			sb.append( "<rexrow>");
			sb.append( "<compNm>"+loginModel.getCompNm()+"</compNm>");
			sb.append( "<shopNm>"+loginModel.getShopNm()+"</shopNm>");
			sb.append( "<strdDate>"+dbYmd.get("YYYY").toString()+"년 "+dbYmd.get("MM").toString()+"월 "+dbYmd.get("DD").toString()+"일 "+dbYmd.get("DATE_NAME").toString()+"요일"+"</strdDate>");
			sb.append( "<wthTemp>"+temp+"</wthTemp>");
			sb.append( "<wthStr>"+wth+"</wthStr>");
			sb.append( "<bDay>"+bDay+"</bDay>");
			sb.append( "<b7Day>"+b7Day+"</b7Day>");
			sb.append( "</rexrow>");
			sb.append( "</rexdataset>");
			sb.append( "</rpt0>");


			// 1.입장객수 현황 1-1 전일대비 현황 그래프
			sb.append( "<rpt1>");
			sb.append( RexpertXmlUtil.toXML(chart_0_1 , "rexdataset" , "rexrow") +"");
			sb.append( "</rpt1>");

			// 1.입장객수 현황 1-2 시간대별 추이 그래프
			sb.append( "<rpt2>");
			sb.append( RexpertXmlUtil.toXML(chart_0_2 , "rexdataset" , "rexrow") +"");
			sb.append( "</rpt2>");

			// 1.입장객수 현황 시사점
			sb.append( "<rpt3>");
			sb.append( "<rexdataset>");
			sb.append( "<rexrow>");
			sb.append( "<sisa>"+sisa_0+"</sisa>");
			sb.append( "</rexrow>");
			sb.append( "</rexdataset>");
			sb.append( "</rpt3>");

			// 2.객층수 현황 - 2-1.성별현황
			sb.append( "<rpt4>");
			sb.append( RexpertXmlUtil.toXML(chart_1_1_list , "rexdataset" , "rexrow") +"");
			sb.append( "</rpt4>");

			// 2.객층수 현황 - 2-1.성별현황 표
			sb.append( "<rpt5>");
			sb.append( RexpertXmlUtil.toXML(table_1_1_list , "rexdataset" , "rexrow") +"");
			sb.append( "</rpt5>");

			// 2.객층수 현황 - 2-2.연령대별 현황
			sb.append( "<rpt6>");
			sb.append( RexpertXmlUtil.toXML(chart_1_2 , "rexdataset" , "rexrow") +"");
			sb.append( "</rpt6>");

			// 2.객층수 현황 - 2-2.연령대별 현황 표
			sb.append( "<rpt7>");
			sb.append( RexpertXmlUtil.toXML(table_1_2_list , "rexdataset" , "rexrow") +"");
			sb.append( "</rpt7>");

			// 2.객층수 현황 시사점
			sb.append( "<rpt8>");
			sb.append( "<rexdataset>");
			sb.append( "<rexrow>");
			sb.append( "<sisa>"+sisa_1_2+"</sisa>");
			sb.append( "</rexrow>");
			sb.append( "</rexdataset>");
			sb.append( "</rpt8>");

			// 2.객층수 현황 - 2-3.성별 / 시간대별 방문 추이
			sb.append( "<rpt9>");
			sb.append( RexpertXmlUtil.toXML(chart_2_1 , "rexdataset" , "rexrow") +"");
			sb.append( "</rpt9>");

			// 2.객층수 현황 - 2-3.성별 / 시간대별 방문 추이 시사점
			sb.append( "<rpt10>");
			sb.append( "<rexdataset>");
			sb.append( "<rexrow>");
			sb.append( "<sisa>"+sisa_2_1+"</sisa>");
			sb.append( "</rexrow>");
			sb.append( "</rexdataset>");
			sb.append( "</rpt10>");

			// 2.객층수 현황 - 2-4.연령별 / 시간대별 추이
			sb.append( "<rpt11>");
			sb.append( RexpertXmlUtil.toXML(chart_2_2 , "rexdataset" , "rexrow") +"");
			sb.append( "</rpt11>");

			// 2.객층수 현황 - 2-4.연령별 / 시간대별 추이 시사점
			sb.append( "<rpt12>");
			sb.append( "<rexdataset>");
			sb.append( "<rexrow>");
			sb.append( "<sisa>"+sisa_2_2+"</sisa>");
			sb.append( "</rexrow>");
			sb.append( "</rexdataset>");
			sb.append( "</rpt12>");

			// 3.객층비교현황 3-1 전일대비 성별기준 그래프
			sb.append( "<rpt13>");
			sb.append( RexpertXmlUtil.toXML(chart_3_1_1 , "rexdataset" , "rexrow") +"");
			sb.append( "</rpt13>");

			// 3.객층비교현황 3-1 전일대비 연령대기준
			sb.append( "<rpt14>");
			sb.append( RexpertXmlUtil.toXML(chart_3_1_2 , "rexdataset" , "rexrow") +"");
			sb.append( "</rpt14>");

			// 3.객층비교현황 3-1 시사점
			sb.append( "<rpt15>");
			sb.append( "<rexdataset>");
			sb.append( "<rexrow>");
			sb.append( "<sisa>"+sisa_3_1+"</sisa>");
			sb.append( "</rexrow>");
			sb.append( "</rexdataset>");
			sb.append( "</rpt15>");


			// 3.객층비교현황 3-2 전주동요일대비 성별기준 그래프
			sb.append( "<rpt16>");
			sb.append( RexpertXmlUtil.toXML(chart_3_2_1 , "rexdataset" , "rexrow") +"");
			sb.append( "</rpt16>");

			// 3.객층비교현황 3-2 전주동요일대비 연령대기준
			sb.append( "<rpt17>");
			sb.append( RexpertXmlUtil.toXML(chart_3_2_2 , "rexdataset" , "rexrow") +"");
			sb.append( "</rpt17>");

			// 3.객층비교현황 3-2 시사점
			sb.append( "<rpt18>");
			sb.append( "<rexdataset>");
			sb.append( "<rexrow>");
			sb.append( "<sisa>"+sisa_3_2+"</sisa>");
			sb.append( "</rexrow>");
			sb.append( "</rexdataset>");
			sb.append( "</rpt18>");

			// 4.설치위치별 현황 -그래프
			sb.append( "<rpt19>");
			sb.append( RexpertXmlUtil.toXML(chart_4_1 , "rexdataset" , "rexrow") +"");
			sb.append( "</rpt19>");

			// 4.설치위치별 현황 -시사점
			sb.append( "<rpt20>");
			sb.append( "<rexdataset>");
			sb.append( "<rexrow>");
			sb.append( "<sisa>"+sisa_4_1+"</sisa>");
			sb.append( "</rexrow>");
			sb.append( "</rexdataset>");
			sb.append( "</rpt20>");

			// 5.일자별추이 - 그래프
			sb.append( "<rpt21>");
			sb.append( RexpertXmlUtil.toXML(chart_5_1 , "rexdataset" , "rexrow") +"");
			sb.append( "</rpt21>");



			sb.append( "</gubun>");




//sw.stop();
//System.out.println("변환완료 ->"+sw.getTime());



        }catch(Exception e){
            e.printStackTrace();
            //view.addObject("success", false);
            //view.addObject("message", PtmsUtils.getExceptionMsg(e));
        }finally {
            try{
            	commonDAO.getSqlMapClient().endTransaction();
            }catch(Exception err){
                err.printStackTrace();
            }
        }



		//System.out.println(sb.toString() );


    	//response.setContentType("text/xml; charset=UTF-8");
    	//response.getWriter().print(  sb.toString() );

        ModelAndView mav = new ModelAndView();
		mav.addObject("xmlStr", sb.toString() );
        //mav.addObject("xmlStr", ((sb.toString()).replaceAll("!C!", "<![CDATA[")).replaceAll("!E!", "]]>") );
		mav.setViewName("jsonView");

		//System.out.println( ((sb.toString()).replaceAll("!C!", "<![CDATA[")).replaceAll("!E!", "]]>") );

		return mav;
    }


}
