<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/javascript">
var msg = '<c:out value="${msg}"/>';

if (msg != '') {
    alert(msg);
}


top.document.location.href = "/sys/com/Login/selectLoginView.do";

</script>
