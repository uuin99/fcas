<%@ page language="java" contentType="text/html; charset=euc-kr"  pageEncoding="euc-kr"%>
<%@page import="java.util.*" %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=euc-kr">
<title>simple</title>
<script language="javascript" src="./rexscript/rexpert.js"></script>
<script language="javascript" src="./rexscript/rexpert_properties.js"></script>

</head>
<script language="JavaScript">
function fnopen()
{
	var oReport = GetfnParamSet("0");

	//oReport.rptname = "testserver";

	<%
		Enumeration params = request.getParameterNames(); 
	
		while (params.hasMoreElements()) { 
			String name = (String)params.nextElement(); 
			String value = request.getParameter(name); 
			
			if( name.equals("rex_rptname") ){
	
	%>
			oReport.rptname = "<%=value%>";
	//alert("rebname:" + "<%=value%>");
	<%
			} 
			if(  name.equals("rex_db") ){
	%>
			oReport.connectname= "<%=value%>";
	//alert("db:" + "<%=value%>");

	<%
			}
	%>

		oReport.param("<%=name%>").value = "<%=value%>";

	<%		
		}	
	%>

	//oReport.param("t1").value = "bbb";
	//oReport.param("t2").value = "ccc";

	oReport.iframe(ifrmRexPreview1);
	//oReport.open();

	//rptname=test&t1=bbb&t2=ccc
}

</script>
<body onload="fnopen()" leftmargin=0 topmargin=0 scroll=no>
	<iframe id="ifrmRexPreview1" src="" width="100%" height="100%"></iframe>
</body>
</html>