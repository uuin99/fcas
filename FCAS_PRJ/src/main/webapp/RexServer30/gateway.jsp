<%@page contentType="text/html;charset=euc-kr" %>
<%@page import="java.util.*" %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=euc-kr">
<script language="javascript">
	function fnGetParam() {
		var sParam = window.location.search;

		sParam = sParam.substr(1);

		document.getElementById('frmMain').rex_param.value = sParam;
		document.getElementById('frmMain').submit();
	}
</script>
</head>
<body onLoad="javascript:fnGetParam(); //javascript:document.getElementById('frmMain').submit();">
<form name="frmMain" id="frmMain" method="POST" action="viewer2.jsp">
<%

	//request.setCharacterEncoding("EUC-KR");
	Enumeration paramNames = request.getParameterNames();
	String param = null;

	String sKey = "";
	String sKeyVal = "";

	while (paramNames.hasMoreElements()) {
		String name = (String)paramNames.nextElement();

		//sKey = new String(name.getBytes("ISO-8859-1"), "EUC-KR");
		sKey = name;

		String value = request.getParameter(name); 
		//sKeyVal = new String(value.getBytes("ISO-8859-1"), "EUC-KR");
		sKeyVal = value;

%>
<input type="hidden" name="<%=sKey%>" value="<%=sKeyVal%>">
<%
	}
	//request.setCharacterEncoding("UTF-8");
%>
<input type="hidden" name="rex_param" value="">
</form>
</body>
</html>