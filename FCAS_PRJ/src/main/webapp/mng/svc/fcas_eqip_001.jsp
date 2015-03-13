<%@page import="fcas.sys.com.servlet.SystemCode"%>
<%@page import="fcas.sys.com.servlet.SystemMsg"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%
	String PGMNAME = request.getParameter("PGMNAME").toString();
	String PGMPATH = request.getParameter("PGMPATH").toString();
	String cmra_stat = SystemCode.getCode("cmra_stat");
%>
<!DOCTYPE>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Face !nsight</title>
	<%@ include file="/common/common.jsp" %>
	<script type="text/javascript">
		var cmra_stat = '<%=cmra_stat%>';
	</script>
	<script type="text/javascript" src="/js/common/common_comp_popup.js"></script>
	<script type="text/javascript" src="/js/common/common_shop_popup.js"></script>
	<script type="text/javascript" src="/js/common/common_eqip_grp_popup.js"></script>
	<script type="text/javascript" src="/js/common/common_grid_comp_popup.js"></script>
	<script type="text/javascript" src="/js/common/common_grid_shop_popup.js"></script>
	<script type="text/javascript" src="/js/common/common_grid_eqip_grp_popup.js"></script>
	<script type="text/javascript" src="../fcas_eqip_001.js"></script>
</head>
<body style="padding:17px 20px 30px 20px; color:#464646; letter-spacing:-1px; font-family:맑은 고딕, 돋움, 굴림;">
	<div id="prog_div"><div id="prog_nm"><%=PGMNAME%></div><div id="prog_path"><%=PGMPATH%></div></div>
	<div id="search_div" style="padding:2px; border:1px; border-style:solid; border-color:rgb(153, 188, 232);"></div>
	<div id="main_div" style="padding-top:10px;"></div>
</body>
</html>