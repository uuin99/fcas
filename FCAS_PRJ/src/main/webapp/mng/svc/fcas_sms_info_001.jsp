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
	<style type="text/css">
		.x-panel-body-default-framed{ background-color:white; }
	</style>
	<script type="text/javascript">
		var timeCd = '<%=SystemCode.getCode("time_cd")%>';
		var minCd = '<%=SystemCode.getCode("min_cd")%>';
	</script>
	<link rel="stylesheet" type="text/css" href="/js/extjs-4.1.0/plugin/ExtJS.ux.CheckColumn.Plugins/css/CheckHeader.css" />	
	<script type="text/javascript" src="/js/extjs-4.1.0/plugin/ExtJS.ux.CheckColumn.Plugins/src/CheckColumn.js"></script>	
	<script type="text/javascript" src="/common/filemast/commonFileMastV01.js"></script>
	<script type="text/javascript" src="/js/common/common_addr_popup.js"></script>
	<script type="text/javascript" src="../fcas_sms_info_001.js"></script>
</head>
<body id="prog_body">
	<div id="prog_div"><div id="prog_nm"><%=PGMNAME%></div><div id="prog_path"><%=PGMPATH%></div></div>
	<div id="main_div"></div>
</body>
</html>