<%@ page import ="fcas.sys.com.model.LoginModel" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%

String sessionId = request.getParameter("sessionId").toString();
LoginModel.invalidate(sessionId);

out.print("suc");

%>
