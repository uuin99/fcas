<%@page import="java.net.*,java.io.*" %><%
	response.setContentType("text/xml;charset=utf-8");

	RequestDispatcher dispatcher = request.getRequestDispatcher("./rexservice.jsp?ID=SLI");

    dispatcher.forward(request, response);
 
	//out.println(fnGetLicense(request.getRequestURL().toString()));
%><%!
	public String fnGetLicense(String sUrl) {

		StringBuilder oStringBuilder = new StringBuilder("");
		String buf = "";

		try {
			sUrl = sUrl.substring(0, sUrl.lastIndexOf('/')) +  "/rexservice.jsp";

			URL oUrl = new URL(sUrl);
			URLConnection oCon = oUrl.openConnection();
			oCon.setRequestProperty("Accept-Charset", "UTF-8");
			oCon.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

			oCon.setDoOutput(true);

			OutputStreamWriter writer = new OutputStreamWriter(oCon.getOutputStream());
			writer.write("ID=SLI");
			writer.flush();
	
			InputStream is = oCon.getInputStream();

			BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));

			while((buf = br.readLine()) != null){
				oStringBuilder.append(buf + "\r\n");
			}
		} catch (Exception e) {
			return e.getMessage();
		}

		return oStringBuilder.toString();
	}
%>