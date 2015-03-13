<%@page import="fcas.sys.com.servlet.SystemCode"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link type="text/css" rel="stylesheet" href="<c:url value='/js/rMateChartH5/Assets/rMateChartH5.css'/>"/>

<script type="text/javascript" src="<c:url value='/js/rMateChartH5/rMateChartH5License.js'/>"></script>
<!-- IE7, 8 에서 차트 생성하고자 하는 경우 -->
<script type="text/javascript" src="<c:url value='/js/rMateChartH5/JS/excanvas.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/rMateChartH5/JS/rMateChartH5.js'/>"></script>
<script>
	var sex_cd = '<%=SystemCode.getCode("sex_cd")%>';
	var age_cd = '<%=SystemCode.getCode("age_cd")%>';
	var dov_cd = '<%=SystemCode.getCode("dov_cd")%>';
</script>
<script type="text/javascript" src="<c:url value='/js/common/common_chart.js'/>"></script>