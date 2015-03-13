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
	<script type="text/javascript">
	</script>
	<script type="text/javascript" src="/js/common/common_shop_popup.js"></script>
	<script type="text/javascript" src="../fcas_day_stat_001.js"></script>
	<script type="text/javascript">
		function fnUnload(){
			document.getElementById('rex_iframe').src = '';
		}
	</script>
</head>
<body onunload="fnUnload()" style="padding:17px 20px 30px 20px; color:#464646; letter-spacing:-1px;">
	<div id="prog_div"><div id="prog_nm"><%=PGMNAME%></div><div id="prog_path"><%=PGMPATH%></div></div>
	<div id="search_div"></div>
	<div id="main_div"></div>
	<div id="mainShow_div" style="padding:10px 0px 0px 0px; width:818px; height:1074px;">
		<iframe id="rex_iframe" src="" style="width:100%; height:100%; border:0; padding:0px;"></iframe>
	</div>
</body>
</html>