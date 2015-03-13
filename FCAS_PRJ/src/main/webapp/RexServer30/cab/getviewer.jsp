<%@ page 
	contentType="text/html;charset=euc-kr"
%><%@page import="java.util.*, java.io.*, java.lang.String, java.text.*, java.net.*" %><%
	//	request.setCharacterEncoding("utf-8");

	//------------------------------------
	// 0. get parameter
	//------------------------------------
	String sFileName = (request.getParameter("f") == null ? "" : request.getParameter("f"));

	//------------------------------------
	// 1. define constants
	//------------------------------------
	String sBasePath = "";	// "C:/running/RexServer30/rexscript/";

	sBasePath = getCurrentPath(application, request) + "/";

	//String sBasePath = application.getRealPath("/") + "/rebfiles/";
	//sReportName = unescape(sReportName);

	File file = new File(sBasePath + "" + sFileName);

	byte b[] = new byte[4062]; 

	response.reset();

	String strClient=request.getHeader("User-Agent"); 
	if(strClient.indexOf("MSIE 5.5")>-1) 
	{
		response.setContentType("Content-type: application/x-msdownload; charset=utf-8"); 
		response.setHeader("Content-Disposition", "attachment;filename=" + sFileName); //+new String(sReportName.getBytes("euc-kr"),"8859_1")); 
	} else { 
		response.setContentType("Content-type: application/x-msdownload; charset=utf-8"); 
		response.setHeader("Content-Disposition", "attachment;filename=" + sFileName); //+new String(sReportName.getBytes("euc-kr"),"8859_1")); 
	}

	response.setHeader("Content-Transfer-Encoding", "binary;"); 
	response.setHeader("Pragma", "no-cache;"); 
	response.setHeader("Expires", "0;"); 
	response.setContentLength((int)file.length()); // file size 

	if (file.isFile()) 
	{
		out.clear();
		out = pageContext.pushBody();

		BufferedInputStream fin = new BufferedInputStream(new FileInputStream(file)); 
		BufferedOutputStream outs = new BufferedOutputStream(response.getOutputStream()); 
		int read = 0; 
		while ((read = fin.read(b)) != -1){ 
			outs.write(b,0,read);
			outs.flush();
		}

		outs.close(); 
		fin.close(); 

		/*
		InputStream buffInStm = adapter.getFileStream(fileType, filePath, fileName, false);
		OutputStream buffOutStm = response.getOutputStream();

		int num = 0;
		
		while ((num = buffInStm.read()) != -1) {
			buffOutStm.write(num);         
		}
		
		buffInStm.close();
		buffOutStm.close();
		*/
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
     ch = (char) Integer.parseInt(src   
       .substring(pos + 2, pos + 6), 16);   
     tmp.append(ch);   
     lastPos = pos + 6;   
    } else {   
     ch = (char) Integer.parseInt(src   
       .substring(pos + 1, pos + 3), 16);   
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