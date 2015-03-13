<%@page import="fcas.sys.com.servlet.SystemCode"%>
<%@page import="fcas.sys.com.servlet.SystemMsg"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%
	String PGMNAME = request.getParameter("PGMNAME").toString();
	String PGMPATH = request.getParameter("PGMPATH").toString();
	String fail_type = SystemCode.getCode("fail_type");
	String fail_stat = SystemCode.getCode("fail_stat");

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
		var fail_type = '<%=fail_type%>';
		var fail_stat = '<%=fail_stat%>';
	</script>
	<script type="text/javascript" src="/js/common/common_comp_popup.js"></script>
	<script type="text/javascript" src="/js/common/common_shop_popup.js"></script>
	<script type="text/javascript" src="/common/filemast/commonFileMastV01.js"></script>
	<script type="text/javascript" src="../fcas_fail_info_001.js"></script>
</head>
<body style="padding:17px 20px 30px 20px; color:#464646; letter-spacing:-1px; font-family:맑은 고딕, 돋움, 굴림;">
	<div id="prog_div"><div id="prog_nm"><%=PGMNAME%></div><div id="prog_path"><%=PGMPATH%></div></div>
	<div id="search_div" style="padding:2px; border:1px; border-style:solid; border-color:rgb(153, 188, 232);"></div>
	<div id="main_div" style="padding-top:10px;"></div>
</body>
</html>