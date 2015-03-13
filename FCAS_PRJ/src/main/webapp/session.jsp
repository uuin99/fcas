<%@ page import="fcas.sys.com.servlet.SystemCode"%>
<%@ page import ="fcas.sys.com.model.LoginModel" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%
LoginModel loginModel = (LoginModel)session.getAttribute("LoginModel");
%>
<!DOCTYPE>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Face !nsight</title>
<script type="text/javascript">

</script>
</head>

<body>
<div class="loginbox">
	<div id="search_div" style=""></div>
	<div id="main_div" style=""></div>

	<dl class="login_c">
		<dt>세션id</dt>
		<dd><%=session.getId()%></dd>

		<dt>아이디</dt>
		<dd><%=loginModel.getUserId()%></dd>

		<dt>아이피</dt>
		<dd><%=loginModel.getUserIp()%></dd>

		<dt>이름</dt>
		<dd><%=loginModel.getUserNm()%></dd>

		<dt>권한</dt>
		<dd><%=loginModel.getAuth()%></dd>

		<dt>유형</dt>
		<dd><%=loginModel.getUserType()%></dd>

		<dt>LOGIN_id</dt>
		<dd><%=loginModel.getLoginId()%></dd>


	</dl>
</div>
</body>
</html>