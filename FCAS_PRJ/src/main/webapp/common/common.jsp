<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link type="text/css" rel="stylesheet" href="<c:url value='/js/extjs-4.1.0/resources/css/ext-all.css'/>"/>
<link type="text/css" rel="stylesheet" href="<c:url value='/css/main.css'/>"/>
<style type="text/css">
.x-column-header-inner {
    text-align: center;
}
.x-boundlist-item img.chkCombo {
    background: transparent url(/js/extjs-4.1.0/resources/themes/images/default/menu/unchecked.gif);
    width: 16px;
    height: 16px;
    border: 0px;
}
.x-boundlist-selected img.chkCombo {
    background: transparent url(/js/extjs-4.1.0/resources/themes/images/default/menu/checked.gif);
    width: 16px;
    height: 16px;
    border: 0px;
}
</style>
<script type="text/javascript" src="<c:url value='/js/extjs-4.1.0/ext-all.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/extjs-4.1.0/locale/ext-lang-ko.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/extjs-4.1.0/plugin/NumericField.js'/>"></script>
<%@ include file="/common/common_session.jsp" %>
<%@ include file="/common/common_message.jsp" %>
<script type="text/javascript" src="<c:url value='/js/common/common_function.js'/>"></script>
