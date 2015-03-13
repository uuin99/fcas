package fcas.sys.com.web;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.service.MainService;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   MainController
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class MainController {
    @Resource(name = "mainService")
    private MainService mainService;

    @Resource(name = "commonService")
    private CommonService commonService;

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;


	protected Log log = LogFactory.getLog("egovframework");

    /**
	 * 메인화면을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/sys/com/Main/mainPage.do")
    public String selectMainPageView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "main";
    }

    /**
	 * 마이페이지를 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/sys/com/Main/myPage.do")
    public String selectMypageView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {


    	LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
    	
    	//Parameter Setting.
    	model.put("COMP_ID", loginModel.getCompId());
    	model.put("USER_ID", loginModel.getUserId());
    	model.put("SHOP_ID", loginModel.getShopId());
    	
    	// 현재 날짜를 가져온다 DB에서..
    	Map dbYmd = commonService.getDbYmd();
    	//Map dbYmd = commonService.getDbYmdStandard();

    	// 기준일이 휴일인지를 판별한다. 휴일이면... -1일을 해서.. 휴일이 아닐때 까지 찾아온다.
    	Map<String, Object> paramMap = new HashMap<String, Object>();

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
    		String chk = (String)commonDAO.getSqlMapClient().queryForObject("shopstrdreport.checkWorkYn", paramMap);

        	if( chk == null) {
        		flag = false;
        		paramMap.put("strdDay", strdDay);
        	} else {
        		exday++;
        	}
    	}

    	// strdDay 로.. 기준일에 대한 정보를 다시 쿼리로 가져온다
    	dbYmd = commonService.getDbYmdCustom(paramMap.get("strdDay").toString());

    	model.put("STND_DATE", dbYmd.get("YYYYMMDD").toString()); // 기준일..



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
    		String chk = (String)commonDAO.getSqlMapClient().queryForObject("shopstrdreport.checkWorkYn", paramMap); //shopStrdReportService.checkWorkYn( paramMap ); // 휴일인지를 판별

        	if( chk == null) {
        		flag = false; // 휴일이 아니면.. preDay 과 전일 기준일이 된다.
        		paramMap.put("preDay", preDay); // 전일 기준일 (기준일 -1 일이 휴일인지 판별)
        	} else {
        		exday++;
        	}
    	}

    	model.put("BF_STND_DATE", paramMap.get("preDay")); // 전일 기준일





        Map<String, java.util.List<java.util.Map<String, Object>>> retMap = mainService.selectMyPageInfo(model);

        model.addAttribute("USER_EMAIL", "".equals(loginModel.getEmailId()) ? "" : loginModel.getEmailId() + "@" + loginModel.getEmailDomain());
        model.addAttribute("STND_DATE", model.get("STND_DATE"));
        model.addAttribute("STND_DATEYYYY", model.get("STND_DATE").toString().substring(0,4));
        model.addAttribute("STND_DATEMM", model.get("STND_DATE").toString().substring(4,6));
        model.addAttribute("STND_DATEDD", model.get("STND_DATE").toString().substring(6,8));
        List<Map<String, Object>> tempInfo = null;
        Map<String, Object> tempMap = null;
        //공지사항
        tempInfo = retMap.get("NOTICE_INFO");
        if (tempInfo != null && !tempInfo.isEmpty()) {
        	for(Map<String, Object> map : tempInfo){
        		model.addAttribute("NOTICE_SUBJ_"+map.get("RNUM"), map.get("SUBJ"));
        		model.addAttribute("NOTICE_DATE_"+map.get("RNUM"), map.get("NT_DATE"));
        	}
        }
        tempInfo = null;

        //날씨
        tempInfo = retMap.get("WEATHER_INFO");
        if (tempInfo != null && !tempInfo.isEmpty()) {
        	tempMap = tempInfo.get(0);
        	model.addAttribute("WEATER_STAT_CD", tempMap.get("KWTH_STAT_CD"));//날씨코드
        	model.addAttribute("WEATER_STAT_NM", tempMap.get("KWTH_STAT_NM"));//날씨
        	model.addAttribute("WEATER_WDIRK", tempMap.get("WDIRK")+", ");//바람방향
        	model.addAttribute("WEATER_WSPEED", tempMap.get("WSPEED")+"m/s");//바람속도
        	model.addAttribute("WEATER_TEMP", "기온 "+tempMap.get("TEMP")+"도");//온도
        	model.addAttribute("WEATER_HUMI", "습도 "+tempMap.get("HUMI")+"%");//습도
        }else {
        	model.addAttribute("WEATER_STAT_CD", "XX");
        	model.addAttribute("WEATER_STAT_NM", "날씨정보 없음");
        }
        tempMap = null;
        tempInfo = null;

        //기본정보
        tempInfo = retMap.get("CNCT_DATE");
    	if (tempInfo != null && !tempInfo.isEmpty()) {
    		tempMap = tempInfo.get(0);
    		model.addAttribute("CNCT_STRT_DATE", tempMap.get("CNCT_STRT_DATE"));
        	model.addAttribute("CNCT_END_DATE", tempMap.get("CNCT_END_DATE"));
        	model.addAttribute("CNCT_DATE", tempMap.get("CNCT_DATE"));
    	}
    	tempMap = null;
    	tempInfo = null;

    	//최근접속정보
    	tempInfo = retMap.get("HIST_INFO");
    	if (tempInfo != null && !tempInfo.isEmpty()) {
    		tempMap = tempInfo.get(0);
    		model.addAttribute("HIST_DT", tempMap.get("HIST_DT"));
        	model.addAttribute("ACES_IP", tempMap.get("ACES_IP"));
    	}
    	tempMap = null;
    	tempInfo = null;

    	//사이트이용현황, 매장방문현황
    	tempInfo = retMap.get("REPORT_INFO");
    	if (tempInfo != null && !tempInfo.isEmpty()) {
    		tempMap = tempInfo.get(0);
    		model.addAttribute("SITE_OLN_CLS_TOTAL", tempMap.get("OLN_CLS_TOTAL")); //고객문의 - 합계
    		model.addAttribute("SITE_OLN_CLS_FN", tempMap.get("OLN_CLS_FN")); //고객문의 - 문의중
    		model.addAttribute("SITE_OLN_CLS_FY", tempMap.get("OLN_CLS_FY")); //고객문의 - 답변처리
    		model.addAttribute("SITE_FAIL_10", tempMap.get("FAIL_10")); //장애처리 - 접수
    		model.addAttribute("SITE_FAIL_30", tempMap.get("FAIL_30")); //장애처리 - 처리
    		model.addAttribute("SITE_FAIL_20", tempMap.get("FAIL_20")); //장애처리 - 미처리
    		model.addAttribute("SHOP_TODAY_ENTER_CNT", tempMap.get("TODAY_ENTER_CNT")); //기준일
    		model.addAttribute("SHOP_YESTER_ENTER_CNT", tempMap.get("YESTER_ENTER_CNT")); //전일
    		model.addAttribute("SHOP_PER_ENTER_CNT", tempMap.get("PER_ENTER_CNT")); //증감율
    		model.addAttribute("SHOP_MONTH_ENTER_CNT", tempMap.get("MONTH_ENTER_CNT")); //월누계
    		model.addAttribute("SHOP_TO_FM_ENTER_CNT", tempMap.get("TO_FM_ENTER_CNT")); //일일방문수 - 총객층수
    		model.addAttribute("SHOP_TO_F_ENTER_CNT", tempMap.get("TO_F_ENTER_CNT")); //일일방문수 - 여성
    		model.addAttribute("SHOP_TO_M_ENTER_CNT", tempMap.get("TO_M_ENTER_CNT")); //일일방문수 - 남성
    		model.addAttribute("SHOP_TT_FM_TOTAL", tempMap.get("TT_FM_TOTAL")); //월누계 - 총계층수
    		model.addAttribute("SHOP_TT_F_ENTER_CNT", tempMap.get("TT_F_ENTER_CNT")); //월누계 - 여성
    		model.addAttribute("SHOP_TT_M_ENTER_CNT", tempMap.get("TT_M_ENTER_CNT")); //월누계 - 남성
    	}

    	return "mypage";
    }
}
