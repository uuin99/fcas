<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="fcas.sys.com.servlet.SystemMsg"%>
<%
	String msgMap = SystemMsg.getMsgMap();
%>
<script>
var msgProperty = Ext.decode('<%=msgMap%>');
</script>