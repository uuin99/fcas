<%@page import="fcas.sys.com.servlet.SystemCode"%>
<%@page import="fcas.sys.com.servlet.SystemMsg"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="/css/report.css" rel="stylesheet" type="text/css" />

<script type="text/javascript" src="/js/jquery/jquery-1.7.1.js"></script>

<link type="text/css" rel="stylesheet" href="<c:url value='/js/rMateChartH5/Assets/rMateChartH5.css'/>"/>
<script type="text/javascript" src="<c:url value='/js/rMateChartH5/rMateChartH5License.js'/>"></script>
<!-- IE7, 8 에서 차트 생성하고자 하는 경우 -->
<script type="text/javascript" src="<c:url value='/js/rMateChartH5/JS/excanvas.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/rMateChartH5/JS/rMateChartH5.js'/>"></script>


<title>Face !nsight</title>



<script type="text/javascript">




function fnOnload() {
	parent.onloadPageYn = "Y";
}




// 숫자에 3자리마다 , 를 찍어서 반환
String.prototype.cvtNumber = function() {
    var num = this.trim();
    while((/(-?[0-9]+)([0-9]{3})/).test(num)) {
        num = num.replace((/(-?[0-9]+)([0-9]{3})/), "$1,$2");
    }
    return num;
}

$(document).ready(function(){
	fnChartShow();

	$(".numfield").each(function(index, item){
		$(this).text($(this).text().cvtNumber());
	});
});

function fnChartShow() {

	var contentHeight = 4216;
	parent.document.getElementById("content_iframe").style.height = (contentHeight)+"px";
	parent.document.getElementById("main").style.height = (contentHeight)+"px";

	// 0-1 입장객수
	rMateChartH5.create('chart_0_1', 'chart_div_0_1',  'rMateOnLoadCallFunction=chartReadyHandler_0_1', '230', '100%');

	// 0-2 시간대별 추이
	rMateChartH5.create('chart_0_2', 'chart_div_0_2',  'rMateOnLoadCallFunction=chartReadyHandler_0_2', '569', '100%');

	// 1-1 성별현황
	rMateChartH5.create('chart_1_1', 'chart_div_1_1',  'rMateOnLoadCallFunction=chartReadyHandler_1_1', '230', '100%');

	// 1-2 연령대별 현황
	rMateChartH5.create('chart_1_2', 'chart_div_1_2',  'rMateOnLoadCallFunction=chartReadyHandler_1_2', '569', '100%');

	// 2-1 성별 / 시간대별 방문 추이
	rMateChartH5.create('chart_2_1', 'chart_div_2_1',  'rMateOnLoadCallFunction=chartReadyHandler_2_1', '819', '100%');

	// 2-2 성별 / 시간대별 방문 추이
	rMateChartH5.create('chart_2_2', 'chart_div_2_2',  'rMateOnLoadCallFunction=chartReadyHandler_2_2', '819', '100%');

	// 3-1-1 기준일 대비 전일비교 ( 성별기준 )
	rMateChartH5.create('chart_3_1_1', 'chart_div_3_1_1',  'rMateOnLoadCallFunction=chartReadyHandler_3_1_1', '302', '100%');

	// 3-1-2 기준일 대비 전일비교 ( 연령대기준 )
	rMateChartH5.create('chart_3_1_2', 'chart_div_3_1_2',  'rMateOnLoadCallFunction=chartReadyHandler_3_1_2', '499', '100%');

	// 3-2-1 기준일 대비 전주 동요일 비교 ( 성별기준 )
	rMateChartH5.create('chart_3_2_1', 'chart_div_3_2_1',  'rMateOnLoadCallFunction=chartReadyHandler_3_2_1', '302', '100%');

	// 3-2-2 기준일 대비 전주 동요일 비교 ( 연령대기준 )
	rMateChartH5.create('chart_3_2_2', 'chart_div_3_2_2',  'rMateOnLoadCallFunction=chartReadyHandler_3_2_2', '499', '100%');

	// 4-1 설치 위치 별 방문자 현황
	rMateChartH5.create('chart_4_1', 'chart_div_4_1',  'rMateOnLoadCallFunction=chartReadyHandler_4_1', '819', '100%');

	// 5-1 일자별 추이 (이전 30일)
	rMateChartH5.create('chart_5_1', 'chart_div_5_1',  'rMateOnLoadCallFunction=chartReadyHandler_5_1', '819', '100%');


}


function chartReadyHandler_0_1(id) {
	document.getElementById(id).setLayout(layoutStr_0_1);
	document.getElementById(id).setData(chartData_0_1);
}

function chartReadyHandler_0_2(id) {
	document.getElementById(id).setLayout(layoutStr_0_2);
	document.getElementById(id).setData(chartData_0_2);
}

function chartReadyHandler_1_1(id) {
	document.getElementById(id).setLayout(layoutStr_1_1);
	document.getElementById(id).setData(chartData_1_1);
}

function chartReadyHandler_1_2(id) {
	document.getElementById(id).setLayout(layoutStr_1_2);
	document.getElementById(id).setData(chartData_1_2);
}

function chartReadyHandler_2_1(id) {
	document.getElementById(id).setLayout(layoutStr_2_1);
	document.getElementById(id).setData(chartData_2_1);
}

function chartReadyHandler_2_2(id) {
	document.getElementById(id).setLayout(layoutStr_2_2);
	document.getElementById(id).setData(chartData_2_2);
}

function chartReadyHandler_3_1_1(id) {
	document.getElementById(id).setLayout(layoutStr_3_1_1);
	document.getElementById(id).setData(chartData_3_1_1);
}
function chartReadyHandler_3_1_2(id) {
	document.getElementById(id).setLayout(layoutStr_3_1_2);
	document.getElementById(id).setData(chartData_3_1_2);
}

function chartReadyHandler_3_2_1(id) {
	document.getElementById(id).setLayout(layoutStr_3_2_1);
	document.getElementById(id).setData(chartData_3_2_1);
}
function chartReadyHandler_3_2_2(id) {
	document.getElementById(id).setLayout(layoutStr_3_2_2); // 레이아웃은 3_2_1과 같은거를 사용한다. !!
	document.getElementById(id).setData(chartData_3_2_2);
}


function chartReadyHandler_4_1(id) {
	document.getElementById(id).setLayout(layoutStr_4_1);
	document.getElementById(id).setData(chartData_4_1);
}

function chartReadyHandler_5_1(id) {
	document.getElementById(id).setLayout(layoutStr_5_1);
	document.getElementById(id).setData(chartData_5_1);
}

var chartData_0_1 = ${data_chart_0_1};
var chartData_0_2 = ${data_chart_0_2};
var chartData_1_1 = ${data_chart_1_1_new};
var chartData_1_2 = ${data_chart_1_2};
var chartData_2_1 = ${data_chart_2_1};
var chartData_2_2 = ${data_chart_2_2};
var chartData_3_1_1 = ${data_chart_3_1_1};
var chartData_3_1_2 = ${data_chart_3_1_2};
var chartData_3_2_1 = ${data_chart_3_2_1};
var chartData_3_2_2 = ${data_chart_3_2_2};
var chartData_4_1 = ${data_chart_4_1};
var chartData_5_1 = ${data_chart_5_1};


var yField1 = "d"+${preDateInfo.YYYYMMDD};     // 전일 기준일
var yField2 = "d"+${nowDateInfo.YYYYMMDD};     // 기준일
var yField3 = "d"+${beforeWeekDateInfo.YYYYMMDD};     // 전주 동요일
var disField1 = ${preDateInfo.MM}+"월"+${preDateInfo.DD}+"일";
var disField2 = ${nowDateInfo.MM}+"월"+${nowDateInfo.DD}+"일";
var disField3 = ${beforeWeekDateInfo.MM}+"월"+${beforeWeekDateInfo.DD}+"일";


//입장객수 현황
var layoutStr_0_1 =
'<rMateChart backgroundColor="white" >'
   +'<SeriesInterpolate id="ss"/>'
   +'<Column2DChart showDataTips="true">'
	   +'<verticalAxis>'
	       +'<LinearAxis id="vAxis"/>'
	   +'</verticalAxis>'
	   +'<verticalAxisRenderers>'
	   	   +'<Axis3DRenderer axis="{vAxis}" visible="false"/>'
	   +'</verticalAxisRenderers>'

       +'<horizontalAxis>'
           +'<CategoryAxis categoryField="stndDate"/>'
       +'</horizontalAxis>'
       /* 배경 이미지 설정*/
	    +'<backgroundElements>'
			+'<Image source="/images/report/s.gif" maintainAspectRatio="false" />'
		+'</backgroundElements>'
       +'<series>'
           +'<Column2DSeries labelPosition="inside" showLabelVertically="true" yField="sumCnt" showDataEffect="{ss}"  maxColumnWidth="20">'
			+ '<fills>'
			+ '<SolidColor color="0x8da616"/>'
			+ '<SolidColor color="0xd9a400"/>'
			+ '</fills>'
            +'</Column2DSeries>'
       +'</series>'

   +'</Column2DChart>'
+'</rMateChart>';


// 시간대별 추이
var layoutStr_0_2 =
	'<rMateChart backgroundColor="white" >'
	+'<NumberFormatter id="numfmt" useThousandsSeparator="true"/>'
    +'<Bar2DChart showDataTips="true">'
        +'<verticalAxis>'
            +'<CategoryAxis id="vAxis" categoryField="time"/>'
        +'</verticalAxis>'
        +'<horizontalAxis><LinearAxis id="hAxis" formatter="{numfmt}"/></horizontalAxis>'
	    /* 배경 이미지 설정*/
	    +'<backgroundElements>'
			+'<Image source="/images/report/s.gif" maintainAspectRatio="false" />'
		+'</backgroundElements>'
        +'<series>'
        /* Bar2D Multi-Sereis 를 생성시에는 Bar2DSeries 여러 개 정의합니다 */
            +'<Bar2DSeries labelPosition="outside" labelAlign="left" xField="cnt" displayName="입장객수" >'
                 +'<showDataEffect>'
                    +'<SeriesInterpolate direction="right"/>'
                +'</showDataEffect>'
				+ '<fills>'

				    + '<SolidColor color="0x8da616"/>'


                + '</fills>'
            +'</Bar2DSeries>'
        +'</series>'
    +'</Bar2DChart>'
+'</rMateChart>';


// 성별현황 그래프 레이아웃 ( 스탠다드 라이센스에서는 이미지차트 지원하지 않아 막대차트로 변경함 )
//var layoutStr_1_1 =
//	'<rMateChart backgroundColor="white" >'
//        +'<NumberFormatter id="numFmt"/>'
//        +'<ImageChart id="chart" showDataTips="true" gutterLeft="20" gutterRight="20" showLabelVertically="true">'
//            +'<horizontalAxis>'
//                +'<CategoryAxis id="hAxis" categoryField="sexNm"/>'
//            +'</horizontalAxis>'
//
//            /* 배경 이미지 설정*/
//            +'<backgroundElements>'
//            	+'<Image source="/images/report/s.gif" maintainAspectRatio="false" />'
//        	+'</backgroundElements>'
//
//            +'<verticalAxis>'
//                +'<LinearAxis id="vAxis" />'
//            +'</verticalAxis>'
//
//            +'<series>'
//            	/* 여자 이미지 설정*/
//	            +'<ImageSeries yField="fCnt" imageDisplayType="single" styleName="seriesStyle2" displayName="여성" formatter="{numFmt}">'
//		            +'<imgSource>'
//						+'<ImageSourceItem maintainAspectRatio="false" url="/images/report/female.png"/>'
//					+'</imgSource>'
//					+'<showDataEffect>'
//		    			+'<SeriesSlide duration="1000" direction="up"/>'
//		 			+'</showDataEffect>'
//				+'</ImageSeries>'
//				/* 남자 이미지 설정*/
//				+'<ImageSeries yField="mCnt" imageDisplayType="single" styleName="seriesStyle" displayName="남성" formatter="{numFmt}">'
//					+'<imgSource>'
//				     	+'<ImageSourceItem maintainAspectRatio="false" url="/images/report/male.png"/>'
//					+'</imgSource>'
//					+'<showDataEffect>'
//						+'<SeriesSlide duration="1000" direction="up"/>'
//					+'</showDataEffect>'
//				+'</ImageSeries>'
//			+'</series>'
//
//			+'<verticalAxisRenderers>'
//				+'<Axis2DRenderer axis="{vAxis}" visible="false" includeInLayout="false"/>'
//			+'</verticalAxisRenderers>'
//		+'</ImageChart>'
//		+'<Style>'
//			+'.seriesStyle{labelPosition:outside;fontFamily:Myriad;color:0x0066FF;fontSize:11;}'
//			+'.seriesStyle2{labelPosition:outside;fontFamily:Myriad;color:0xFF66FF;fontSize:11;}'
//		+'</Style>'
//	+'</rMateChart>';

//  성별현황 그래프 레이아웃 ( 스탠다드 라이센스에서는 이미지차트 지원하지 않아 막대차트로 변경함 )
var layoutStr_1_1 =
	'<rMateChart backgroundColor="white" >'
	   +'<SeriesInterpolate id="ss"/>'
	   +'<Column2DChart showDataTips="true">'
		   +'<verticalAxis>'
		       +'<LinearAxis id="vAxis"/>'
		   +'</verticalAxis>'
		   +'<verticalAxisRenderers>'
		   	   +'<Axis3DRenderer axis="{vAxis}" visible="false"/>'
		   +'</verticalAxisRenderers>'

	       +'<horizontalAxis>'
	           +'<CategoryAxis categoryField="sexNm"/>'
	       +'</horizontalAxis>'
	       /* 배경 이미지 설정*/
		    +'<backgroundElements>'
				+'<Image source="/images/report/s.gif" maintainAspectRatio="false" />'
			+'</backgroundElements>'
	       +'<series>'
	           +'<Column2DSeries labelPosition="inside" showLabelVertically="true" yField="cnt" showDataEffect="{ss}" maxColumnWidth="20">'
				+ '<fills>'
				+ '<SolidColor color="0xd9a400"/>'
				+ '<SolidColor color="0x8da616"/>'
				+ '</fills>'
	            +'</Column2DSeries>'
	       +'</series>'

	   +'</Column2DChart>'
	+'</rMateChart>';



// 연령대별현황 그래프 레이아웃
var layoutStr_1_2 =
	'<rMateChart backgroundColor="white" >'
	       +'<Options>'
	          +'<Legend position="top" direction="horizontal" hAlign="center" useVisibleCheck="true"/>'
	       +'</Options>'

           +'<Column2DChart showDataTips="true" >'
			   +'<verticalAxis>'
					+'<LinearAxis id="vAxis"/>'
			   +'</verticalAxis>'
			   +'<verticalAxisRenderers>'
			   		+'<Axis3DRenderer axis="{vAxis}" visible="false"/>'
			   +'</verticalAxisRenderers>'
               +'<horizontalAxis>'
                   +'<CategoryAxis categoryField="ageNm"/>'
               +'</horizontalAxis>'

   		       /* 배경 이미지 설정*/
   		       +'<backgroundElements>'
   		       	+'<Image source="/images/report/s.gif" maintainAspectRatio="false" />'
   			   +'</backgroundElements>'
               +'<series>'
               /* Coumn2D Multi-Sereis 를 생성시에는 Column2DSeries 여러 개 정의합니다 */
                    +'<Column2DSeries labelPosition="inside" showLabelVertically="true" yField="fCnt" displayName="여성" >'
                    	+'<fill>'
                    		+'<SolidColor color="0xd9a400" />'
                 		+'</fill>'
                        +'<showDataEffect>'
                           +'<SeriesInterpolate/>'
                       +'</showDataEffect>'
                   +'</Column2DSeries>'
                   +'<Column2DSeries labelPosition="inside" showLabelVertically="true" yField="mCnt" displayName="남성" >'
                   		+'<fill>'
                   			+'<SolidColor color="0x8da616" />'
                		+'</fill>'
                        +'<showDataEffect>'
                           +'<SeriesInterpolate/>'
                       +'</showDataEffect>'
                   +'</Column2DSeries>'
               +'</series>'
           +'</Column2DChart>'
       +'</rMateChart>';




// 성별 / 시간대별 방문 추이  그래프 레이아웃
var layoutStr_2_1 =
	'<rMateChart backgroundColor="white" >'
	    +'<Options>'
	       +'<Legend position="top" direction="horizontal" hAlign="center" useVisibleCheck="true"/>'
	    +'</Options>'

		+'<NumberFormatter id="numfmt" useThousandsSeparator="true"/>'
	    +'<Bar2DChart showDataTips="true">'
	        +'<verticalAxis>'
	            +'<CategoryAxis categoryField="time"/>'
	        +'</verticalAxis>'
	        +'<horizontalAxis><LinearAxis id="hAxis" formatter="{numfmt}"/></horizontalAxis>'
		    /* 배경 이미지 설정*/
		    +'<backgroundElements>'
				+'<Image source="/images/report/s.gif" maintainAspectRatio="false" />'
			+'</backgroundElements>'
			+'<series>'
				+'<Bar2DSet type="stacked" showTotalLabel="true" totalLabelJsFunction="totalFunc">'
			        +'<series>'
			        /* Bar2D Multi-Sereis 를 생성시에는 Bar2DSeries 여러 개 정의합니다 */
						+'<Bar2DSeries labelPosition="inside" xField="fCnt" displayName="여성" >'
							+'<showDataEffect>'
								+'<SeriesInterpolate direction="right"/>'
							+'</showDataEffect>'
							+ '<fills>'
								+ '<SolidColor color="0xd9a400"/>'
							+ '</fills>'
		                +'</Bar2DSeries>'
		                +'<Bar2DSeries labelPosition="inside" xField="mCnt" displayName="남성" >'
							+'<showDataEffect>'
								+'<SeriesInterpolate direction="right"/>'
							+'</showDataEffect>'
							+ '<fills>'
								+ '<SolidColor color="0x8da616"/>'
							+ '</fills>'
	                	+'</Bar2DSeries>'
			        +'</series>'
		        +'</Bar2DSet>'
	        +'</series>'
	    +'</Bar2DChart>'
	+'</rMateChart>';



//연령대별/시간대별 방문 추이 그래프  그래프 레이아웃
var layoutStr_2_2 =
	'<rMateChart backgroundColor="white" >'
	    +'<Options>'
	       +'<Legend position="top" direction="horizontal" hAlign="center" useVisibleCheck="true"/>'
	    +'</Options>'
		+'<NumberFormatter id="numfmt" useThousandsSeparator="true"/>'
	    +'<Bar2DChart showDataTips="true">'
	        +'<verticalAxis>'
	            +'<CategoryAxis categoryField="time"/>'
	        +'</verticalAxis>'
	        +'<horizontalAxis><LinearAxis id="hAxis" formatter="{numfmt}"/></horizontalAxis>'
		    /* 배경 이미지 설정*/
		    +'<backgroundElements>'
				+'<Image source="/images/report/s.gif" maintainAspectRatio="false" />'
			+'</backgroundElements>'
	        +'<series>'
	            /*
	            type 속성을 stacked로 변경
	            type속성으로는
	            clustered : 일반적인 다중데이터(차트의 멀티시리즈)방식으로 데이터를 표현합니다.(Default)
	             stacked : 데이터를 위에 쌓아 올린 방식으로 표현 합니다.
	            overlaid : 수치 데이터 값을 겹쳐서 표현 합니다. 주로 목표 위치와 현재 위치를 나타낼 때 많이 쓰입니다.
	             100% : 차트의 수치 데이터를 퍼센티지로 계산 후 값을 퍼센티지로 나타냅니다.
	            */
	            +'<Bar2DSet type="stacked" showTotalLabel="true" totalLabelJsFunction="totalFunc">'
	                 +'<series>'
	                /* Bar2D Stacked 를 생성시에는 Bar2DSeries를 최소 2개 정의합니다 */
	                     +'<Bar2DSeries labelPosition="inside" xField="c00Cnt" displayName="10대 이하" >'
	                         +'<showDataEffect>'
	                            +'<SeriesInterpolate direction="right"/>'
	                         +'</showDataEffect>'
	         				+ '<fills>'
	    					+ '<SolidColor color="0x8da616"/>'
	                    	+ '</fills>'
	                    +'</Bar2DSeries>'
	                    +'<Bar2DSeries labelPosition="inside" xField="c10Cnt" displayName="10대" >'
	                         +'<showDataEffect>'
	                            +'<SeriesInterpolate direction="right"/>'
	                         +'</showDataEffect>'
		         				+ '<fills>'
		    					+ '<SolidColor color="0xd9a400"/>'
		                    	+ '</fills>'
	                    +'</Bar2DSeries>'
	                    +'<Bar2DSeries labelPosition="inside" xField="c20Cnt" displayName="20대" >'
	                         +'<showDataEffect>'
	                            +'<SeriesInterpolate direction="right"/>'
	                         +'</showDataEffect>'
		         				+ '<fills>'
		    					+ '<SolidColor color="0xff4040"/>'
		                    	+ '</fills>'
	                    +'</Bar2DSeries>'
	                    +'<Bar2DSeries labelPosition="inside" xField="c30Cnt" displayName="30대" >'
	                         +'<showDataEffect>'
	                            +'<SeriesInterpolate direction="right"/>'
	                         +'</showDataEffect>'
		         				+ '<fills>'
		    	                + '<SolidColor color="0x109dae"/>'
		                    	+ '</fills>'
	                    +'</Bar2DSeries>'
	                    +'<Bar2DSeries labelPosition="inside" xField="c40Cnt" displayName="40대" >'
	                         +'<showDataEffect>'
	                            +'<SeriesInterpolate direction="right"/>'
	                         +'</showDataEffect>'
		         				+ '<fills>'
		    	                + '<SolidColor color="0xde4490"/>'
		                    	+ '</fills>'
	                    +'</Bar2DSeries>'
	                    +'<Bar2DSeries labelPosition="inside" xField="c50Cnt" displayName="50대" >'
	                         +'<showDataEffect>'
	                            +'<SeriesInterpolate direction="right"/>'
	                         +'</showDataEffect>'
		         				+ '<fills>'
		    	                + '<SolidColor color="0x09a963"/>'
		                    	+ '</fills>'
	                    +'</Bar2DSeries>'
	                    +'<Bar2DSeries labelPosition="inside" xField="c60Cnt" displayName="60대 이상" >'
	                         +'<showDataEffect>'
	                            +'<SeriesInterpolate direction="right"/>'
	                         +'</showDataEffect>'
		         				+ '<fills>'
		    	                + '<SolidColor color="0xf68936"/>'
		                    	+ '</fills>'
	                    +'</Bar2DSeries>'
	                +'</series>'
	            +'</Bar2DSet>'
	        +'</series>'
	    +'</Bar2DChart>'
	+'</rMateChart>';

	function totalFunc(index, data, value)
	{
		var num = ''+value;
	    while((/(-?[0-9]+)([0-9]{3})/).test(num)) {
	        num = num.replace((/(-?[0-9]+)([0-9]{3})/), "$1,$2");
	    }
	    return ' ' + num;
	}





// 전일 대비 비교 =  성별기준
var layoutStr_3_1_1 =
'<rMateChart backgroundColor="white" >'
    +'<Options>'
       +'<Legend position="top" direction="horizontal" hAlign="center" useVisibleCheck="true"/>'
    +'</Options>'
    +'<Column2DChart showDataTips="true">'
		   +'<verticalAxis>'
				+'<LinearAxis id="vAxis"/>'
		   +'</verticalAxis>'
		   +'<verticalAxisRenderers>'
		   		+'<Axis3DRenderer axis="{vAxis}" visible="false"/>'
		   +'</verticalAxisRenderers>'
        +'<horizontalAxis>'
            +'<CategoryAxis categoryField="cNm"/>'
        +'</horizontalAxis>'

	       /* 배경 이미지 설정*/
	       +'<backgroundElements>'
	       	+'<Image source="/images/report/s.gif" maintainAspectRatio="false" />'
		   +'</backgroundElements>'
        +'<series>'
        /* Coumn2D Multi-Sereis 를 생성시에는 Column2DSeries 여러 개 정의합니다 */
             //+'<Column2DSeries labelPosition="outside" yField="'+yField1+'" displayName="'+disField1+'" fillJsFunction="fillJsFunc3_1_x1" >'
             +'<Column2DSeries labelPosition="inside" showLabelVertically="true" yField="'+yField1+'" displayName="'+disField1+'" >'
             	+ '<fills>'
             		+ '<SolidColor color="0x8da616"/>'
         		+ '</fills>'
             	+'<showDataEffect>'
                    +'<SeriesInterpolate/>'
                +'</showDataEffect>'
            +'</Column2DSeries>'
            //+'<Column2DSeries labelPosition="outside" yField="'+yField2+'" displayName="'+disField2+'"  fillJsFunction="fillJsFunc3_1_x2">'
            +'<Column2DSeries labelPosition="inside" showLabelVertically="true" yField="'+yField2+'" displayName="'+disField2+'" >'
            	+ '<fills>'
     				+ '<SolidColor color="0xd9a400"/>'
 				+ '</fills>'
            	+'<showDataEffect>'
                    +'<SeriesInterpolate/>'
                +'</showDataEffect>'
            +'</Column2DSeries>'
        +'</series>'
    +'</Column2DChart>'
+'</rMateChart>';

var colorCntx1 = 0;
function fillJsFunc3_1_x1(seriesId, index, data, values)
{
	var rValue = "0x071918";
	colorCntx1++;
    if(colorCntx1 == 1) rValue = "0xCC2EFA";
    else if(colorCntx1 == 2) rValue = "0xFF8000";
    else if(colorCntx1 == 3) rValue = "0x5858FA";
    else rValue =  "0x071918";
    return rValue ;
}
var colorCntx2 = 0;
function fillJsFunc3_1_x2(seriesId, index, data, values)
{
	var rValue = "0x071918";
	colorCntx2++;
    if(colorCntx2 == 1) rValue = "0xDA81F5";
    else if(colorCntx2 == 2) rValue = "0xFAAC58";
    else if(colorCntx2 == 3) rValue = "0x819FF7";
    else rValue =  "0x071918";
    return rValue ;
}


//전일 대비 비교 =  연령대기준
var layoutStr_3_1_2 =
'<rMateChart backgroundColor="white" >'
    +'<Options>'
       +'<Legend position="top" direction="horizontal" hAlign="center" useVisibleCheck="true"/>'
    +'</Options>'
    +'<Column2DChart showDataTips="true">'
		   +'<verticalAxis>'
				+'<LinearAxis id="vAxis"/>'
		   +'</verticalAxis>'
		   +'<verticalAxisRenderers>'
		   		+'<Axis3DRenderer axis="{vAxis}" visible="false"/>'
		   +'</verticalAxisRenderers>'
     +'<horizontalAxis>'
         +'<CategoryAxis categoryField="cNm"/>'
     +'</horizontalAxis>'

	       /* 배경 이미지 설정*/
	       +'<backgroundElements>'
	       	+'<Image source="/images/report/s.gif" maintainAspectRatio="false" />'
		   +'</backgroundElements>'
     +'<series>'
     /* Coumn2D Multi-Sereis 를 생성시에는 Column2DSeries 여러 개 정의합니다 */
          //+'<Column2DSeries labelPosition="outside" yField="'+yField1+'" displayName="'+disField1+'" fillJsFunction="fillJsFunc3_2_x1" >'
          +'<Column2DSeries labelPosition="inside" showLabelVertically="true" yField="'+yField1+'" displayName="'+disField1+'"  >'
          	+ '<fills>'
   				+ '<SolidColor color="0x8da616"/>'
			+ '</fills>'
          	 +'<showDataEffect>'
                 +'<SeriesInterpolate/>'
             +'</showDataEffect>'
         +'</Column2DSeries>'
         //+'<Column2DSeries labelPosition="outside" yField="'+yField2+'" displayName="'+disField2+'"  fillJsFunction="fillJsFunc3_2_x2">'
         +'<Column2DSeries labelPosition="inside" showLabelVertically="true" yField="'+yField2+'" displayName="'+disField2+'" >'
         	+ '<fills>'
				+ '<SolidColor color="0xd9a400"/>'
			+ '</fills>'
         	+'<showDataEffect>'
                 +'<SeriesInterpolate/>'
             +'</showDataEffect>'
         +'</Column2DSeries>'
     +'</series>'
 +'</Column2DChart>'
+'</rMateChart>';

var colorCntx3 = 0; // 변수 초기화
function fillJsFunc3_2_x1(seriesId, index, data, values)
{
	 var rValue = "0x071918";
	 colorCntx3++;
	 if(colorCntx3 == 1) rValue = "0xCC2EFA";
	 else rValue =  "0x6E6E6E";
 	return rValue ;
}
var colorCntx4 = 0;// 변수 초기화
function fillJsFunc3_2_x2(seriesId, index, data, values)
{
	var rValue = "0x071918";
	colorCntx4++;
 	if(colorCntx4 == 1) rValue = "0xDA81F5";
 	else rValue =  "0xA4A4A4";
 	return rValue ;
}

// 전주 대비 비교 =  성별기준
var layoutStr_3_2_1 =
'<rMateChart backgroundColor="white" >'
    +'<Options>'
       +'<Legend position="top" direction="horizontal" hAlign="center" useVisibleCheck="true"/>'
    +'</Options>'
    +'<Column2DChart showDataTips="true">'
		   +'<verticalAxis>'
				+'<LinearAxis id="vAxis"/>'
		   +'</verticalAxis>'
		   +'<verticalAxisRenderers>'
		   		+'<Axis3DRenderer axis="{vAxis}" visible="false"/>'
		   +'</verticalAxisRenderers>'
        +'<horizontalAxis>'
            +'<CategoryAxis categoryField="cNm"/>'
        +'</horizontalAxis>'

	       /* 배경 이미지 설정*/
	       +'<backgroundElements>'
	       	+'<Image source="/images/report/s.gif" maintainAspectRatio="false" />'
		   +'</backgroundElements>'
        +'<series>'
        /* Coumn2D Multi-Sereis 를 생성시에는 Column2DSeries 여러 개 정의합니다 */
             +'<Column2DSeries labelPosition="inside" showLabelVertically="true" yField="'+yField3+'" displayName="'+disField3+'" >'
          		+ '<fills>'
					+ '<SolidColor color="0x8da616"/>'
				+ '</fills>'
             	+'<showDataEffect>'
                    +'<SeriesInterpolate/>'
                +'</showDataEffect>'
            +'</Column2DSeries>'
            +'<Column2DSeries labelPosition="inside" showLabelVertically="true" yField="'+yField2+'" displayName="'+disField2+'" >'
            	+ '<fills>'
					+ '<SolidColor color="0xd9a400"/>'
				+ '</fills>'
            	+'<showDataEffect>'
                    +'<SeriesInterpolate/>'
                +'</showDataEffect>'
            +'</Column2DSeries>'
        +'</series>'
    +'</Column2DChart>'
+'</rMateChart>';


//전주 대비 비교 =  연령대기준
var layoutStr_3_2_2 =
'<rMateChart backgroundColor="white" >'
+'<Options>'
   +'<Legend position="top" direction="horizontal" hAlign="center" useVisibleCheck="true"/>'
+'</Options>'
+'<Column2DChart showDataTips="true">'
		   +'<verticalAxis>'
				+'<LinearAxis id="vAxis"/>'
		   +'</verticalAxis>'
		   +'<verticalAxisRenderers>'
		   		+'<Axis3DRenderer axis="{vAxis}" visible="false"/>'
		   +'</verticalAxisRenderers>'
   +'<horizontalAxis>'
       +'<CategoryAxis categoryField="cNm"/>'
   +'</horizontalAxis>'

	       /* 배경 이미지 설정*/
	       +'<backgroundElements>'
	       	+'<Image source="/images/report/s.gif" maintainAspectRatio="false" />'
		   +'</backgroundElements>'
   +'<series>'
   /* Coumn2D Multi-Sereis 를 생성시에는 Column2DSeries 여러 개 정의합니다 */
        //+'<Column2DSeries labelPosition="outside" yField="'+yField1+'" displayName="'+disField1+'" fillJsFunction="fillJsFunc3_2_x1" >'
        +'<Column2DSeries labelPosition="inside" showLabelVertically="true" yField="'+yField3+'" displayName="'+disField3+'"  >'
        	+ '<fills>'
				+ '<SolidColor color="0x8da616"/>'
			+ '</fills>'
        	+'<showDataEffect>'
               +'<SeriesInterpolate/>'
           +'</showDataEffect>'
       +'</Column2DSeries>'
       //+'<Column2DSeries labelPosition="outside" yField="'+yField2+'" displayName="'+disField2+'"  fillJsFunction="fillJsFunc3_2_x2">'
       +'<Column2DSeries labelPosition="inside" showLabelVertically="true" yField="'+yField2+'" displayName="'+disField2+'" >'
       		+ '<fills>'
				+ '<SolidColor color="0xd9a400"/>'
			+ '</fills>'
       		+'<showDataEffect>'
               +'<SeriesInterpolate/>'
           +'</showDataEffect>'
       +'</Column2DSeries>'
   +'</series>'
+'</Column2DChart>'
+'</rMateChart>';



// 4-1 설치 위치 별 방문자 현황
var layoutStr_4_1 =
	'<rMateChart backgroundColor="white" >'
        +'<Options>'
           +'<Legend position="top" direction="horizontal" hAlign="center" useVisibleCheck="true"/>'
        +'</Options>'
		+'<Combination2DChart showDataTips="true">'
			+'<horizontalAxis>'
				+'<CategoryLinearAxis id="hAxis" categoryField="cmraGrpNm"/>'
			+'</horizontalAxis>'

			/*
            +'<verticalAxis>'
            	+'<LinearAxis id="axis1"/>'
        	+'</verticalAxis>'
			*/

			+'<verticalAxis>'
				+'<LinearAxis id="axis1"/>'
			+'</verticalAxis>'
			+'<verticalAxisRenderers>'
				+'<Axis2DRenderer axis="{axis1}" visible="false"/>'
			+'</verticalAxisRenderers>'

			+'<horizontalAxisRenderers>'
				+'<ScrollableAxisRenderer axis="{hAxis}" visibleItemSize="5" scrollSensitivity="1"/>'
			+'</horizontalAxisRenderers>'

			 /* 배경 이미지 설정 */
			+'<backgroundElements>'
				+'<Image source="/images/report/s.gif" maintainAspectRatio="false" />'
			+'</backgroundElements>'

			+'<series>'
			/* Combination3D Multi-Series 를 생성시에는 넣고자 하는 series를 여러개 정의합니다 */
				+'<Column2DSet type="stacked">'
					+'<series>'
						+'<Column2DSeries labelPosition="inside" yField="fCnt" displayName="여성" maxColumnWidth="20">'
	                    	+'<fill>'
	                			+'<SolidColor color="0xd9a400" />'
	             			+'</fill>'
							+'<showDataEffect>'
								+'<SeriesInterpolate/>'
							+'</showDataEffect>'
						+'</Column2DSeries>'
						+'<Column2DSeries labelPosition="inside" yField="mCnt" displayName="남성" maxColumnWidth="20">'
	                   		+'<fill>'
	               				+'<SolidColor color="0x8da616" />'
	            			+'</fill>'
							+'<showDataEffect>'
								+'<SeriesInterpolate/>'
							+'</showDataEffect>'
						+'</Column2DSeries>'
					+'</series>'
				+'</Column2DSet>'

				+'<Line2DSeries labelPosition="up" yField="allEnterCnt" displayName="총입장객수">'
					/*
	                +'<verticalAxis>'
	                	+'<LinearAxis id="axis2"/>'
	            	+'</verticalAxis>'
	            	*/
					+'<showDataEffect>'
						+'<SeriesInterpolate/>'
					+'</showDataEffect>'
					+'<filters>'
						+'<DropShadowFilter distance="3" color="0x666666" alpha=".8"/>'
					+'</filters>'
					+'<lineStroke>'
						+'<Stroke color="0xff4040" weight="4"/>'
					+'</lineStroke>'
				+'</Line2DSeries>'

			+'</series>'
			/* 차트에서 각각의 시리즈가 만든 축을 참조하도록 합니다 */
			/*
            +'<verticalAxisRenderers>'
                +'<Axis2DRenderer axis="{axis1}"/>'
                +'<Axis2DRenderer axis="{axis2}"/>'
            +'</verticalAxisRenderers>'
            */
		+'</Combination2DChart>'
	+'</rMateChart>';




	// 5-1 일자별 추이 (이전 30일)
	var layoutStr_5_1 =
		'<rMateChart backgroundColor="white" >'
            +'<Options>'
               +'<Legend position="top" direction="horizontal" hAlign="center" useVisibleCheck="true"/>'
            +'</Options>'
			+'<Combination2DChart showDataTips="true">'
				+'<horizontalAxis>'
					+'<CategoryLinearAxis id="hAxis" categoryField="stndDate"/>'
				+'</horizontalAxis>'

				/*
	            +'<verticalAxis>'
	            	+'<LinearAxis id="axis1"/>'
	        	+'</verticalAxis>'
				*/

				+'<verticalAxis>'
					+'<LinearAxis id="axis1"/>'
				+'</verticalAxis>'
				+'<verticalAxisRenderers>'
					+'<Axis2DRenderer axis="{axis1}" visible="false"/>'
				+'</verticalAxisRenderers>'

				+'<horizontalAxisRenderers>'
					+'<ScrollableAxisRenderer axis="{hAxis}" visibleItemSize="15" scrollSensitivity="1"/>'
				+'</horizontalAxisRenderers>'

				 /* 배경 이미지 설정 */
				+'<backgroundElements>'
					+'<Image source="/images/report/s.gif" maintainAspectRatio="false" />'
				+'</backgroundElements>'

				+'<series>'
				/* Combination3D Multi-Series 를 생성시에는 넣고자 하는 series를 여러개 정의합니다 */
					+'<Column2DSet type="stacked">'
						+'<series>'
							+'<Column2DSeries labelPosition="inside"   yField="fCnt" displayName="여성">'
		                    	+'<fill>'
		                			+'<SolidColor color="0xd9a400" />'
		             			+'</fill>'
								+'<showDataEffect>'
									+'<SeriesInterpolate/>'
								+'</showDataEffect>'
							+'</Column2DSeries>'
							+'<Column2DSeries labelPosition="inside" yField="mCnt" displayName="남성">'
		                   		+'<fill>'
		               				+'<SolidColor color="0x8da616" />'
		            			+'</fill>'
								+'<showDataEffect>'
									+'<SeriesInterpolate/>'
								+'</showDataEffect>'
							+'</Column2DSeries>'
						+'</series>'
					+'</Column2DSet>'

					+'<Line2DSeries labelPosition="up" yField="sumCnt" displayName="총입장객수">'
						/*
		                +'<verticalAxis>'
		                	+'<LinearAxis id="axis2"/>'
		            	+'</verticalAxis>'
		            	*/
						+'<showDataEffect>'
							+'<SeriesInterpolate/>'
						+'</showDataEffect>'
						+'<filters>'
							+'<DropShadowFilter distance="3" color="0x666666" alpha=".8"/>'
						+'</filters>'
						+'<lineStroke>'
							+'<Stroke color="0xff4040" weight="4"/>'
						+'</lineStroke>'
					+'</Line2DSeries>'

				+'</series>'
				/* 차트에서 각각의 시리즈가 만든 축을 참조하도록 합니다 */
				/*
	            +'<verticalAxisRenderers>'
	                +'<Axis2DRenderer axis="{axis1}"/>'
	                +'<Axis2DRenderer axis="{axis2}"/>'
	            +'</verticalAxisRenderers>'
	            */
			+'</Combination2DChart>'
		+'</rMateChart>';


// 인쇄버튼 팝업
function fnPopupPrint() {

	var title = "_title_p";
	var popUpWidth = 900;// popUpWidth
	var popUpHeight = 670;// popUpHeight

    var sndParamStr = ', width=' + popUpWidth + ', height=' + popUpHeight;
    var thrdParamStr = ', toolbar=0, directories=0, status=0, menubar=0, scrollbars=yes, resizable=1';
    var scrnWidth = (screen.width/2) - (popUpWidth/2);
    var scrnHeight = (screen.height/2) - (popUpHeight/2);
    var frtParamStr = 'top=' + scrnHeight + ', left=' + scrnWidth;

    var url = "/cus/fad/ShopStrdReport/selectShopStrdReportCpaPrint.do";

	var fx = window.open( url,
	            		 title,
			             frtParamStr + sndParamStr + thrdParamStr
		                );

	fx.focus();

}
</script>


</head>

<body onload="fnOnload();">

<div class="contents">

  <div class="location">
      <ul>
        <li>홈&nbsp;&gt;</li>
        <li>매장분석&nbsp;&gt;</li>
        <li>기본레포트&nbsp;</li>
    </ul>
  </div>

  <div class="space03"></div>

  <div class="store">
  <!-- 상단 매장정보 테이블 시작 -->
   <table cellpadding="0" cellspacing="0" border=0 width="767" height="50" class="tb1_type">
     <colgroup>
       <col width=190 />
       <col width=144 />
       <col width=1 />
       <col width=210 />
       <col width=1 />
       <col width=100 />
       <col width=1 />
       <col width=120 />
     </colgroup>
     <tr>
       <th rowspan="2" style="background-image:url('/images/report/logo_bg.png');"><img src="/sys/com/Common/loadImage.do?FILE_UID=${LoginModel.logoFileNm}&FILE_SEQ=1" width="160" height="37" onerror="this.src='/images/report/nologo.png';" /></th>
       <th>고객사명</th>
       <th rowspan="2"><img src="/images/report/report_line.png" /></th>
       <th>기준일자</th>
       <th rowspan="2"><img src="/images/report/report_line.png" /></th>
       <th>기온</th>
       <th rowspan="2"><img src="/images/report/report_line.png" /></th>
       <th>날씨</th>
     </tr>
     <tr>
       <td>${LoginModel.compNm}</td>
       <td>${nowDateInfo.YYYY}년 ${nowDateInfo.MM}월 ${nowDateInfo.DD}일 ${nowDateInfo.DATE_NAME}요일</td>
       <td>${wthInfo.TEMP}도</td>
       <td>${wthInfo.KWTH_STAT_NM}</td>
     </tr>
   </table>
  <!-- 상단 매장정보 테이블 끝 -->
  </div>


<!-- 인쇄버튼 -->
  <div class="space01"></div>
  <div class="print"><!--input type="image" onclick="fnPopupPrint();" src="/images/report/btn_print_nor.png" onmouseover="this.src='/images/report/btn_print_click.png'" onmouseout="this.src='/images/report/btn_print_nor.png'"/--></div>

  <div class="space02"></div>






<!-- 0.입장객수 현황 -->
  <!-- 파란색 타이틀 -->
  <div class="blue_title">
   <ul>
     <li><img src="/images/report/1.png" /></li>
     <li class="blue_text">입장객수 현황</li>
   </ul>
  </div>
  <!-- 파란색 타이틀 -->

  <div class="space03"></div>

<!-- 1-1) 전일 대비 현황  -->
  <div class="graph_all">

    <div class="graph_01">

      <div class="grap_title">
         <ul>
           <li><img src="/images/report/1-1.png" /></li>
           <li class="grap_text">전일 대비 현황</li>
         </ul>
      </div>

      <div class="space01"></div>
      <!-- 그래프 영역
      <div><img src="/images/report/sample_graph01.gif" /></div>
      -->
      <div id="chart_div_0_1" style="width:208px; height:200Px;" ></div>
     <!-- 그래프 영역 -->
    </div>

    <div class="graph_space01"></div>

    <div class="graph_02">

      <div class="grap_title">
         <ul>
           <li><img src="/images/report/1-2.png" /></li>
           <li class="grap_text">시간대별 추이</li>
         </ul>
      </div>
      <div class="space01"></div>
      <!-- 그래프 영역
      <div><img src="/images/report/sample_graph02.gif" /></div>
      -->
      <div id="chart_div_0_2" style="width:547px; height:200Px;" ></div>

      <!-- 그래프 영역 -->
    </div>

  </div>
<!-- 1 성별/연령대별 방문 현황 그래프 -->

  <div class="space02"></div>

  <div class="box"> ${sisa_0} </div>
<!-- 1.성별/연령대별 방문 현황 끝 -->



  <div class="space06"></div>


<!-- 1.객층수 현황 -->
  <!-- 파란색 타이틀 -->
  <div class="blue_title">
   <ul>
     <li><img src="/images/report/2.png" /></li>
     <li class="blue_text">객층수 현황</li>
   </ul>
  </div>
  <!-- 파란색 타이틀 -->

  <div class="space03"></div>

<!-- 1 성별/연령대별 방문 현황 그래프 -->
  <div class="graph_all">

    <div class="graph_01">
      <div class="grap_title">
         <ul>
           <li><img src="/images/report/2-1.png" /></li>
           <li class="grap_text">성별현황</li>
         </ul>
      </div>
      <div class="space01"></div>
      <!-- 그래프 영역
      <div><img src="/images/report/sample_graph01.gif" /></div>
      -->
      <div id="chart_div_1_1" style="width:208px; height:200Px;" ></div>
      <!-- 성별현황 테이블 시작 -->
      <div class="graph_table01">
         <table cellpadding="0" cellspacing="0" class="state_01">
            <tr>
               <td colspan="2" class="line01"></td>
            </tr>
            <tr>
               <td class="text01">객층합계</td>
               <td class="text02"><span class="numfield">${tableData_1_1.totCnt}</span>명</td>
            </tr>
            <tr>
               <td colspan="2" class="dot01"></td>
            </tr>
            <tr>
               <td class="text01">여성</td>
               <td class="text02"><span class="numfield">${tableData_1_1.fCnt}</span>명</td>
            </tr>
            <tr>
               <td colspan="2" class="dot01"></td>
            </tr>
            <tr>
               <td class="text01">남성</td>
               <td class="text02"><span class="numfield">${tableData_1_1.mCnt}</span>명</td>
            </tr>
            <tr>
               <td colspan="2" class="line02"></td>
            </tr>
          </table>
      </div>
      <!-- 성별현황 테이블 시작 -->
      <!-- 그래프 영역 -->
    </div>

    <div class="graph_space01"></div>

    <div class="graph_02">
      <div class="grap_title">
         <ul>
           <li><img src="/images/report/2-2.png" /></li>
           <li class="grap_text">연령대별 현황</li>
         </ul>
      </div>
      <div class="space01"></div>
      <!-- 그래프 영역
      <div><img src="/images/report/sample_graph02.gif" /></div>
      -->
      <div id="chart_div_1_2" style="width:547px; height:200Px;" ></div>

      <!-- 연령대별현황 테이블 시작 -->
      <div class="graph_table02">
         <table cellpadding="0" cellspacing="0" class="state_02">
            <tr>
               <td colspan="8" class="line01"></td>
            </tr>
            <tr>
               <td class="text01">연령구분</td>
               <th>10대&nbsp;↓</th>
               <th>10대</th>
               <th>20대</th>
               <th>30대</th>
               <th>40대</th>
               <th>50대</th>
               <th>60대&nbsp;↑</th>
            </tr>
            <tr>
               <td colspan="8" class="dot01"></td>
            </tr>
            <tr>
               <td class="text01">객층수</td>
               <td class="text02 numfield">${tableData_1_2.c00Cnt}</td>
               <td class="text02 numfield">${tableData_1_2.c10Cnt}</td>
               <td class="text02 numfield">${tableData_1_2.c20Cnt}</td>
               <td class="text02 numfield">${tableData_1_2.c30Cnt}</td>
               <td class="text02 numfield">${tableData_1_2.c40Cnt}</td>
               <td class="text02 numfield">${tableData_1_2.c50Cnt}</td>
               <td class="text02 numfield">${tableData_1_2.c60Cnt}</td>
            </tr>
            <tr>
               <td colspan="8" class="dot01"></td>
            </tr>
            <tr>
               <td class="text01">비율(%)</td>
               <td class="text02">${tableData_1_2.per00}</td>
               <td class="text02">${tableData_1_2.per10}</td>
               <td class="text02">${tableData_1_2.per20}</td>
               <td class="text02">${tableData_1_2.per30}</td>
               <td class="text02">${tableData_1_2.per40}</td>
               <td class="text02">${tableData_1_2.per50}</td>
               <td class="text02">${tableData_1_2.per60}</td>
            </tr>
            <tr>
               <td colspan="8" class="line02"></td>
            </tr>
          </table>
      </div>
      <!-- 연령대별현황 테이블 시작 -->
      <!-- 그래프 영역 -->
    </div>

  </div>
<!-- 1 성별/연령대별 방문 현황 그래프 -->

  <div class="space02"></div>

  <div class="box"> ${sisa_1_2} </div>
<!-- 1.성별/연령대별 방문 현황 끝 -->



  <div class="space03"></div>

  <!-- 2-1 성별/연령대별 방문 추이 그래프 -->
  <div class="graph_all">

    <div class="graph_03">
      <div class="grap_title">
         <ul>
           <li><img src="/images/report/2-3.png" /></li>
           <li class="grap_text">시간대별 / 성별 추이</li>
         </ul>
      </div>
      <div class="space01"></div>
      <!-- 그래프 영역 -->
      <!--
      <div><img src="/images/report/sample_graph03.gif" /></div>
       -->
      <!-- 그래프 영역 -->
      <div id="chart_div_2_1" style="width:797px; height:325Px;" ></div>
    </div>
  </div>


  <!-- 2-1 성별/연령대별 방문 추이 그래프 -->

  <div class="space02"></div>

  <div class="box"> ${sisa_2_1} </div>

  <div class="space03"></div>

  <!-- 2-2 연령대별/시간대별 방문 추이 그래프 -->
  <div class="graph_all">

    <div class="graph_03">
      <div class="grap_title">
         <ul>
           <li><img src="/images/report/2-4.png" /></li>
           <li class="grap_text">시간대별 / 연령대별 추이</li>
         </ul>
      </div>
      <div class="space01"></div>
      <!-- 그래프 영역 -->
      <!--
      <div><img src="/images/report/sample_graph03.gif" /></div>
       -->
      <!-- 그래프 영역 -->
      <div id="chart_div_2_2" style="width:797px; height:325Px;" ></div>
    </div>

   </div>
  <!-- 2-2 연령대별/시간대별 방문 추이 그래프 -->

  <div class="space02"></div>

  <div class="box"> ${sisa_2_2} </div>
<!-- 2.시간대별 방문 추이 끝 -->

  <div class="space06"></div>


<!-- 3.비교분석 시작 -->
  <!-- 파란색 타이틀 -->
  <div class="blue_title">
   <ul>
     <li><img src="/images/report/3.png" /></li>
     <li class="blue_text">객층 비교 현황</li>
   </ul>
  </div>
  <!-- 파란색 타이틀 -->

  <div class="space03"></div>

  <div class="grap_title">
     <ul>
       <li><img src="/images/report/3-1.png" /></li>
       <li class="grap_text">전일 대비 비교 현황</li>
     </ul>
  </div>

  <div class="space03"></div>

  <!-- 3-1 기준일 대비 전일비교 그래프-->
  <div class="graph_all">

    <div class="graph_04">
      <div class="box_bg01">
        <div class="grap_text">성별기준</div>
        <div class="box_date"><b>전일</b> ${preDateInfo.YYYY}.${preDateInfo.MM}.${preDateInfo.DD} (${preDateInfo.DATE_NAME})</div>
      </div>
      <div class="space01"></div>
      <!-- 그래프 영역 -->
      <!--
      <div><img src="/images/report/sample_graph04.gif" /></div>
      -->
      <!-- 그래프 영역 -->
      <div id="chart_div_3_1_1" style="width:280px; height:240Px;" ></div>
    </div>

    <div class="graph_space01"></div>

    <div class="graph_05">
      <div class="box_bg02">
        <div class="grap_text">연령대기준</div>
        <div class="box_date"><b>전일</b> ${preDateInfo.YYYY}.${preDateInfo.MM}.${preDateInfo.DD} (${preDateInfo.DATE_NAME})</div>
      </div>
      <div class="space01"></div>
      <!-- 그래프 영역 -->
      <!--
      <div><img src="/images/report/sample_graph05.gif" /></div>
       -->
      <!-- 그래프 영역 -->
      <div id="chart_div_3_1_2" style="width:477px; height:240Px;" ></div>
    </div>

  </div>
  <!-- 3-1 기준일 대비 전일비교 그래프-->

  <div class="space02"></div>

  <div class="box2"> ${sisa_3_1} </div>

  <div class="space03"></div>

  <div class="grap_title">
     <ul>
       <li><img src="/images/report/3-2.png" /></li>
       <li class="grap_text">전주 동요일 대비 비교 현황</li>
     </ul>
  </div>

  <div class="space03"></div>

  <!-- 3-2 기준일 대비 전주 동요일 비교 그래프 -->
  <div class="graph_all">

    <div class="graph_04">
      <div class="box_bg01">
        <div class="grap_text">성별기준</div>
        <div class="box_date"><b>전주 동요일</b> ${beforeWeekDateInfo.YYYY}.${beforeWeekDateInfo.MM}.${beforeWeekDateInfo.DD} (${beforeWeekDateInfo.DATE_NAME})</div>
      </div>
      <div class="space01"></div>
      <!-- 그래프 영역 -->
      <!--
      <div><img src="/images/report/sample_graph04.gif" /></div>
       -->
        <!--  그래프 영역 -->

      <div id="chart_div_3_2_1" style="width:280px; height:240Px;" ></div>

    </div>

    <div class="graph_space01"></div>

    <div class="graph_05">
      <div class="box_bg02">
        <div class="grap_text">연령대기준</div>
        <div class="box_date"><b>전주 동요일</b> ${beforeWeekDateInfo.YYYY}.${beforeWeekDateInfo.MM}.${beforeWeekDateInfo.DD} (${beforeWeekDateInfo.DATE_NAME})</div>
      </div>

      <div class="space01"></div>
      <!-- 그래프 영역 -->
      <!--
      <div><img src="/images/report/sample_graph05.gif" /></div>
       -->
        <!--그래프 영역 -->

      <div id="chart_div_3_2_2" style="width:477px; height:240Px;" ></div>

    </div>

  <div class="space02"></div>

  <div class="box2"> ${sisa_3_2} </div>

  </div>



<!-- 3.비교분석 끝 -->


  <div class="space06"></div>

<!-- 4.유입정보 시작 -->
  <!-- 파란색 타이틀 -->
  <div class="blue_title">
   <ul>
     <li><img src="/images/report/4.png" /></li>
     <li class="blue_text">매장별 현황</li>
   </ul>
  </div>
  <!-- 파란색 타이틀 -->


  <div class="space03"></div>

  <!-- 4-1 설치 위치 별 방문자 현황 그래프 -->
  <div class="graph_all">
    <div class="graph_03">
    <!--
      <div class="grap_title">
         <ul>
           <li><img src="/images/report/4-1.png" /></li>
           <li class="grap_text">설치 위치 별 방문자 현황</li>
         </ul>
      </div>
      <div class="space01"></div>
     -->
      <!-- 그래프 영역
      <div><img src="/images/report/sample_graph03.gif" /></div>
        그래프 영역 -->
      <div id="chart_div_4_1" style="width:797px; height:240Px;" ></div>
    </div>
    <!-- 4-1 카메라 위치 별 방문자 현황 그래프 -->
	<div class="space02"></div>
	<div class="box"> ${sisa_4_1} </div>
  </div>
<!-- 4.유입정보 끝 -->





  <div class="space06"></div>

<!-- 5.일자별추이 시작 -->
  <!-- 파란색 타이틀 -->
  <div class="blue_title">
   <ul>
     <li><img src="/images/report/5.png" /></li>
     <li class="blue_text">일자별 추이 (이전 30일)</li>
   </ul>
  </div>
  <!-- 파란색 타이틀 -->


  <div class="space03"></div>

  <!-- 4-1 설치 위치 별 방문자 현황 그래프 -->
  <div class="graph_all">
    <div class="graph_03">
    <!--
      <div class="grap_title">
         <ul>
           <li><img src="/images/report/4-1.png" /></li>
           <li class="grap_text">설치 위치 별 방문자 현황</li>
         </ul>
      </div>
      <div class="space01"></div>
     -->
      <!-- 그래프 영역
      <div><img src="/images/report/sample_graph03.gif" /></div>
        그래프 영역 -->
      <div id="chart_div_5_1" style="width:797px; height:420Px;" ></div>
    </div>
    <!-- 4-1 카메라 위치 별 방문자 현황 그래프 -->
	<div class="space02"></div>
	<!--
	<div class="box"> ${sisa_4_1} </div>
	 -->
  </div>
<!--  5.일자별추이 끝 -->


</div>

</body>
</html>
