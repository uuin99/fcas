<%@page import="fcas.sys.com.servlet.SystemCode"%>
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
	<style type="text/css">
		.x-panel-body-default-framed{ background-color:white; }
	</style>
	<script type="text/javascript">
		var email = '<%=SystemCode.getCode("email")%>';
		var biz_item_1 = '<%=SystemCode.getCode("biz_item_1")%>';
		var biz_item_2 = '<%=SystemCode.getCode("biz_item_2")%>';
		var biz_item_3 = '<%=SystemCode.getCode("biz_item_3")%>';
	</script>
	<script type="text/javascript" src="/js/common/common_comp_popup.js"></script>
	<script type="text/javascript" src="/js/common/common_addr_popup.js"></script>
	<script type="text/javascript" src="/js/common/common_kwth_addr_popup.js"></script>
	<script type="text/javascript" src="../fcas_shop_001.js"></script>
</head>
<body id="prog_body">
	<div id="prog_div"><div id="prog_nm"><%=PGMNAME%></div><div id="prog_path"><%=PGMPATH%></div></div>
	<div id="search_div"></div>
	<div id="main_div"></div>
</body>
</html>