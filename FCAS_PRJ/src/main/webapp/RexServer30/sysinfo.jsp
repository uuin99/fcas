<%@page import="java.util.*,java.text.*,java.net.InetAddress,java.text.SimpleDateFormat" %><%

	response.setContentType("text/html;charset=UTF-8");

	Runtime runtime = Runtime.getRuntime();
	int iCpu = runtime.availableProcessors();

	out.println("CPU count : " + iCpu + "<br>");

	String sIpAddr = InetAddress.getLocalHost().getHostAddress();	

	out.println("IP Address : " + sIpAddr + "<br>");
	
	SimpleDateFormat simpledateformat = new SimpleDateFormat("yyyy/MM/dd");
	String sCurrDate = simpledateformat.format(new Date());
	
	
	out.println("Date : " + sCurrDate + "<br>");

%>