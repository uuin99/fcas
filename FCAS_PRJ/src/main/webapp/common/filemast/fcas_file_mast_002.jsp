<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Face !nsight</title>
	<%@ include file="/common/common.jsp" %>
	<script type="text/javascript">
		function fnFileSubmit(){
			alert();
			var frm = document.detailForm;
			frm.target = "hiddenFrame";
			frm.action = "/sys/com/common/insertFile.do";			
			frm.submit();
		}
		
		function fnWinCls(){
			this.close();
		}
	</script>
</head>
<body>
	파일업로드 Sample Popup<br>
	<form name="detailForm" id="detailForm" method="post" enctype="multipart/form-data">
		File1 : <input type="file" name="uploadFile1" id="uploadFile1" size="20" class="box_dis"/><br>
		File2 : <input type="file" name="uploadFile2" id="uploadFile2" size="20" class="box_dis"/><br>
		File3 : <input type="file" name="uploadFile3" id="uploadFile3" size="20" class="box_dis"/><br>
		<input type="button" name="fileSubmitBtn" id="fileSubmitBtn" value='전송' onclick="fnFileSubmit();"/>
		<input type="button" name="winClsBtn" id="winClsBtn" value='닫기' onclick="fnWinCls();"/>
	</form>
	<iframe id="hiddenFrame" width="1000px" height="100px" name="hiddenFrame" src="" frameborder="1"></iframe>
</body>
</html>