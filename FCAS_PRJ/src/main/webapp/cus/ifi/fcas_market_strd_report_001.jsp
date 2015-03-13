<%@page import="fcas.sys.com.servlet.SystemCode"%>
<%@page import="fcas.sys.com.servlet.SystemMsg"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%
	String PGMNAME = request.getParameter("PGMNAME").toString();
	String PGMPATH = request.getParameter("PGMPATH").toString();

	String biz_item_1 = SystemCode.getCode("biz_item_1");
	String biz_item_2 = SystemCode.getCode("biz_item_2");
	String biz_item_3 = SystemCode.getCode("biz_item_3");
%>
<!DOCTYPE>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Face !nsight</title>
	<%@ include file="/common/common.jsp" %>
	<script type="text/javascript" src="/js/jquery/jquery-1.7.1.js"></script>
	<script type="text/javascript">
		var biz_item_1 = '<%=biz_item_1%>';
		var biz_item_2 = '<%=biz_item_2%>';
		var biz_item_3 = '<%=biz_item_3%>';
	</script>
	<script type="text/javascript" src="/js/common/common_comp_popup.js"></script>
	<script type="text/javascript" src="/js/common/common_shop_popup.js"></script>
	<script type="text/javascript" src="../fcas_market_strd_report_001.js"></script>
</head>
<body style="padding:17px 20px 30px 20px; color:#464646; letter-spacing:-1px;">
	<div id="prog_div"><div id="prog_nm"><%=PGMNAME%></div><div id="prog_path"><%=PGMPATH%></div></div>
	<div id="search_div" style="padding:2px; border:1px; border-style:solid; border-color:rgb(153, 188, 232);"></div>
	<div id="main_div" style="padding-top:10px;"></div>
	<div id="mainShow_div" style="padding-top:10px;">
	<iframe id="nice_iframe" frameborder='0' width='100%' height='100%' scrolling='no' src="" style="width:100%; height:5800px; border:0;"></iframe>
	</div>
</body>
</html>