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
	
    <link rel="stylesheet" type="text/css" href="/js/extjs-4.1.0/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/resources/css/htmleditorplugins.css" />	
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.MidasCommand.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.Divider.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.HR.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.Image.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.RemoveFormat.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.IndentOutdent.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.SubSuperScript.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.RemoveFormat.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.FindAndReplace.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.Table.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.Word.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.Link.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.SpecialCharacters.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.UndoRedo.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.Heading.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.Plugins.js"></script>
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
	    // this is how to override language strings in Midas Buttons
		if(Ext.ux.form.HtmlEditor.UndoRedo){
		   Ext.ux.form.HtmlEditor.UndoRedo.prototype.midasBtns[1].tooltip.title = "Oh crap - go back to the way it was!";
		}		
	</script>
	<script type="text/javascript" src="/common/filemast/commonFileMastV01.js"></script>
	<script type="text/javascript" src="../fcas_comm_brd_001.js"></script>
</head>
<body id="prog_body">
	<div id="prog_div"><div id="prog_nm"><%=PGMNAME%></div><div id="prog_path"><%=PGMPATH%></div></div>
	<div id="search_div"></div>
	<div id="main_div"></div>
</body>
</html>