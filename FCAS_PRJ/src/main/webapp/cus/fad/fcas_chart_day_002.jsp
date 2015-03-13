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
	<script type="text/javascript">
		var chart_day = '<%=SystemCode.getCode("chart_day_new")%>';
	</script>
	<script type="text/javascript" src="../fcas_chart_day_002.js"></script>
</head>
<body id="prog_body" style="overflow:hidden;">
	<div id="prog_div"><div id="prog_nm"><%=PGMNAME%></div><div id="prog_path"><%=PGMPATH%></div></div>
	<div id="search_div"></div>
	<div id="button_div" style="margin-top:10px;"></div>
	<div id="chart_div" style="width:818px; height:500px; padding:10px 0px 0px 0px; position:relative;"></div>
	<div id="chart1_div" style="width:409px; height:500px; padding:10px 5px 0px 0px; float:left; display:none; position:relative;"></div>
	<div id="chart2_div" style="width:409px; height:500px; padding:10px 0px 0px 5px; float:left; display:none; position:relative;"></div>
</body>
</html>