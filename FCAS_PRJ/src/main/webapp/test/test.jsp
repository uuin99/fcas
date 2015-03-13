<%@page import="fcas.sys.com.servlet.SystemMsg"%>
<%@page import="fcas.sys.com.servlet.SystemCode"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%
	String biz_item_1 = SystemCode.getCode("biz_item_1");
	String biz_item_2 = SystemCode.getCode("biz_item_2");
	String biz_item_3 = SystemCode.getCode("biz_item_3");
%>
<!DOCTYPE>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Ext JS 4.1 & rMate Chart Test Page</title>
	<%@ include file="/common/common.jsp" %>
	<%@ include file="/common/common_report.jsp" %>
	<script type="text/javascript">
		var biz_item_1 = '<%=biz_item_1%>';
		var biz_item_2 = '<%=biz_item_2%>';
		var biz_item_3 = '<%=biz_item_3%>';
	</script>
	<!-- <script type="text/javascript" src="/js/extjs-4.1.0/calendar/CalendarPanel.js"></script> -->
	<script type="text/javascript" src="test.js"></script>
</head>
<body>
	<div id="search_div" style=""></div>
	<div id="main_div" style=""></div>
	<iframe id="chart_frame" width="100%" height="400px" frameBorder="0" src="test_chart.jsp"><</iframe> 
</body>
</html>