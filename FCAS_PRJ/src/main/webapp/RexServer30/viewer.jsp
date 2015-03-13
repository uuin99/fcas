<%@ page language="java" contentType="text/html; charset=euc-kr"  pageEncoding="euc-kr"%>
<%@page import="java.util.*" %>
<html>
<form name="rexForm" method="post">
<%
		Enumeration params = request.getParameterNames(); 
	
		while (params.hasMoreElements()) { 
			String name = (String)params.nextElement(); 
			String value = request.getParameter(name); 
%>
<input type="hidden" name="<%=name%>" value="<%=value%>">
<%
		}
%>
</form>
<script>
    document.rexForm.action = "viewer2.jsp"; 
    document.rexForm.submit();
</script>
</html>