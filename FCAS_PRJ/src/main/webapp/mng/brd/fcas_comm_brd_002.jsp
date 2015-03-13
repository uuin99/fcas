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
	<script type="text/javascript" >
		/** 게시판 설정 **/
		
		//게시판 ID
		var brdId 	= "<c:out value='${BRD_ID}'/>";
		//게시판 유형
		var brdType = "<c:out value='${BRD_TYPE}'/>";
		//Program Id.
		var progId = "<c:out value='${PROG_ID}'/>";
		//Board Auth
		var brdAuth = "<c:out value='${BRD_AUTH}'/>";
		
		/** 게시판 설정 **/
		
	</script>
	<script type="text/javascript" src="/common/filemast/commonFileMastV01.js"></script>
	<script type="text/javascript" src="../fcas_comm_brd_002.js"></script>
</head>
<body id="prog_body">
	<div id="prog_div"><div id="prog_nm"><%=PGMNAME%></div><div id="prog_path"><%=PGMPATH%></div></div>
	<div id="search_div"></div>
	<div id="main_div"></div>
</body>
</html>