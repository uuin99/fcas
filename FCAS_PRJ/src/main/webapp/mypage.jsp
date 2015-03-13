<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
	<title>Face !nsight</title>
	<%@ include file="/common/common.jsp" %>
	<link type="text/css" rel="stylesheet" href="<c:url value='/css/mypage.css'/>"/>
	<script type="text/javascript">
	var sCnctStrtDate = '${CNCT_STRT_DATE}';
	var sCnctEndDate = '${CNCT_END_DATE}';
	var sLoginPwdChngDate = '${LoginModel.loginPwdChngDate}';
	var sHistDt = '${HIST_DT}';
	
	function fnGoMenu(menu_id, menu_id2, prog_src){
		if (parent.selectedMenuFontObj != null) {
			parent.selectedMenuFontObj.style.color = '#464646';
			parent.selectedMenuFontObj.style.fontSize = '16px';
		}
		parent.selectedMenuFontObj = parent.document.getElementById('font_'+menu_id);
		parent.selectedMenuFontObj.style.color = '#0D68B5';
		parent.selectedMenuFontObj.style.fontSize = '18px';			
		
		
		var eParams = {
			AUTH: parent.gvAuth,
			PRNT_MENU_ID: menu_id
        };
		parent.subMenuStore.proxy.extraParams = eParams;
		parent.subMenuStore.load({
			callback: function(){
				if (parent.selectedProgFontObj != null) {
					parent.selectedProgFontObj.style.color = '#464646';
					parent.selectedProgFontObj.style.fontWeight = '';
			    }
				parent.selectedProgFontObj = parent.document.getElementById('font_'+menu_id2);
				parent.selectedProgFontObj.style.color = '#0D68B5';
				parent.selectedProgFontObj.style.fontWeight = 'bold';

				parent.document.getElementById('content_iframe').src = prog_src;
			}
		});
	}
	
	function fnSetDateFormat(sDate){
		if (sDate.length == 8) {
			return document.write(sDate.substr(0,4)
					+ '년 '
					+ sDate.substr(4,2)
					+ '월 '
					+ sDate.substr(6,2)
					+ '일');
		} else if (sDate.length > 8) {
			return document.write(sDate.substr(0,4)
					+ '년 '
					+ sDate.substr(5,2)
					+ '월 '
					+ sDate.substr(8,2)
					+ '일 '
					+ sDate.substr(11,2)
					+ '시 '
					+ sDate.substr(14,2)
					+ '분');
		} else {
			return document.write('');
		}
	}
	
	
	
	Ext.onReady(function(){
	    Ext.QuickTips.init();

	    fnIframeHeight(700);
	});
	
	//공지사항
	function fnViewNotice(){
		fnGoMenu('c8e96261e54f454145b6d0731397d41f093_7ffb', 
				'177cad6cdfdab63c_63aa75971397b7e2287_7ff1',
				'/mng/brd/CommBrd/selectCommBrdGenNotiSearView.do?PGMNAME=공지사항조회&PGMPATH=홈>매장정보관리');
	}
	
	//사이트이용현황 - 고객문의
	function fnViewSiteOlnReport(){
		fnGoMenu('c8e96261e54f454145b6d0731397d41f093_7ffb', 
				'c8e96261e54f454145b6d0731397d41f093_7fca',
				'/mng/svc/OlnClsMngt/selectOlnClsInqView.do?PGMNAME=고객문의 등록&PGMPATH=홈>매장정보관리');		
	}
	
	//사이트이용현황 - 장애 접수
	function fnViewSiteFalReport(){
		fnGoMenu('c8e96261e54f454145b6d0731397d41f093_7ffb', 
				'177cad6cdfdab63c_63aa75971397b7e2287_7ff0',
				'/mng/svc/FailMngt/selectFailInfoView.do?PGMNAME=장애내역 조회&PGMPATH=홈>매장정보관리');		

	}
	
	//정보변경
	function fnModifyMyInfo(){
		parent.fnOpenMyInfo()
	}	
	</script>
</head>
<body>
<div class="wrap">

  <div class="mypage">
    <div class="mypage_title">마이페이지</div>
    <div class="text7">홈 > 마이페이지</div>
  </div>
  
  <div class="user_line">&nbsp;</div>
  <div class="user_info">
    <div class="user_text">
      <span class="user_icon"><img src="/images/mypage/icon_user.png"></span>
      ${LoginModel.userNm}님 고객분석 서비스 방문을 환영합니다!
    </div>
  </div>
  
  <!-- 공지사항 & 날씨 -->
  <div class="top_all">
   <!-- 공지사항 시작 -->
     <div class="notice_all">
       <div class="notice_title">
          <div class="notice_icon">공지사항</div>
          <div class="notice_more"><a href="javascript:fnViewNotice()"><img src="/images/mypage/btn_notice_more_nor.png" border=0/></a></div>
       </div>
       <div class="notice_list">
           <span class="news"><a href="javascript:fnViewNotice()">${NOTICE_SUBJ_1}</a></span>
           <span class="date">${NOTICE_DATE_1}</span>
       </div>
       <div class="notice_list">
           <span class="news"><a href="javascript:fnViewNotice()">${NOTICE_SUBJ_2}</a></span>
           <span class="date">${NOTICE_DATE_2}</span>
       </div>
       <div class="notice_list">
           <span class="news"><a href="javascript:fnViewNotice()">${NOTICE_SUBJ_3}</a></span>
           <span class="date">${NOTICE_DATE_3}</span>
       </div>
     </div>
   <!-- 공지사항 끝 -->

   <!-- 날씨 시작 -->    
     <div class="weather">
       <div class="notice_title">
          <div class="notice_icon">기준일 날씨</div>
          <div class="user_date">(기준일 : ${STND_DATEYYYY}년 ${STND_DATEMM}월 ${STND_DATEDD}일)</div>
       </div>
       <div class="weather_all">
         <div class="weather_icon"><img src="/images/icon_weather/icon${WEATER_STAT_CD}.png" /></div>
         <div class="weather_info01">
           <span class="weather_line01">${WEATER_STAT_NM}</span>
           <span class="weather_line02">${WEATER_WDIRK}${WEATER_WSPEED}</span>
         </div>  
         <div class="weather_info02">
           <span class="weather_line01">${WEATER_TEMP}</span>
           <span class="weather_line02">${WEATER_HUMI}</span>
         </div> 
       </div>      
      </div>
   <!-- 날씨 시작 -->
  </div>
  <!-- 공지사항 & 날씨 -->
  
  <div class="user_line02">&nbsp;</div>
  
  <!-- 첫번째 테이블(기본정보&최근정보이용) -->
  <div class="table_all01">
    <!-- 기본정보 시작 -->
			<div class="table_sub01">
				<div class="title_bg">
					<div class="title_text"> 기본 정보</div>
                    <div class="title_btn"><a href="javascript:fnModifyMyInfo();"><img src="/images/mypage/btn_change_info_nor.png" border=0 /></a></div>
                </div>
				<div class="table_line">
					<div class="table_sub02_cell01">성명</div>
					<div class="table_sub02_cell02">${LoginModel.userNm}</div>
				</div>
				<div class="table_line">
					<div class="table_sub02_cell01">휴대폰</div>
					<div class="table_sub02_cell02">${LoginModel.cellNo}</div>
				</div>
				<div class="table_line">
					<div class="table_sub02_cell01">메일</div>
					<div class="table_sub02_cell02">${USER_EMAIL}</div>
				</div>
				<div class="table_line">
					<div class="table_sub02_cell01">매장정보</div>
					<div class="table_sub02_cell02">${LoginModel.compNm} - ${LoginModel.shopNm}</div>
				</div>
				<div class="table_line">
					<div class="table_sub02_cell01">이용기간</div>
					<div class="table_sub02_cell02">${CNCT_DATE}</div>
				</div>
			</div>
    <!-- 기본정보 끝 -->
    
	<div class="space">&nbsp;</div>
    
    <!-- 최근 접속 정보 시작 -->
			<div class="table_sub02">
				<div class="title_bg">
					<div class="title_text">최근 접속 정보</div>
                </div>
				<div class="table_line">
					<div class="table_sub02_cell01">비밀번호 변경일</div>
					<div class="table_sub02_cell02"><script>fnSetDateFormat(sLoginPwdChngDate)</script></div>
				</div>
				<div class="table_line">
					<div class="table_sub02_cell01">최종 접속 일시</div>
					<div class="table_sub02_cell02"><script>fnSetDateFormat(sHistDt)</script></div>
				</div>
				<div class="table_line">
					<div class="table_sub02_cell01">최종 접속 IP</div>
					<div class="table_sub02_cell02">${ACES_IP}</div>
				</div>
			</div>
     <!-- 최근 접속 정보 끝 -->
    </div>
  <!-- 첫번째 테이블(기본정보&최근정보이용) -->

  <!-- 타이틀(사이트이용현황) --> 
  <div class="table_all02">
	<div class="title_bg">
	  <div class="title_text">사이트 이용 현황</div>
    </div>
  </div>
  <!-- 타이틀(사이트이용현황) --> 
  
  <!-- 두번째 테이블(사이트이용현황) -->
  <div class="table_all01">
    <!-- 고객문의내역 시작 -->
			<div class="table_sub03">
				<div class="title01_bg">
					<div class="title01_text">고객문의 내역</div>
                    <!-- <div class="title_btn"><a href="#"><img src="/images/mypage/btn_direct_link_nor.png" border=0/></a></div> -->
                </div>
                <div class="table_line01"></div>
					<div class="table_sub03_cell01">합계 <a href="javascript:fnViewSiteOlnReport()">${SITE_OLN_CLS_TOTAL}</a> 건</div>
					<div class="table_sub03_cell01">문의중 <a href="javascript:fnViewSiteOlnReport()">${SITE_OLN_CLS_FN}</a> 건</div>
					<div class="table_sub03_cell02">답변처리 <a href="javascript:fnViewSiteOlnReport()">${SITE_OLN_CLS_FY}</a> 건</div>
                <div class="table_line01"></div>
			</div>
    <!-- 고객문의내역 끝 -->
    
	<div class="space">&nbsp;</div>
    
    <!-- 장애처리내역 시작 -->
			<div class="table_sub03">
				<div class="title01_bg">
					<div class="title01_text">장애처리 내역</div>
                    <!-- <div class="title_btn"><a href="#"><img src="/images/mypage/btn_direct_link_nor.png" border=0/></a></div> -->
                </div>
                <div class="table_line01"></div>
					<div class="table_sub03_cell01">접수 <a href="javascript:fnViewSiteFalReport()">${SITE_FAIL_10}</a> 건</div>
					<div class="table_sub03_cell01">처리 <a href="javascript:fnViewSiteFalReport()">${SITE_FAIL_30}</a> 건</div>
					<div class="table_sub03_cell02">처리중 <a href="javascript:fnViewSiteFalReport()">${SITE_FAIL_20}</a> 건</div>
                <div class="table_line01"></div>
			</div>
     <!-- 장애처리내역 끝 -->
    </div>
  <!-- 두번째 테이블(사이트이용현황) -->
  
  <!-- 타이틀(매장방문현황) --> 
  <div class="table_all02">
	<div class="title_bg">
	  <div class="title_text">매장 방문 현황</div>
    <div class="user_date">(기준일 : ${STND_DATEYYYY}년 ${STND_DATEMM}월 ${STND_DATEDD}일)</div>
    </div>
  </div>
  <!-- 타이틀(매장방문현황) --> 
  
 <!-- 세번째 테이블(매장방문현황) -->
  <div class="table_all01">
    <!-- 입장객수현황 시작 -->
			<div class="table_sub03">
				<div class="title01_bg">
					<div class="title01_text">입장 객수 현황</div>
                </div>
                <div class="table_line01"></div>
				<div class="table_line">
					<div class="table_sub01_cell01">전일</div>
					<div class="table_sub01_cell02">${SHOP_YESTER_ENTER_CNT}</div>
				</div>
				<div class="table_line">
					<div class="table_sub01_cell01">기준일</div>
					<div class="table_sub01_cell02">${SHOP_TODAY_ENTER_CNT}</div>
				</div>
				<div class="table_line">
					<div class="table_sub01_cell01">증감율</div>
					<div class="table_sub01_cell02">${SHOP_PER_ENTER_CNT}</div>
				</div>
				<div class="table_line">
					<div class="table_sub01_cell01">월누계</div>
					<div class="table_sub01_cell02">${SHOP_MONTH_ENTER_CNT}</div>
				</div>
			</div>
    <!-- 입장객수현황 끝 -->
    
	<div class="space">&nbsp;</div>
    
    <!-- 각층별현황 시작 -->
			<div class="table_sub04">
				<div class="title01_bg">
					<div class="title01_text">객층별 현황</div>
                </div>
                <div class="table_line01"></div>
                <div class="table_line02">
					<div class="table_sub04_cell01">구분</div>
					<div class="table_sub04_cell01">일일 방문 수</div>
					<div class="table_sub04_cell02">월누계</div>
                </div>
                <div class="table_line02">
					<div class="table_sub04_cell01">총 객층수</div>
					<div class="table_sub04_cell03">${SHOP_TO_FM_ENTER_CNT}</div>
					<div class="table_sub04_cell04">${SHOP_TT_FM_TOTAL}</div>
                </div>
                <div class="table_line02">
					<div class="table_sub04_cell01">여성</div>
					<div class="table_sub04_cell03">${SHOP_TO_F_ENTER_CNT}</div>
					<div class="table_sub04_cell04">${SHOP_TT_F_ENTER_CNT}</div>
                </div>
                <div class="table_line02">
					<div class="table_sub04_cell01">남성</div>
					<div class="table_sub04_cell03">${SHOP_TO_M_ENTER_CNT}</div>
					<div class="table_sub04_cell04">${SHOP_TT_M_ENTER_CNT}</div>
                </div>
			</div>
     <!-- 각층별현황 끝 -->
    </div>
  <!-- 세번째 테이블(매장방문현황) -->  
</div>
</body>
</html>
