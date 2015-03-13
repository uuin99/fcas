<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import ="fcas.sys.com.model.LoginModel" %>
<%
	LoginModel loginModel = (LoginModel)session.getAttribute("LoginModel");
%>
<script>
var gvUserId      = "<%=loginModel.getUserId()%>";
var gvUserNm      = "<%=loginModel.getUserNm()%>";
var gvAuth        = "<%=loginModel.getAuth()%>";
var gvUserType    = "<%=loginModel.getUserType()%>";
var gvUserIp      = "<%=loginModel.getUserIp()%>";
var gvLoginId     = "<%=loginModel.getLoginId()%>";
var gvCompId      = "<%=loginModel.getCompId()%>";
var gvCompNm      = "<%=loginModel.getCompNm()%>";
var gvShopId      = "<%=loginModel.getShopId()%>";
var gvShopNm      = "<%=loginModel.getShopNm()%>";
var gvDeptNm      = "<%=loginModel.getDeptNm()%>";
var gvPosiNm      = "<%=loginModel.getPosiNm()%>";
var gvCellNo      = "<%=loginModel.getCellNo()%>";
var gvTelNo       = "<%=loginModel.getTelNo()%>";
var gvFaxNo       = "<%=loginModel.getFaxNo()%>";
var gvEmailId     = "<%=loginModel.getEmailId()%>";
var gvEmailDomain = "<%=loginModel.getEmailDomain()%>";

var gvLoginPwdChngDate = "<%=loginModel.getLoginPwdChngDate()%>";
var gvAuthType = "<%=loginModel.getAuthType()%>";
var gvCompDiv = "<%=loginModel.getCompDiv()%>";
</script>