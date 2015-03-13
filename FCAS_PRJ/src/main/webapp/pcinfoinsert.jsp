<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.sql.*" %>
<%@ page import="java.util.ResourceBundle" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	request.setCharacterEncoding("utf-8");  //Set encoding
	// post 방식 체크
	if( request.getMethod().equals("POST")){
		//POST로 FA설치 PC로부터 입력받은 내용을 변수화
		String sid  = request.getParameter("sid");  // serial id
		String etc  = request.getParameter("etc");  // ect
		ResourceBundle bundle = null;
		// null, length 체크
		if( !(sid == null || sid.equals("")) && sid.length() == 7){
			try {
				bundle = ResourceBundle.getBundle("kjs");
				String url = bundle.getString("url");
				String dbid = bundle.getString("dbid");
				String dbpw = bundle.getString("dbpw");
				// DBConnection JDBC 드라이버 로드
				Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
				Connection conn = DriverManager.getConnection(url, dbid, dbpw);
				// Statement 객체를 통해서 쿼리를 수행
				Statement stmt = conn.createStatement();
				String sql = "INSERT INTO [dbo].[fca_pc_stat_test] VALUES('"+sid+"','"+etc+"',GETDATE())";
				stmt.execute(sql);
				// 접속을 해제하고 연결된 자원을 반납한다.
				stmt.close();
				conn.close();
			} catch(Exception e){
				System.out.println( "Err: "+e.toString() );
			}
		}
	}
	response.sendRedirect("pctest.html");

%>
