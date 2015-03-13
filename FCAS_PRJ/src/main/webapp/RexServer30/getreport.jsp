<%@ page 
	contentType="text/html;charset=euc-kr"
%><%@page import="java.util.*, java.io.*, java.lang.String, java.text.*, java.net.*" %><%
//	request.setCharacterEncoding("utf-8");

	//------------------------------------
	// 0. 파라메터 받음
	//------------------------------------
	String sReportName = (request.getParameter("rptname") == null ? "" : request.getParameter("rptname"));

	//------------------------------------
	// 1. 상수 정의
	//------------------------------------
	//String sBasePath = "D:\\rexpert30\\RexServer30\\rebfiles\\samples\\";
	String sBasePath = application.getRealPath("/") + "/rebfiles/";

	sReportName = unescape(sReportName);

	sReportName += ".reb";

//System.out.println(sReportName);

	//------------------------------------
	// 4. export 파일 읽어서 전송
	//------------------------------------
	File file = new File(sBasePath + "" + sReportName); // 절대경로 
	byte b[] = new byte[4062]; 
	response.reset();

	String strClient=request.getHeader("User-Agent"); 
	if(strClient.indexOf("MSIE 5.5")>-1) 
	{ 
		response.setContentType("Content-type: application/x-msdownload; charset=euc-kr"); 
		response.setHeader("Content-Disposition", "attachment;filename=report.reb"); //+new String(sReportName.getBytes("euc-kr"),"8859_1")); 
		//response.setHeader("Content-Disposition", "attachment;filename="+sReportName); 
	} else { 
		response.setContentType("Content-type: application/x-msdownload; charset=euc-kr"); 
		response.setHeader("Content-Disposition", "attachment;filename=report.reb"); //+new String(sReportName.getBytes("euc-kr"),"8859_1")); 
		//response.setHeader("Content-Disposition", "attachment;filename="+sReportName); 
	} 

	response.setHeader("Content-Transfer-Encoding", "binary;"); 
	response.setHeader("Pragma", "no-cache;"); 
	response.setHeader("Expires", "0;"); 
	response.setContentLength((int)file.length()); //파일크기를 브라우저에 알려준다. 
	// IE 5.5는 형식이 다르므로 헤더를 각각 다르게 처리해 준다. 

	if (file.isFile()) 
	{
		out.clear();

		BufferedInputStream fin = new BufferedInputStream(new FileInputStream(file)); 
		BufferedOutputStream outs = new BufferedOutputStream(response.getOutputStream()); 
		int read = 0; 
		while ((read = fin.read(b)) != -1){ 
			outs.write(b,0,read);
			outs.flush();
		} 
		outs.close(); 
		fin.close(); 

		//out = pageContext.pushBody();
	} 

	file = null;
%><%!
	private String getCurrentPath(ServletContext application, HttpServletRequest request)
	{
	    return new File(
	        application.getRealPath(
	            request.getServletPath()
	        )
	    ).getParentFile().getAbsolutePath();
	}
	
	public String escape(String src) {   
		int i;   
		char j;   
		StringBuffer tmp = new StringBuffer();   
		tmp.ensureCapacity(src.length() * 6);
	
		for (i = 0; i < src.length(); i++) {   
			j = src.charAt(i);
			if (Character.isDigit(j) || Character.isLowerCase(j)
			 || Character.isUpperCase(j))
				tmp.append(j);   
			else if (j < 256) {   
				tmp.append("%");   
				if (j < 16)   
					tmp.append("0");   
				tmp.append(Integer.toString(j, 16));   
			} else {   
				tmp.append("%u");   
				tmp.append(Integer.toString(j, 16));   
			}
		}
		return tmp.toString();   
	}
	
	 public String unescape(String src) {   
		StringBuffer tmp = new StringBuffer();   
		tmp.ensureCapacity(src.length());   
		int lastPos = 0, pos = 0;   
		char ch; 
	
		while (lastPos < src.length()) {   
			pos = src.indexOf("%", lastPos);   
			if (pos == lastPos) {   
				if (src.charAt(pos + 1) == 'u') {   
					ch = (char) Integer.parseInt(src.substring(pos + 2, pos + 6), 16);   
					tmp.append(ch);
					lastPos = pos + 6;
				} else {
					ch = (char) Integer.parseInt(src.substring(pos + 1, pos + 3), 16);   
					tmp.append(ch);
					lastPos = pos + 3;
				}
			} else {   
				if (pos == -1) {   
					tmp.append(src.substring(lastPos));   
					lastPos = src.length();   
				} else {   
					tmp.append(src.substring(lastPos, pos));   
					lastPos = pos;   
				}   
			}
		}
	
		return tmp.toString();   
	 }
%>