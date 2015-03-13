<%@page import="fcas.sys.com.servlet.SystemCode"%>
<%@page import="fcas.sys.com.servlet.SystemMsg"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%
	String PGMNAME = request.getParameter("PGMNAME").toString();
	String PGMPATH = request.getParameter("PGMPATH").toString();
%>
<!DOCTYPE>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Face !nsight</title>
	<%@ include file="/common/common.jsp" %>
	<%@ include file="/common/common_chart.jsp" %>
	<script type="text/javascript" src="/js/common/common_shop_popup.js"></script>
	<script type="text/javascript" src="/js/common/common_eqip_grp_popup.js"></script>
	<script type="text/javascript" src="../test_chart_002.js"></script>
</head>
<body id="prog_body">
	<div id="prog_div"><div id="prog_nm"><%=PGMNAME%></div><div id="prog_path"><%=PGMPATH%></div></div>
	<div id="search_div"></div>
	<div id="button_div" style="margin-top:10px;"></div>
	<div id="chart_div1" style="width:400px; height:500px; padding-top:10px; float:left;"></div>
	<div id="chart_div2" style="width:400px; height:500px; padding-top:10px; float:left;"></div>
</body>
</html>