<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!DOCTYPE>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Ext JS 4.1 & rMate Chart Test Page</title>
	<%@ include file="/common/common.jsp" %>
	<%@ include file="/common/common_chart.jsp" %>
	<script type="text/javascript">
		// -----------------------차트 설정 시작-----------------------
	
		var charTitle = 'rMate 차트 Test';
		var charId = 'chart1';
		var charDiv = 'chart_div';
		// rMate 차트 생성 준비가 완료된 상태 시 호출할 함수를 지정합니다.
		var chartVars = 'rMateOnLoadCallFunction=chartReadyHandler';
	
		// 차트의 속성인 rMateOnLoadCallFunction 으로 설정된 함수.
		// rMate 차트 준비가 완료된 경우 이 함수가 호출됩니다.
		// 이 함수를 통해 차트에 레이아웃과 데이터를 삽입합니다.
		// 파라메터 : id - rMateChartH5.create() 사용 시 사용자가 지정한 id 입니다.
		function chartReadyHandler(id) {
			document.getElementById(id).setLayout(layoutStr);
			document.getElementById(id).setData(chartData);
		}
	
		// 스트링 형식으로 레이아웃 정의.
		var layoutStr = 
			 '<rMateChart backgroundColor="0xFFFFFF" cornerRadius="12" borderStyle="solid">'
			+'	<Options>'
			+'		<Caption text="'+charTitle+'"/>'
			+'		<Legend defaultMouseOverAction="false" useVisibleCheck="true"/>'
			+'	</Options>'
			+'	<Line2DChart showDataTips="true">'
			+'		<horizontalAxis>'
			+'			<CategoryAxis id="hAxis" categoryField="Month" padding="0.5"/>'
			+'		</horizontalAxis>'
			+'		<series>'
			+'			<Line2DSeries yField="CNT" displayName="결과1" labelPosition="up">'
			+'				<showDataEffect>'
			+'					<SeriesInterpolate/>'
			+'				</showDataEffect>'
			+'			</Line2DSeries>'
			+'			<Line2DSeries yField="SUM" displayName="결과2" labelPosition="up">'
			+'				<showDataEffect>'
			+'					<SeriesInterpolate/>'
			+'				</showDataEffect>'
			+'			</Line2DSeries>'
			+'		</series>'
			+'	</Line2DChart>'
			+'</rMateChart>';
	
		// 차트 데이터
		var chartData = [{'Month':'1월','CNT':900,'SUM':100},
						{'Month':'2월','CNT':1400,'SUM':200},
						{'Month':'3월','CNT':1500,'SUM':300},
						{'Month':'4월','CNT':1900,'SUM':400},
						{'Month':'5월','CNT':1400,'SUM':500},
						{'Month':'6월','CNT':2000,'SUM':600},
						{'Month':'7월','CNT':1800,'SUM':700},
						{'Month':'8월','CNT':2500,'SUM':800},
						{'Month':'9월','CNT':3000,'SUM':1000},
						{'Month':'10월','CNT':2000,'SUM':100},
						{'Month':'11월','CNT':2100,'SUM':500},
						{'Month':'12월','CNT':1700,'SUM':1400}];
	
		// -----------------------차트 설정 끝 -----------------------
	</script>
</head>
<body onload="rMateChartH5.create(charId, charDiv, chartVars, '100%', '100%');">
	<!-- 차트가 삽입될 DIV -->
	<div id="chart_div" style="width:100%; height:400px;"></div>
</body>
</html>